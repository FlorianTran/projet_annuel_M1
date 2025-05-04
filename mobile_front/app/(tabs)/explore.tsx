import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { User } from '../models/user';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Liste des utilisateurs</Text>
      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <Text>{user.nom} {user.prenom}</Text>
          <Text>{user.email}</Text>
          <Text>Poids: {user.poids} kg | Taille: {user.taille} cm</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    width: '100%',
  },
});
