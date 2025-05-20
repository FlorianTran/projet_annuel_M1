import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useUser } from '../app/context/UserContext';
import { User } from '@/lib/models/user';
import { Chatroom } from '@/lib/models/chatroom';


export default function RoomManagerScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [rooms, setRooms] = useState<Chatroom[]>([]);

  const fetchRooms = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:3000/Chatroom`);
      setRooms(res.data as Chatroom[]);
    } catch (err) {
      console.error('Erreur récupération rooms:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  const renderRoom = ({ item }: { item: Chatroom }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleJoinRoom(item.id)}>
      <Text style={styles.roomTitle}>{item.nom}</Text>
      <Text style={styles.participantCount}>
        {item.utilisateurs.length} participant{item.utilisateurs.length > 1 ? 's' : ''}
      </Text>
      <Text style={styles.joinText}>→ Appuyez pour entrer</Text>
    </TouchableOpacity>
  );

  const handleJoinRoom = (roomId: string) => {
    console.log('Rejoindre le salon:', roomId);
    router.push(`/chat/${roomId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salons disponibles</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoom}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 26, fontWeight: '600', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomTitle: { fontSize: 20, fontWeight: '500', color: '#333' },
  participantCount: { fontSize: 14, color: '#444', marginTop: 4 },
  joinText: { fontSize: 14, color: '#888', marginTop: 4 },
});
