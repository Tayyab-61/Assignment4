// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const location = await AsyncStorage.getItem('userLocation');
      const email = await AsyncStorage.getItem('userEmail');
      if (location && email) {
        setUserLocation(JSON.parse(location));
        setUserEmail(email);
      }
    };

    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      {userLocation && userEmail ? (
        <>
          <Text style={styles.text}>Email: {userEmail}</Text>
          <Text style={styles.text}>Latitude: {userLocation.latitude}</Text>
          <Text style={styles.text}>Longitude: {userLocation.longitude}</Text>
        </>
      ) : (
        <Text style={styles.text}>No user data found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
});

export default ProfileScreen;
