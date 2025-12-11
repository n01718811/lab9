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

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Load notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const saved = await AsyncStorage.getItem('@notes');
        if (saved !== null) {
          setNotes(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Error loading notes', error);
        Alert.alert('Error', 'Could not load notes.');
      }
    };

    loadNotes();
  }, []);

  const saveNotes = async (notesArray) => {
    try {
      await AsyncStorage.setItem('@notes', JSON.stringify(notesArray));
    } catch (error) {
      console.log('Error saving notes', error);
      Alert.alert('Error', 'Could not save notes.');
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      Alert.alert('Validation', 'Note cannot be empty.');
      return;
    }

    const note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      date: new Date().toLocaleDateString(),
    };

    const updated = [note, ...notes]; // newest first
    setNotes(updated);
    saveNotes(updated);
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = notes.filter((n) => n.id !== id);
          setNotes(updated);
          saveNotes(updated);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Type a new note"
        value={newNote}
        onChangeText={setNewNote}
      />
      <Button title="Add Note" onPress={handleAddNote} />

      {notes.length === 0 ? (
        <Text style={styles.emptyText}>No notes yet. Add one above!</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.noteText}>{item.text}</Text>
                <Text style={styles.noteDate}>{item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
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
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteText: {
    color: 'red',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
