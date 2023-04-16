package fi.tuni.aaniohjaus

import android.app.Service
import android.content.Intent
import android.os.IBinder
import okhttp3.*
import java.io.IOException
import java.util.concurrent.TimeUnit

class UpdateLocationService : Service() {
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val latitude = intent?.getStringExtra("latitude")
        val longitude = intent?.getStringExtra("longitude")
        val client = OkHttpClient.Builder().connectTimeout(20, TimeUnit.SECONDS).build()
        val request = Request.Builder()
            .url("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=$latitude&lon=$longitude")
            .build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!response.isSuccessful) throw IOException("Unexpected code $response")
                    val myIntent = Intent("fetchResult").putExtra("fetchResult", response.body!!.string())
                    stopSelf()
                }
            }
        })
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}