package fi.tuni.aaniohjaus

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Looper
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.*
import fi.tuni.aaniohjaus.ui.theme.AaniohjausTheme

class MainActivity : ComponentActivity() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        locationRequest = LocationRequest.create().apply {
            interval = 10000
            fastestInterval = 5000
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
//                val myIntent = Intent(MainActivity(), UpdateLocationService::class.java)
//                    .putExtra("latitude", locationResult.lastLocation?.latitude)
//                    .putExtra("longitude", locationResult.lastLocation?.longitude)
//                startService(myIntent)
                println("location: ${locationResult.lastLocation?.latitude}, ${locationResult.lastLocation?.longitude}")
            }
        }
        setContent {
            AaniohjausTheme {
                Column {
                    Header()
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color.DarkGray
                    ) {
                        val location by remember { mutableStateOf("Ei sijaintia") }
                        MainContent(location)
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return
        }
        fusedLocationClient.requestLocationUpdates(locationRequest,
            locationCallback,
            Looper.getMainLooper())
    }

    override fun onPause() {
        super.onPause()
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }
}

@Composable
fun Header() {
    Surface(
        color = Color.Gray,
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
    ) {
        Box {
            Button(
                onClick = {},
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(8.dp)
            ) {
                Text(text = "s")
            }
            Button(
                onClick = {},
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
            ) {
                Text(text = "m")
            }
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

@Preview
@Composable
fun MainScreenPreview() {
    AaniohjausTheme {
        Column {
            Header()
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = Color.DarkGray
            ) {
                val location by remember { mutableStateOf("Ei sijaintia") }
                MainContent(location)
            }
        }
    }
}