package fi.tuni.aaniohjaus

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.os.Looper
import com.google.android.gms.location.*
import com.google.android.gms.location.LocationRequest.Builder

/**
* A utility object for handling location-related operations, such as starting and stopping
* location updates, checking GPS status, and setting location components.
*/
object LocationUtils {
    /**
     * The current address associated with the user's location.
     */
    var address : Address? = null
    /**
     * The client for accessing the Fused Location Provider API.
     */
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    /**
     * The request for location updates.
     */
    private lateinit var locationRequest: LocationRequest
    /**
     * The callback for location updates.
     */
    private lateinit var locationCallback: LocationCallback
    /**
     * Whether location updates have been requested.
     */
    private var isLocationUpdatesRequested = false

    /**
     * Sets the location components needed for location updates.
     *
     * @param activity The current activity.
     */
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
            }
        }
    }

    /**
     * Checks whether GPS is enabled on the device.
     *
     * @param context The current context.
     * @return true if GPS is enabled, false otherwise.
     */
    fun checkGPS(context: Context): Boolean {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
    }

    /**
     * Starts location updates.
     */
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

    /**
     * Stops location updates.
     */
    fun stopUpdating() {
        fusedLocationClient.flushLocations()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        isLocationUpdatesRequested = false
    }
}