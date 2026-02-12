import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { searchCity, fetchWeather } from '../services/weather';
import { saveLocation } from '../services/db';
import WeatherDisplay from '../components/WeatherDisplay';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResults([]);
        setSelectedLocation(null);
        setWeather(null);
        Keyboard.dismiss();
        try {
            const cities = await searchCity(query);
            if (cities.length === 0) {
                Alert.alert('Info', 'No cities found.');
            }
            setResults(cities);
        } catch (error) {
            Alert.alert('Error', 'Failed to search city');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCity = async (cityData) => {
        setSelectedLocation(cityData);
        setResults([]); // Clear results to show weather
        setLoading(true);
        try {
            const weatherData = await fetchWeather(cityData.latitude, cityData.longitude);
            setWeather(weatherData);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch weather');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedLocation) return;
        try {
            await saveLocation(selectedLocation.name, selectedLocation.latitude, selectedLocation.longitude);
            Alert.alert('Success', 'Location saved!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter city name"
                    value={query}
                    onChangeText={setQuery}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>

            {loading && <ActivityIndicator size="small" color="#0000ff" />}

            {results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => handleSelectCity(item)}>
                            <Text style={styles.itemText}>{item.name}, {item.country} {item.admin1 ? `(${item.admin1})` : ''}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.list}
                />
            )}

            {selectedLocation && weather && (
                <View style={styles.weatherContainer}>
                    <WeatherDisplay weather={weather} city={selectedLocation.name} />
                    <View style={styles.saveButton}>
                        <Button title="Save Location" onPress={handleSave} color="green" />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    list: {
        maxHeight: 200,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fafafa',
    },
    itemText: {
        fontSize: 16,
    },
    weatherContainer: {
        alignItems: 'center',
        marginTop: 20,
        flex: 1,
    },
    saveButton: {
        marginTop: 20,
        width: '100%',
    }
});
