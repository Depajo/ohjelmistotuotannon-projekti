package fi.tuni.aaniohjaus

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.os.Looper
import android.util.Log
//import android.widget.Toast
import com.google.android.gms.location.*
import com.google.android.gms.location.LocationRequest.Builder

object LocationUtils {
    var address : Address? = null
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    private var isLocationUpdatesRequested = false

    fun setLocationComponents(activity: Activity) {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(activity)
        locationRequest = Builder(Priority.PRIORITY_HIGH_ACCURACY, 5000).apply {
            setMinUpdateDistanceMeters(0f)
            setMinUpdateIntervalMillis(2500)
            setGranularity(Granularity.GRANULARITY_PERMISSION_LEVEL)
        }.build()
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
//                val lat = 61.336807
//                val lon = 23.742924
//                Toast.makeText(activity, locationResult.lastLocation!!.speed.toString(), Toast.LENGTH_SHORT).show()
                if (locationResult.lastLocation!!.speed > 1.0 || address == null) {
                    val myIntent = Intent(activity, UpdateLocationService::class.java)
                        .putExtra("latitude", locationResult.lastLocation?.latitude)
                        .putExtra("longitude", locationResult.lastLocation?.longitude)
                    activity.startService(myIntent)
                }
                Log.d("speed", locationResult.lastLocation?.speed.toString())
            }
        }
    }

    fun checkGPS(context: Context): Boolean {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
    }

    @SuppressLint("MissingPermission")
    fun startUpdating() {
        if (!isLocationUpdatesRequested) {
            fusedLocationClient.requestLocationUpdates(locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
            isLocationUpdatesRequested = true
        }
    }

    fun stopUpdating() {
        fusedLocationClient.flushLocations()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        isLocationUpdatesRequested = false
    }
}