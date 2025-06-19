import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '../app/context/UserContext';
import { User } from '@/lib/models/user';

export default function SelectUserScreen() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUser(); // ajout clearUser
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectUser = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = res.data as User;
      setUser(user);
      setSelectedUserId(userId);
      Alert.alert('Succès', `Utilisateur ${user.prenom} sélectionné`);
    } catch (err) {
      console.error('Erreur récupération utilisateur :', err);
      Alert.alert('Erreur', "Impossible de récupérer l'utilisateur");
    }
  };

  const createFictitiousEntrainements = async () => {
    if (!user) return Alert.alert('Erreur', 'Aucun utilisateur sélectionné');

    try {
      const entrainements = [
        {
          titre: 'Full Body Débutant',
          description: '3x10 pour tout le corps',
          niveau: 'débutant',           
          methodologie: 'hypertrophie', 
          userId: user.id,
        },
        {
          titre: 'Split Haut du Corps',
          description: 'Push/Pull lundi & jeudi',
          niveau: 'intermédiaire',      
          methodologie: 'force',        
          userId: user.id,
        },
      ];


      await Promise.all(
        entrainements.map((e) =>
          axios.post('http://localhost:3000/entrainements', e)
        )
      );

      Alert.alert('Succès', 'Entrainements créés');
    } catch (err) {
      console.error('Erreur création entrainements :', err);
      Alert.alert('Erreur', 'Impossible de créer les entrainements');
    }
  };

  const createFictitiousSeances = async () => {
    if (!user) return Alert.alert('Erreur', 'Aucun utilisateur sélectionné');

    try {
      const entrainements = await axios.get('http://localhost:3000/entrainements');
      const entrainementId = entrainements.data?.[0]?.id;

      if (!entrainementId) return Alert.alert('Erreur', 'Aucun entrainement trouvé');

      const seances = [
        {
          date: new Date().toISOString(),
          duree: 45,
          poidsSouleve: 2500,
          repetitions: 60,
          entrainementId: entrainementId,
          utilisateurId: user.id,
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          duree: 30,
          poidsSouleve: 1800,
          repetitions: 40,
          entrainementId: entrainementId,
          utilisateurId: user.id,
        },
      ];

      await Promise.all(seances.map((s) => axios.post('http://localhost:3000/seances', s)));

      Alert.alert('Succès', 'Séances créées');
    } catch (err) {
      console.error('Erreur création séances :', err);
      Alert.alert('Erreur', 'Impossible de créer les séances');
    }
  };

  const handleLogout = () => {
    clearUser();
    Alert.alert('Déconnexion', 'Utilisateur déconnecté');
  };

  const toLoginPage = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text>Current User:</Text>
      <Text>{user ? `${user.prenom} ${user.nom}` : 'Aucun utilisateur sélectionné'}</Text>

      <Text style={styles.title}>Choisissez un utilisateur</Text>

      <Button
        title="Utilisateur 1"
        onPress={() => selectUser('f504f89d-844e-47e9-98e8-a42b2096f66f')}
      />
      <Button
        title="Utilisateur 2"
        onPress={() => selectUser('ac07cf27-a6b3-41a9-b781-b775c2b4aa56')}
      />
      <Button title="Connexion" onPress={toLoginPage} />
      <Button title="Déconnexion" onPress={handleLogout} color="#d9534f" />

      <View style={styles.separator} />

      <Button title="Créer des entrainements fictifs" onPress={createFictitiousEntrainements} />
      <Button title="Créer des séances fictives" onPress={createFictitiousSeances} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  title: { fontSize: 24, marginBottom: 20 },
  separator: { height: 20 },
});
