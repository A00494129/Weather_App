# React Native Weather App

A mobile weather application built with React Native (Expo), Open-Meteo API, and SQLite for local storage.

## Features
- **Current Location Weather**: Automatically fetches and displays weather for your current location.
- **Search**: Search for cities worldwide and view their weather.
- **Saved Locations**: Save up to 5 favorite cities for quick access. Persists data locally.
- **Offline Storage**: Uses SQLite to store your saved locations.

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    npx expo install
    ```

3.  **Run the app**:
    ```bash
    npx expo start
    ```
    - Scan the QR code with Expo Go on your Android/iOS device.
    - Press `a` to run on Android Emulator.
    - Press `i` to run on iOS Simulator.

## Architecture
- **Navigation**: Uses `@react-navigation/bottom-tabs` for main screens.
- **State Management**: Local React state + SQLite for persistent data.
- **API**: [Open-Meteo](https://open-meteo.com/) (Free, no API key required).

## Assumptions & Decisions
- Used **Open-Meteo** as it requires no API key, making the app easier to test.
- The app checks for location permissions on the "Current Weather" screen.
- Saved locations limit is strictly enforced at 5.
- Weather data for saved locations is fetched fresh every time the screen is focused to ensure accuracy.

## Testing
Tested on:
- Android Emulator
- Expo Go

## Tech Stack
- React Native (Expo SDK 54)
- Expo Location
- Expo SQLite
- React Navigation
- Axios
