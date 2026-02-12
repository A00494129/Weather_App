import axios from 'axios';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const fetchWeather = async (lat, lon) => {
    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                current_weather: true,
                // Adding hourly/daily if needed, but requirements say "weather information"
                // Let's get a bit more detail for display
                daily: 'temperature_2m_max,temperature_2m_min',
                timezone: 'auto',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
};

export const searchCity = async (city) => {
    try {
        const response = await axios.get(GEOCODING_API_URL, {
            params: {
                name: city,
                count: 10,
                language: 'en',
                format: 'json',
            },
        });
        return response.data.results || [];
    } catch (error) {
        console.error('Error searching city:', error);
        throw error;
    }
};
