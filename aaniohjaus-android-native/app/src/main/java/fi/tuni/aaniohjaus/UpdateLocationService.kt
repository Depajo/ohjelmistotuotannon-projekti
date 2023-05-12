package fi.tuni.aaniohjaus

import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import okhttp3.*
import java.io.IOException
import java.util.concurrent.TimeUnit

class UpdateLocationService : Service() {
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val latitude = intent?.getDoubleExtra("latitude", 0.0)
        val longitude = intent?.getDoubleExtra("longitude", 0.0)
        val client = OkHttpClient.Builder().connectTimeout(60, TimeUnit.SECONDS).build()
        val request = Request.Builder()
            .url("https://api.joonatandepascale.fi/api/katutiedot/$latitude/$longitude")
            .build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }

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

    override fun onDestroy() {
        super.onDestroy()
    }
}