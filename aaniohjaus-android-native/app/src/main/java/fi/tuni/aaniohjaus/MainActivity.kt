package fi.tuni.aaniohjaus

import android.Manifest
import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.Uri
import android.os.Bundle
import android.os.Looper
import android.provider.Settings
import android.speech.tts.TextToSpeech
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.ActivityCompat
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.android.gms.location.*
import fi.tuni.aaniohjaus.ui.theme.AaniohjausTheme
import java.util.*
import kotlin.concurrent.thread

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    private var isLocationUpdatesRequested = false
    private lateinit var tts : TextToSpeech
    private var address : Address? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setLocationComponents()
        checkPermissions()
        val gps = !checkGPS()
        tts = TextToSpeech(this, this)
        setContent {
            AaniohjausTheme {
                Column {
                    Header()
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color.DarkGray
                    ) {
                        var road by remember { mutableStateOf("Haetaan sijaintia...") }
                        var otherInformation by remember { mutableStateOf("") }
                        var openDialog by remember { mutableStateOf(gps) }
                        MyLocalBroadcastManager(IntentFilter("fetchResult")) {
                            thread {
                                val jsonParser = ObjectMapper().createParser(it.getStringExtra("fetchResult"))
                                val addressNode = jsonParser.readValueAsTree<JsonNode>().get("address")
                                address = ObjectMapper().treeToValue(addressNode, Address::class.java)
                                if (address!!.roadWithHouseNumber() != road && address!!.road != null) {
                                    tts.speak(address!!.roadWithHouseNumber(), TextToSpeech.QUEUE_FLUSH, null, "")
                                }
                                road = address!!.roadWithHouseNumber()
                                otherInformation = address!!.postCodeWithCity()
                            }
                        }
                        MainContent(road, otherInformation) {
                            if (address != null) {
                                tts.speak(address!!.toStringWithPostalCodesSeparated(), TextToSpeech.QUEUE_FLUSH, null, "")
                            }
                        }
                        if (openDialog) {
                            MyAlertDialog {
                                openDialog = false
                            }
                        }
                    }
                }
            }
        }
    }

    @SuppressLint("MissingPermission")
    override fun onResume() {
        super.onResume()
        if (!isLocationUpdatesRequested) {
            fusedLocationClient.requestLocationUpdates(locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        }
    }

    override fun onPause() {
        super.onPause()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        isLocationUpdatesRequested = false
    }

    override fun onDestroy() {
        super.onDestroy()
        tts.stop()
        tts.shutdown()
    }

    private fun setLocationComponents() {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        locationRequest = LocationRequest.create().apply {
            interval = 5000
            fastestInterval = 2500
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                val latitude = kotlin.random.Random.nextDouble(61.50000, 61.55000)
                val longitude = kotlin.random.Random.nextDouble(23.80000, 23.90000)
                val myIntent = Intent(this@MainActivity, UpdateLocationService::class.java)
                    .putExtra("latitude", /*locationResult.lastLocation?.latitude*/latitude)
                    .putExtra("longitude", /*locationResult.lastLocation?.longitude*/longitude)
                startService(myIntent)
            }
        }
    }

    fun checkPermissions() {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            val requestPermissionLauncher = registerForActivityResult(
                ActivityResultContracts.RequestPermission()
            ) { isGranted ->
                if (isGranted) {
                    if (!isLocationUpdatesRequested) {
                        fusedLocationClient.requestLocationUpdates(locationRequest,
                            locationCallback,
                            Looper.getMainLooper()
                        )
                        isLocationUpdatesRequested = true
                    }
                } else {
                    Toast.makeText(this, "Anna sijainnin haulle lupa asetuksista", Toast.LENGTH_LONG).show()
                }
            }
            requestPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        } else {
            if (!isLocationUpdatesRequested) {
                fusedLocationClient.requestLocationUpdates(locationRequest,
                    locationCallback,
                    Looper.getMainLooper()
                )
                isLocationUpdatesRequested = true
            }
        }
    }

    private fun checkGPS(): Boolean {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
    }

    override fun onInit(status: Int) {
        var finnish = Locale.getAvailableLocales().find {
            it.toString() == "fi_FI"
        }
        if (status == TextToSpeech.SUCCESS) {
            val result = tts.setLanguage(finnish)
            if (result == TextToSpeech.LANG_NOT_SUPPORTED || result == TextToSpeech.LANG_MISSING_DATA) {
                tts.language = Locale.ENGLISH
            }
        }
    }
}

@Composable
fun Header() {
    val context = LocalContext.current
    Surface(
        color = Color.Gray,
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
    ) {
        Box {
            Image(
                painter = painterResource(id = R.drawable.settings_black),
                contentDescription = "Turn sound on or off",
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(6.dp)
                    .size(50.dp)
                    .clickable {
                        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                        intent.data = Uri.fromParts("package", context.packageName, null)
                        context.startActivity(intent)
                    }
            )
            var speakerButton by remember { mutableStateOf(R.drawable.speaker_black) }
            Image(
                painter = painterResource(id = speakerButton),
                contentDescription = "Turn sound on or off",
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
                    .size(50.dp)
                    .clickable {
                        speakerButton = if (speakerButton == R.drawable.speaker_black) {
                            R.drawable.speaker_mute_black
                        } else {
                            R.drawable.speaker_black
                        }
                    }
            )
        }
    }
}

@Composable
fun MainContent(road: String, otherInformation: String, buttonCallback: () -> Unit) {
    Box {
        Column(
            Modifier.align(Alignment.Center)
        ) {
            Image(
                painter = painterResource(id = R.drawable.sound1_black),
                contentDescription = null
            )
            Spacer(Modifier.height(50.dp))
            Text(
                text = road,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(20.dp, 0.dp)
            )
            Text(
                text = otherInformation,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
            )
            Spacer(Modifier.height(50.dp))
            Button(
                onClick = buttonCallback,
                modifier = Modifier.size(200.dp, 60.dp),
                shape = CircleShape,
                colors = ButtonDefaults.buttonColors(Color.Gray)
            ) {
                Text(text = "Toista osoite")
            }
        }
    }
}

@Composable
fun MyAlertDialog(callback: () -> Unit) {
    val context = LocalContext.current
    AlertDialog(
        onDismissRequest = {
            callback()
        },
        title = {
            Text(
                text = "GPS ei ole päällä",
                style = MaterialTheme.typography.body1,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Text(
                text = "Sovellus vaatii GPS signaalin toimiakseen",
                style = MaterialTheme.typography.body1
            )
        },
        dismissButton = {
            OutlinedButton(
                onClick = {
                    callback()
                },
                border = BorderStroke(1.dp, Color.Transparent)
            ) {
                Text(
                    text = "Sulje",
                    style = MaterialTheme.typography.body1,
                    color = MaterialTheme.colors.primaryVariant
                )
            }
        },
        confirmButton = {
            OutlinedButton(
                onClick = {
                    callback()
                    val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                    context.startActivity(intent)
                },
                border = BorderStroke(1.dp, Color.Transparent)
            ) {
                Text(
                    text = "Avaa asetukset",
                    style = MaterialTheme.typography.body1
                )
            }
        }
    )
}

@Composable
fun MyLocalBroadcastManager(intentFilter: IntentFilter, onReceive: (Intent) -> Unit) {
    val context = LocalContext.current
    LaunchedEffect(context) {
         val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent) {
                onReceive(intent)
            }
        }
        LocalBroadcastManager.getInstance(context).registerReceiver(receiver, intentFilter)
    }
}