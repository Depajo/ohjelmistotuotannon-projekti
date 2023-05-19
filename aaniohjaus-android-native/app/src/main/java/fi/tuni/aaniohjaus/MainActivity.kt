package fi.tuni.aaniohjaus

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
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
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.ActivityCompat
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.fasterxml.jackson.databind.ObjectMapper
import fi.tuni.aaniohjaus.ui.theme.AaniohjausTheme
import kotlinx.coroutines.delay
import java.util.*
import kotlin.concurrent.thread

/**
 * The main activity of the application.
 */
class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {
    private lateinit var tts: TextToSpeech
    private var address: Address? = null
    private var mute = false

    /**
     * Called when the activity is starting or restarting.
     * Performs initialization tasks such as setting up location components, checking permissions,
     * initializing TextToSpeech, and configuring the UI.
     *
     * @param savedInstanceState The saved instance state Bundle.
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Set up location components
        LocationUtils.setLocationComponents(this)
        // Check permissions for location access
        checkPermissions()
        // Check if GPS is enabled
        val gps = !LocationUtils.checkGPS(this)
        // Initialize TextToSpeech
        tts = TextToSpeech(this, this)
        setContent {
            AaniohjausTheme {
                Column {
                    // Display the header UI component
                    Header {
                        // Toggle mute state when the header is clicked
                        mute = if (!mute) {
                            if (tts.isSpeaking) {
                                tts.stop()
                            }
                            true
                        } else {
                            false
                        }
                    }
                    // Set the background surface color
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colors.background
                    ) {
                        // Initialize local state variables
                        var road by remember { mutableStateOf("Haetaan sijaintia...") }
                        if (road == "Haetaan sijaintia...") {
                            LocationUtils.address = null
                        }
                        var otherInformation by remember { mutableStateOf("") }
                        var openDialog by remember { mutableStateOf(gps) }
                        // Register a local broadcast receiver to handle location fetch results
                        MyLocalBroadcastManager(IntentFilter("fetchResult")) {
                            thread {
                                if (it.getStringExtra("fetchResult") == "") {
                                    road = "Olet toiminta-alueen"
                                    otherInformation = "ulkopuolella"
                                    return@thread
                                }
                                // Parse the location fetch result
                                val rootNode = ObjectMapper().readTree(it.getStringExtra("fetchResult"))
                                val addressNode = rootNode[0]
                                address = ObjectMapper().treeToValue(addressNode, Address::class.java)
                                LocationUtils.address = address
                                // Speak the updated road address if not in mute state
                                if (address!!.roadWithHouseNumber() != road && !mute) {
                                    tts.speak(
                                        address!!.roadWithHouseNumber(),
                                        TextToSpeech.QUEUE_FLUSH,
                                        null,
                                        "")
                                }
                                // Update the road and other information
                                road = address!!.roadWithHouseNumber()
                                otherInformation = address!!.postCodeWithCity()
                            }
                        }
                        // Display the main content UI component
                        MainContent(road, otherInformation, tts) {
                            // Speak the full address when the "TOISTA OSOITE" button is clicked
                            if (address != null && !mute) {
                                tts.speak(address!!.toStringWithPostalCodesSeparated(), TextToSpeech.QUEUE_FLUSH, null, "")
                            }
                        }
                        // Display the GPS dialog if necessary
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


    /**
     * Called when the activity is resumed.
     * Calls a location function to start location updates
     */
    override fun onResume() {
        super.onResume()
        LocationUtils.startUpdating()
    }

    /**
     * Called when the activity is paused.
     * Calls a location function to stop location updates
     */
    override fun onPause() {
        super.onPause()
        LocationUtils.stopUpdating()
    }

    /**
     * Called when the activity is destroyed and shuts down Text to Speech
     */
    override fun onDestroy() {
        super.onDestroy()
        tts.stop()
        tts.shutdown()
    }

    /**
     * Checks the required permissions for accessing location information.
     * If the necessary permissions are not granted, a permission request is launched.
     * If the permissions are already granted, the location updating process is started.
     */
    private fun checkPermissions() {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // Permissions are not granted, request permission from the user
            val requestPermissionLauncher = registerForActivityResult(
                ActivityResultContracts.RequestPermission()
            ) { isGranted ->
                if (isGranted) {
                    // Location permission granted, start updating location
                    LocationUtils.startUpdating()
                } else {
                    // Location permission denied, display a toast message
                    Toast.makeText(
                        this,
                        "Anna sijainnin haulle lupa asetuksista",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
            requestPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        } else {
            // Permissions are already granted, start updating location
            LocationUtils.startUpdating()
        }
    }

    /**
     * Called to notify the completion of TextToSpeech engine initialization.
     *
     * @param status The initialization status. Either TextToSpeech.SUCCESS or TextToSpeech.ERROR.
     */
    override fun onInit(status: Int) {
        // Find the Finnish locale
        val finnish = Locale.getAvailableLocales().find {
            it.toString() == "fi_FI"
        }
        if (status == TextToSpeech.SUCCESS) {
            // Set the language of the TextToSpeech engine to Finnish if available
            val result = tts.setLanguage(finnish)
            // Check if the Finnish language is not supported or missing
            if (result == TextToSpeech.LANG_NOT_SUPPORTED || result == TextToSpeech.LANG_MISSING_DATA) {
                // Fallback to English language
                tts.language = Locale.ENGLISH
            }
        }
    }
}

/**
 * Composable function for the header section of the application.
 *
 * @param muteCallback A callback function to be invoked when the mute button is clicked.
 */
@Composable
fun Header(muteCallback: () -> Unit) {
    val context = LocalContext.current
    // Create a surface with secondary color
    Surface(
        color = MaterialTheme.colors.secondary,
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
    ) {
        Box {
            // Row for the icon on the top left
            Row(
                Modifier.align(Alignment.TopStart)
            ) {
                // Info icon
                Image(
                    painter = painterResource(R.drawable.info),
                    contentDescription = "Avaa sovelluksen nettisivu selaimessa",
                    modifier = Modifier
                        .padding(6.dp)
                        .size(50.dp)
                        .clickable {
                            // Open application website in browser
                            val intent = Intent(Intent.ACTION_VIEW)
                            intent.data = Uri.parse("https://homepages.tuni.fi/lotta.haverinen/aaniohjaus.html")
                            context.startActivity(intent)
                        }
                )
            }
            // Row for the icons on the top right
            Row(
                Modifier.align(Alignment.TopEnd)
            ) {
                // Settings icon
                Image(
                    painter = painterResource(R.drawable.settings_white),
                    contentDescription = "Avaa sovelluksen asetukset",
                    modifier = Modifier
                        .padding(6.dp)
                        .size(50.dp)
                        .clickable {
                            // Open application settings
                            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                            intent.data = Uri.fromParts("package", context.packageName, null)
                            context.startActivity(intent)
                        }
                )
                // Mute icon
                var mute by remember { mutableStateOf(R.drawable.speaker_white) }
                Image(
                    painter = painterResource(mute),
                    contentDescription = "Laita ääni päälle/pois",
                    modifier = Modifier
                        .padding(8.dp)
                        .size(50.dp)
                        .clickable {
                            // Toggle mute icon and invoke mute callback
                            mute = if (mute == R.drawable.speaker_white)
                                R.drawable.speaker_mute_white
                            else
                                R.drawable.speaker_white
                            muteCallback()
                        }
                )
            }
        }
    }
}

/**
 * Composable function for the main content section of the application.
 *
 * @param road The road information to be displayed.
 * @param otherInformation Additional information to be displayed.
 * @param tts The TextToSpeech instance used for speech synthesis.
 * @param buttonCallback A callback function to be invoked when the button is clicked.
 */
@Composable
fun MainContent(road: String, otherInformation: String, tts: TextToSpeech, buttonCallback: () -> Unit) {
    val isSpeakingState = remember { mutableStateOf(tts.isSpeaking) }
    // Set up the UtteranceProgressListener to track speech synthesis progress
    DisposableEffect(tts) {
        val callback = object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                isSpeakingState.value = true
            }

            override fun onDone(utteranceId: String?) {
                isSpeakingState.value = false
            }

            override fun onError(utteranceId: String?) {
                isSpeakingState.value = false
            }
        }
        tts.setOnUtteranceProgressListener(callback)

        // Clean up the listener when the effect is disposed
        onDispose {
            tts.setOnUtteranceProgressListener(null)
        }
    }

    // Create the main content layout
    Box {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.Center)
        ) {
            // AnimatedSoundImage to visualize speaking state
            AnimatedSoundImage(isSpeakingState.value)
            Spacer(Modifier.height(75.dp))
            // Display the road information
            Text(
                text = road,
                modifier = Modifier
                    .padding(20.dp, 0.dp),
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(10.dp))
            // Display additional information
            Text(
                text = otherInformation,
                modifier = Modifier
                ,fontSize = 28.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(75.dp))
            // Button to trigger address playback
            Button(
                onClick = buttonCallback,
                modifier = Modifier
                    .size(250.dp, 75.dp)
                ,shape = CircleShape,
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

/**
 * Composable function for an animated sound image that visualizes the speaking state.
 *
 * @param isSpeaking Indicates whether the speech synthesis is currently speaking.
 */
@Composable
fun AnimatedSoundImage(isSpeaking: Boolean) {
    // Define a list of image resources based on the theme color
    val images = if (MaterialTheme.colors.isLight) {
        listOf(R.drawable.sound1_black, R.drawable.sound2_black)
    } else {
        listOf(R.drawable.sound1_white, R.drawable.sound2_white)
    }
    // Keep track of the current image index using mutable state
    val currentIndex = remember { mutableStateOf(0) }

    // Launch an effect that animates the image based on the speaking state
    LaunchedEffect(isSpeaking) {
        while (isSpeaking) {
            // Rotate to the next image in the list
            currentIndex.value = (currentIndex.value + 1) % images.size
            // Delay between image changes for animation effect
            delay(kotlin.random.Random.nextLong(50, 150))
        }
    }

    // Display the current image
    Image(
        painter = painterResource(images[currentIndex.value]),
        contentDescription = null,
        modifier = Modifier
            .size(225.dp, 225.dp)
    )
}

/**
 * Composable function for displaying a custom alert dialog.
 *
 * @param callback Callback function to be invoked when the dialog is dismissed or buttons are clicked.
 */
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
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colors.secondaryVariant
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
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.body1
                )
            }
        }
    )
}

/**
 * Composable function for managing a local broadcast receiver.
 *
 * This composable function allows you to register a local broadcast receiver and handle received intents within a Composable function.
 * It automatically handles registering and unregistering the receiver based on the lifecycle of the Composable.
 *
 * @param intentFilter The IntentFilter specifying the types of intents to be received.
 * @param onReceive The callback function to be invoked when a matching intent is received.
 */
@Composable
fun MyLocalBroadcastManager(intentFilter: IntentFilter, onReceive: (Intent) -> Unit) {
    // Retrieve the current Context and LifecycleOwner
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(context) {
        // Create a BroadcastReceiver to handle received intents
         val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent) {
                // Invoke the onReceive callback with the received intent
                onReceive(intent)
            }
        }

        // Create a DefaultLifecycleObserver to handle lifecycle events
        val observer = object : DefaultLifecycleObserver {
            override fun onStop(owner: LifecycleOwner) {
                // Unregister the receiver when the lifecycle reaches the onStop state
                LocalBroadcastManager.getInstance(context).unregisterReceiver(receiver)
            }

            override fun onStart(owner: LifecycleOwner) {
                // Register the receiver when the lifecycle reaches the onStart state
                LocalBroadcastManager.getInstance(context).registerReceiver(receiver, intentFilter)
            }
        }
        // Add the observer to the lifecycle of the Composable
        lifecycleOwner.lifecycle.addObserver(observer)

        // Remove the observer when the Composable is disposed of
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}