# Ohjelmistotuotannon projekti

This is a project repository for the course "Ohjelmistotuotannon projekti" at Tampere University of Applied Sciences.

## Description

The goal of this project is to develop an Android and iOS application for helping navigation in unfamiliar environments without the need for the ability to read a map.
This application is developed mainly with vision impaired and tourists in mind, but anyone who has difficulties in navigating or reading a map can use the application to help their lives.

## Features

This app includes the following features:

    - Getting user's location and using it to show user's location as a text of street name, street number, postal code and city
    - Speaking of the user's street name and number when address changes using Text to Speech
    - Speaking the user's whole address when pressing a button using Text to Speech
    - Buttons for muting the Text to Speech, opening the application's settings and visiting the application's website
    - Image on the front page animates when Text to Speech is speaking
    
## How to use the application

When application opens, if opening the first time or permissions have not been granted, the application will prompt with a permission to enable usage of phone's location. If GPS is not enabled when opening the app, the app will give a prompt to open settings and turn on the GPS.
When application opens, it will fetch the user's location and speak it using TTS (Text to Speech). After that, TTS will only speak the location when street name or number changes or when pressing the "Toista osoite" button.</br></br>
The application will update the user's location at certain intervals, but will fetch new address data only when the user is moving. This is done to limit the load the backend receives and to make sure that location does not rapidly change when standing still.
Pressing the "i" icon in the topleft corner opens the application's website. Pressing the cog symbol in the topright corner will open the application's settings so that the user can easily manage the application's permissions and pressing the speaker icon in the topright corner
will mute or unmute TTS.

## Technologies used

> More information about dependencies can be found in their respective README-files.

- Frontend: Android (Kotlin), iOS (React Native)
  - Android: [README.md](aaniohjaus-android-native/README.md)
  - iOS: [README.md](aaniohjaus/README.md)
- Backend: MySQL, JavaScript, node.js
  - [README.md](aaniohjaus-backend/README.md)

## Installation

1. Clone the repository: `git clone https://github.com/Depajo/ohjelmistotuotannon-projekti`
2. Follow installation guides for Android, iOS (React Native) and Backend in their respective README-files

## Developers

**Lotta Haverinen** (Scrummaster, Backend, Design)</br>
**Ella Mattila** (Backend, Testing)</br>
**Joonatan De Pascale** (React Native, iOS)</br>
**Otto Kyösti** (Android)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
