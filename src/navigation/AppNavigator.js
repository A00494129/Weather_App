import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import Screens (create placeholders next)
import CurrentWeatherScreen from '../screens/CurrentWeatherScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedLocationsScreen from '../screens/SavedLocationsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Current Weather') {
              iconName = focused ? 'cloud' : 'cloud-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Saved Locations') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Current Weather" component={CurrentWeatherScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Saved Locations" component={SavedLocationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
