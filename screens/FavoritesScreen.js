import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [newFavorite, setNewFavorite] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('@favorites');
        if (saved !== null) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Error loading favorites', error);
        Alert.alert('Error', 'Could not load favorites.');
      }
    };

    loadFavorites();
  }, []);

  const saveFavorites = async (favArray) => {
    try {
      await AsyncStorage.setItem('@favorites', JSON.stringify(favArray));
    } catch (error) {
      console.log('Error saving favorites', error);
      Alert.alert('Error', 'Could not save favorites.');
    }
  };

  const handleAddFavorite = () => {
    if (!newFavorite.trim()) {
      Alert.alert('Validation', 'Favorite name cannot be empty.');
      return;
    }

    const item = {
      id: Date.now().toString(),
      name: newFavorite.trim(),
    };

    const updated = [...favorites, item];
    setFavorites(updated);
    saveFavorites(updated);
    setNewFavorite('');
  };

  const handleRemoveFavorite = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    saveFavorites(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>

      <TextInput
        style={styles.input}
        placeholder="Add a new favorite"
        value={newFavorite}
        onChangeText={setNewFavorite}
      />
      <Button title="Add Favorite" onPress={handleAddFavorite} />

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet. Add one above!</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteText}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  emptyText: {
    marginTop: 16,
    fontStyle: 'italic',
  },
  list: {
    marginTop: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  favoriteText: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
