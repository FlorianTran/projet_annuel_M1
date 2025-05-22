import React from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '../app/context/UserContext';
import { User } from '@/lib/models/user';

export default function SelectUserScreen() {
  const router = useRouter();
  const { setUser } = useUser();

  const selectUser = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = res.data as User;
      setUser(user);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Erreur récupération utilisateur :', err);
      Alert.alert('Erreur', "Impossible de récupérer l'utilisateur");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez un utilisateur</Text>
      <Button
        title="Utilisateur 1"
        onPress={() => selectUser('1b9ef6a4-cedd-4c35-b784-85389beddcec')}
      />
      <Button
        title="Utilisateur 2"
        onPress={() => selectUser('f2b78fc1-30a6-4c55-8f15-d40323ebdadd')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
