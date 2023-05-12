package fi.tuni.aaniohjaus

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.os.Looper
import android.widget.Toast
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
            setMinUpdateDistanceMeters(10f)
            setGranularity(Granularity.GRANULARITY_PERMISSION_LEVEL)
            setWaitForAccurateLocation(true)
        }.build()
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                val location = locationResult.lastLocation
                if (location != null || address == null) {
                    val myIntent = Intent(activity, UpdateLocationService::class.java)
                        .putExtra("latitude", location!!.latitude)
                        .putExtra("longitude", location.longitude)
                    activity.startService(myIntent)
                }
                Toast.makeText(activity, location!!.speed.toString(), Toast.LENGTH_SHORT).show()
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