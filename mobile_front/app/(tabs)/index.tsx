import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
  const { user } = useUser();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenue, {user.prenom ?? 'utilisateur'}
      </Text>
      <Text>Voici votre tableau de bord.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
