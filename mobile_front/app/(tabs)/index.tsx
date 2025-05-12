import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3030'); // adapte selon ton IP réseau local

interface RoomManagerScreenProps {
  userId: string;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomManagerScreen({ userId, onJoinRoom }: RoomManagerScreenProps) {
  interface Room {
    id: string;
    nom: string;
  }

  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  const fetchRooms = async () => {
    try {
      const res = await axios.get<Room[]>(`http://localhost:3000/chat/rooms/${userId}`);
      setRooms(res.data);
    } catch (err) {
      console.error('Erreur de récupération des rooms :', err);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await axios.post('http://localhost:3000/chat/room/group', {
        nom: newRoomName,
        userIds: [userId],
      });
      setNewRoomName('');
      fetchRooms();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de créer la room');
    }
  };

  const handleJoin = (roomId) => {
    socket.emit('joinRoom', roomId);
    onJoinRoom(roomId);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes salons</Text>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomItem}>
            <Text style={styles.roomName}>{item.nom}</Text>
            <Button title="Rejoindre" onPress={() => handleJoin(item.id)} />
          </View>
        )}
      />

      <Text style={styles.subtitle}>Créer un salon</Text>
      <TextInput
        value={newRoomName}
        onChangeText={setNewRoomName}
        placeholder="Nom du salon"
        style={styles.input}
      />
      <Button title="Créer" onPress={createRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  roomName: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
