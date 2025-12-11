import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserSettings() {
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Load saved settings when screen mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('@username');
        const savedDarkMode = await AsyncStorage.getItem('@darkMode');
        const savedNotifications = await AsyncStorage.getItem('@notifications');

        if (savedUsername !== null) setUsername(savedUsername);
        if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
        if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
      } catch (error) {
        console.log('Error loading settings', error);
        Alert.alert('Error', 'Could not load settings.');
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('@username', username);
      await AsyncStorage.setItem('@darkMode', darkMode.toString());
      await AsyncStorage.setItem('@notifications', notifications.toString());

      Alert.alert('Success', 'Settings saved!');
    } catch (error) {
      console.log('Error saving settings', error);
      Alert.alert('Error', 'Could not save settings.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Settings</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />

      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
