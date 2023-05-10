# Ääniohjaus - Android Native

This is an Android version of the Ääniohjaus application developed in Kotlin using Android Studio.

## Getting started

To run this application on your own Android phone, please follow these steps:

1. Clone this repository to your local machine.
2. Open the project in Android Studio.
3. Connect your Android phone to your computer using a USB cable.
4. Make sure USB debugging is enabled on your phone. You can enable this in the developer options on your phone. If you don't see the developer options, go to "About phone" and tap "Build number" seven times.
5. In Android Studio, select click the "Run" button or press the "Shift" and "F10" keys together to build and run the app.
6. Select your Android phone from the list of available devices.
7. Click "OK" to install the app on your phone.
8. The app should now be installed on your phone and you can open it from your app drawer.

## Features

This app includes the following features:

    - Getting user's location and using it to show user's location as a text of street name, street number, postal code and city
    - Speaking of the user's street name and number when address changes using Text to Speech
    - Speaking the user's whole address when pressing a button using Text to Speech
    - Buttons for muting the Text to Speech, opening the application settings and visiting the application's website
    - Image on the front page animates when Text to Speech is speaking

## How to use the application

When application opens, if opening the first time or permissions have not been granted, the application will prompt with a permission to enable usage of phone's location. If GPS is not enabled when opening the app, the app will give a prompt to open settings and turn on the GPS.
When application opens, it will fetch the user's location and speak it using TTS (Text to Speech). After that, TTS will only speak the location when street name or number changes or when pressing the "Toista osoite" button.</br></br>
The application will update the user's location every 5 seconds or so, but will fetch new address data only when the user is moving. This is done to limit the load the backend receives and to make sure that location does not rapidly change when standing still.
Pressing the "i" icon in the topleft corner opens the application's website. Pressing the cog symbol in the topright corner will opwn the application's settings so that the user can easily manage the application's permissions and pressing the speaker icon in the topright corner
will mute or unmute TTS.

## Dependencies

This app uses the following dependencies:

- **Google Play Services**: App uses Google Play Service's low power location client to get phone's location
- **Jackson**: Primary Json parser to parse incoming address data
- **Jetpack Compose**: Used to build modern looking native UI

## License

This project is licensed under the MIT License - see the LICENSE file for details.
