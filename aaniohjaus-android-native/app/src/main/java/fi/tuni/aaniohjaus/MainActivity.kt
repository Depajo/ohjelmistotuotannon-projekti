package fi.tuni.aaniohjaus

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.Uri
import android.os.Bundle
import android.os.Looper
import android.provider.Settings
import android.util.Log
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
import com.google.android.gms.location.*
import fi.tuni.aaniohjaus.ui.theme.AaniohjausTheme

class MainActivity : ComponentActivity() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    private var isLocationUpdatesRequested = false
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setLocationComponents()
        checkPermissions()
        val gps = !checkGPS()
        setContent {
            AaniohjausTheme {
                Column {
                    Header()
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color.DarkGray
                    ) {
                        val location by remember { mutableStateOf("Ei sijaintia") }
                        var openDialog by remember { mutableStateOf(gps) }
                        MainContent(location)
                        if (openDialog) {
                            MyAlertDialog() {
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

    private fun setLocationComponents() {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        locationRequest = LocationRequest.create().apply {
            interval = 5000
            fastestInterval = 2500
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                val myIntent = Intent(this@MainActivity, UpdateLocationService::class.java)
                    .putExtra("latitude", locationResult.lastLocation?.latitude)
                    .putExtra("longitude", locationResult.lastLocation?.longitude)
                startService(myIntent)
            }
        }
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
                    if (!isLocationUpdatesRequested) {
                        fusedLocationClient.requestLocationUpdates(locationRequest,
                            locationCallback,
                            Looper.getMainLooper()
                        )
                        isLocationUpdatesRequested = true
                    }
                } else {
                    // PERMISSION NOT GRANTED
                    println(isGranted)
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
fun MainContent(location: String) {
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
                text = location,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(20.dp, 0.dp)
            )
            Spacer(Modifier.height(50.dp))
            Button(
                onClick = {},
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
//                    style = MaterialTheme.typography.body1
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