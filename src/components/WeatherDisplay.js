import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherDisplay({ weather, city }) {
    if (!weather || !weather.current_weather) return null;

    const { temperature, weathercode, windspeed } = weather.current_weather;
    const { daily } = weather;
    const maxTemp = daily?.temperature_2m_max?.[0];
    const minTemp = daily?.temperature_2m_min?.[0];

    // Simple weather code mapping for icons
    const getWeatherIcon = (code) => {
        // https://open-meteo.com/en/docs
        if (code === 0) return 'sunny';
        if (code >= 1 && code <= 3) return 'partly-sunny';
        if (code >= 45 && code <= 48) return 'cloud';
        if (code >= 51 && code <= 67) return 'rainy';
        if (code >= 71 && code <= 77) return 'snow'; // snow
        if (code >= 80 && code <= 82) return 'rainy'; // rain showers
        if (code >= 95) return 'thunderstorm';
        return 'cloud-outline';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.city}>{city || "Current Location"}</Text>
            <Ionicons name={getWeatherIcon(weathercode)} size={80} color="orange" />
            <Text style={styles.temp}>{temperature}°C</Text>
            <Text style={styles.desc}>Wind: {windspeed} km/h</Text>
            {maxTemp !== undefined && minTemp !== undefined && (
                <Text style={styles.hl}>H: {maxTemp}° L: {minTemp}°</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        marginTop: 20,
        width: '90%',
    },
    city: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    temp: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#333',
    },
    desc: {
        fontSize: 18,
        color: '#666',
        marginTop: 5,
    },
    hl: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    }
});
