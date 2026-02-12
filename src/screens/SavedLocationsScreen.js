import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSavedLocations, removeLocation } from '../services/db';
import { fetchWeather } from '../services/weather';

export default function SavedLocationsScreen() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadLocations = async () => {
        setLoading(true);
        try {
            const saved = await getSavedLocations();
            // Fetch weather for each
            const locationsWithWeather = await Promise.all(
                saved.map(async (loc) => {
                    try {
                        const weather = await fetchWeather(loc.latitude, loc.longitude);
                        return { ...loc, weather };
                    } catch (e) {
                        console.error("Error fetching weather for saved location", loc.city, e);
                        return { ...loc, weather: null };
                    }
                })
            );
            setLocations(locationsWithWeather);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadLocations();
        }, [])
    );

    const handleDelete = async (id) => {
        Alert.alert(
            "Remove Location",
            "Are you sure you want to remove this location?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        try {
                            await removeLocation(id);
                            loadLocations(); // Refresh list
                        } catch (e) {
                            Alert.alert("Error", "Could not remove location");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const temp = item.weather?.current_weather?.temperature;

        return (
            <View style={styles.card}>
                <View style={styles.info}>
                    <Text style={styles.city}>{item.city}</Text>
                    <Text style={styles.coords}>{item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}</Text>
                </View>
                <View style={styles.right}>
                    {temp !== undefined ? (
                        <Text style={styles.temp}>{temp}°C</Text>
                    ) : (
                        <Text style={styles.temp}>--</Text>
                    )}
                    <View style={styles.deleteButton}>
                        <Button title="Remove" color="red" onPress={() => handleDelete(item.id)} />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="tomato" style={{ marginTop: 20 }} />
            ) : locations.length === 0 ? (
                <Text style={styles.empty}>No saved locations.</Text>
            ) : (
                <FlatList
                    data={locations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    info: {
        flex: 1,
    },
    city: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    coords: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    right: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    temp: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 15,
        color: '#333',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    deleteButton: {
        // Button wrapper if needed
    }
});
