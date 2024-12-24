import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user location
  const fetchLocation = async () => {
    try {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Get location
      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('userLocation', JSON.stringify(coords));

      // Update state
      setLocation(coords);
    } catch (error) {
      setErrorMsg('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Display saved location on component mount
  useEffect(() => {
    const loadLocation = async () => {
      const storedLocation = await AsyncStorage.getItem('userLocation');
      if (storedLocation) {
        setLocation(JSON.parse(storedLocation));
      }
    };
    loadLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Location</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1ecfd8" />
      ) : errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        location && (
          <View style={styles.locationContainer}>
            <Text style={styles.text}>Latitude: {location.latitude}</Text>
            <Text style={styles.text}>Longitude: {location.longitude}</Text>
          </View>
        )
      )}
      <Button title="Refresh Location" onPress={fetchLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  locationContainer: {
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
  },
});

export default App;
