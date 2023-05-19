package fi.tuni.aaniohjaus

import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import okhttp3.*
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Service responsible for updating the location and fetching address information from an API.
 */
class UpdateLocationService : Service() {

    /**
     * Called when the service is bound to an activity. (Not used)
     *
     * @param intent The intent passed to the service.
     * @return The communication channel to the service.
     */
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    /**
     * Called when the service is started.
     *
     * @param intent The intent passed to the service.
     * @param flags Additional data about the service start request.
     * @param startId A unique integer representing the start request.
     * @return The service's behavior on restart attempts.
     */
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val latitude = intent?.getDoubleExtra("latitude", 0.0)
        val longitude = intent?.getDoubleExtra("longitude", 0.0)
        val client = OkHttpClient.Builder().connectTimeout(60, TimeUnit.SECONDS).build()
        val request = Request.Builder()
            .url("https://api.joonatandepascale.fi/api/katutiedot/$latitude/$longitude")
            .build()
        client.newCall(request).enqueue(object : Callback {

            /**
             * Called when the HTTP request fails.
             *
             * @param call The call that was executed.
             * @param e The exception thrown.
             */
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }

            /**
             * Called when the HTTP response is received.
             *
             * @param call The call that was executed.
             * @param response The HTTP response.
             */
            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!response.isSuccessful) throw IOException("Unexpected code $response")
                    val responseBodyString = response.body!!.string()
                    val myIntent: Intent = if (responseBodyString.isEmpty()) {
                        Intent("fetchResult").putExtra("fetchResult", "")
                    } else {
                        Intent("fetchResult").putExtra("fetchResult", responseBodyString)
                    }
                    LocalBroadcastManager.getInstance(this@UpdateLocationService).sendBroadcast(myIntent)
                    stopSelf()
                }
            }
        })
        return START_NOT_STICKY
    }
}