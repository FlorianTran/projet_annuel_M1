import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '@/app/context/UserContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const { setUser } = useUser();
  const router = useRouter();

  const handleLoginOrSignup = async () => {
    try {
      const allUsers = await axios.get('http://localhost:3000/users');
      const existing = allUsers.data.find(
        (u: any) => u.email === email && u.motDePasse === motDePasse
      );

      if (existing) {
        setUser(existing);
        return router.replace('/(tabs)');
      }

      const newUser = {
        nom: 'NomTest',
        prenom: 'PrénomTest',
        email,
        motDePasse,
        dateNaissance: new Date().toISOString(),
        sexe: 'Non spécifié',
        poids: 70,
        taille: 170,
      };

      const created = await axios.post('http://localhost:3000/users', newUser);
      setUser(created.data);
      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', "Une erreur est survenue.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Connexion / Inscription</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Entrez votre email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        placeholder="Entrez votre mot de passe"
        style={styles.input}
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />

      <TouchableOpacity onPress={handleLoginOrSignup} style={styles.button}>
        <Text style={styles.buttonText}>Connexion / Création</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 32 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
