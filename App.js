import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fungsi untuk meminta izin dan mendapatkan lokasi
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLocation(location.coords);
  };

  // Fungsi untuk menyimpan lokasi ke AsyncStorage
  const saveLocationToStorage = async () => {
    if (latitude && longitude) {
      try {
        const locationData = JSON.stringify({ latitude, longitude });
        await AsyncStorage.setItem('location', locationData);
        console.log("Location saved to AsyncStorage:", { latitude, longitude });
      } catch (error) {
        console.log("Error saving location to AsyncStorage:", error);
      }
    } else {
      setErrorMsg("No location data to save");
    }
  };

  // Fungsi untuk mengambil lokasi dari AsyncStorage
  const getLocationFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('location');
      if (value !== null) {
        const storedLocation = JSON.parse(value);
        setLatitude(storedLocation.latitude);
        setLongitude(storedLocation.longitude);
        console.log("Location retrieved from AsyncStorage:", storedLocation);
      } else {
        setErrorMsg('No location data found');
      }
    } catch (error) {
      console.log("Error retrieving location from AsyncStorage:", error);
      setErrorMsg('Error retrieving location');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Saint Christopher Shyandon - 00000075026</Text>
      <Button title="Get Geo Location" onPress={getLocation} />
      <Button title="Save Location" onPress={saveLocationToStorage} />
      <Button title="Get Saved Location" onPress={getLocationFromStorage} />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {latitude && longitude ? (
        <View style={styles.coordinates}>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </View>
      ) : (
        <Text>No coordinates available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 18,
    marginBottom: 20,
  },
  coordinates: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});