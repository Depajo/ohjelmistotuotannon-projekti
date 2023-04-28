package fi.tuni.aaniohjaus

import android.Manifest
import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.speech.tts.TextToSpeech
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
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.android.gms.location.*
import fi.tuni.aaniohjaus.ui.theme.AaniohjausTheme
import java.util.*
import kotlin.concurrent.thread

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {
    private lateinit var tts: TextToSpeech
    private var address: Address? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        LocationUtils.setLocationComponents(this)
        checkPermissions()
        val gps = !LocationUtils.checkGPS(this)
        tts = TextToSpeech(this, this)
        setContent {
            AaniohjausTheme {
                Column {
                    Header()
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colors.primary
                    ) {
                        var road by remember { mutableStateOf("Haetaan sijaintia...") }
                        var otherInformation by remember { mutableStateOf("") }
                        var openDialog by remember { mutableStateOf(gps) }
                        MyLocalBroadcastManager(IntentFilter("fetchResult")) {
                            thread {
                                val rootNode = ObjectMapper().readTree(it.getStringExtra("fetchResult"))
                                val addressNode = rootNode[0]
                                address = ObjectMapper().treeToValue(addressNode, Address::class.java)
                                LocationUtils.address = address
                                if (address!!.roadWithHouseNumber() != road) {
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
        LocationUtils.startUpdating()
    }

    override fun onPause() {
        super.onPause()
        LocationUtils.stopUpdating()
    }

    override fun onDestroy() {
        super.onDestroy()
        tts.stop()
        tts.shutdown()
    }

    private fun checkPermissions() {
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
                    LocationUtils.startUpdating()
                } else {
                    Toast.makeText(
                        this,
                        "Anna sijainnin haulle lupa asetuksista",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
            requestPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        } else {
            LocationUtils.startUpdating()
        }
    }

    override fun onInit(status: Int) {
        val finnish = Locale.getAvailableLocales().find {
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
        color = MaterialTheme.colors.secondary,
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
    ) {
        Box {
            Row(
                Modifier.align(Alignment.TopEnd)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.settings_white),
                    contentDescription = "Open application settings",
                    modifier = Modifier
                        .padding(6.dp)
                        .size(50.dp)
                        .clickable {
                            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                            intent.data = Uri.fromParts("package", context.packageName, null)
                            context.startActivity(intent)
                        }
                )
                var mute by remember { mutableStateOf(R.drawable.speaker_white) }
                Image(
                    painter = painterResource(id = mute),
                    contentDescription = "Turn sound on or off",
                    modifier = Modifier
                        .padding(8.dp)
                        .size(50.dp)
                        .clickable {
                            mute = if (mute == R.drawable.speaker_white)
                                R.drawable.speaker_mute_white
                            else
                                R.drawable.speaker_white
                        }
                )
            }
            Row(
                Modifier.align(Alignment.TopStart)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.info),
                    contentDescription = "Open the application's website on web browser",
                    modifier = Modifier
                        .padding(6.dp)
                        .size(50.dp)
                        .clickable {
                            val intent = Intent(Intent.ACTION_VIEW)
                            intent.data = Uri.parse("https://www.google.com")
                            context.startActivity(intent)
                        }
                )
            }
        }
    }
}

@Composable
fun MainContent(road: String, otherInformation: String, buttonCallback: () -> Unit) {
    Box {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.Center)
        ) {
            val soundImageId = if (MaterialTheme.colors.isLight) {
                R.drawable.sound1_black
            } else {
                R.drawable.sound1_white
            }
            Image(
                painter = painterResource(id = soundImageId),
                contentDescription = null,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .size(225.dp, 225.dp)
            )
            Spacer(Modifier.height(75.dp))
            Text(
                text = road,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(20.dp, 0.dp),
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(10.dp))
            Text(
                text = otherInformation,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally),
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(75.dp))
            Button(
                onClick = buttonCallback,
                modifier = Modifier
                    .size(250.dp, 75.dp)
                    .align(Alignment.CenterHorizontally),
                shape = CircleShape,
                colors = ButtonDefaults.buttonColors(MaterialTheme.colors.secondary)
            ) {
                Text(
                    text = "TOISTA OSOITE",
                    fontSize = 24.sp,
                    color = Color.White
                )
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