import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather } from '../services/weather';
import WeatherDisplay from '../components/WeatherDisplay'; // Ensure this matches file structure

export default function CurrentWeatherScreen() {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    const getLocationAndWeather = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const weatherData = await fetchWeather(location.coords.latitude, location.coords.longitude);
            setWeather(weatherData);
        } catch (error) {
            console.error(error);
            setErrorMsg('Error fetching weather data');
            Alert.alert('Error', 'Could not fetch weather data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocationAndWeather();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="tomato" />
            ) : errorMsg ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                    <Button title="Retry" onPress={getLocationAndWeather} />
                </View>
            ) : weather ? (
                <>
                    <WeatherDisplay weather={weather} city="Current Location" />
                    <View style={styles.buttonContainer}>
                        <Button title="Refresh" onPress={getLocationAndWeather} />
                    </View>
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20
    }
});
