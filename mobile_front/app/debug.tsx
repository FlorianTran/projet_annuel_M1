import { User } from '@/lib/models/user';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../app/context/UserContext';

export default function DebugScreen() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectUser = async (userId: string) => {
    try {
      console.log('Selecting user with ID:', userId);
      const res = await axios.get(`http://localhost:3000/users/${userId}`);
      const userData = res.data as User;
      console.log('User data received:', userData);
      await setUser(userData);
      setSelectedUserId(userId);
      Alert.alert('Succès', `Utilisateur ${userData.prenom} sélectionné`);
    } catch (err) {
      console.error('Erreur récupération utilisateur :', err);
      Alert.alert('Erreur', "Impossible de récupérer l'utilisateur");
    }
  };

  const createTestUser = async () => {
    try {
      const testUser = {
        nom: 'Test',
        prenom: 'User',
        email: `test${Date.now()}@test.com`,
        motDePasse: '123',
        dateNaissance: '1990-01-01',
        sexe: 'Homme',
        poids: 70,
        taille: 175,
      };
      
      const res = await axios.post('http://localhost:3000/users', testUser);
      const userData = res.data as User;
      console.log('Test user created:', userData);
      await setUser(userData);
      setSelectedUserId(userData.id);
      Alert.alert('Succès', `Utilisateur test créé et sélectionné: ${userData.prenom}`);
    } catch (err) {
      console.error('Error creating test user:', err);
      Alert.alert('Erreur', 'Impossible de créer un utilisateur test');
    }
  };

  // Test network connectivity
  const testNetworkConnectivity = async () => {
    try {
      console.log('Testing network connectivity...');
      const res = await axios.get('http://localhost:3000/users');
      const users = res.data as any[];
      console.log('Network test successful, found', users.length, 'users');
      Alert.alert('Connectivité', `Connexion réussie! ${users.length} utilisateur(s) trouvé(s)`);
    } catch (err) {
      console.error('Network test failed:', err);
      Alert.alert('Erreur réseau', 'Impossible de se connecter au backend');
    }
  };

  // Test workout creation with detailed logging
  const testWorkoutCreation = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Aucun utilisateur connecté');
      return;
    }
    
    console.log('=== TESTING WORKOUT CREATION ===');
    console.log('Current user:', user);
    console.log('User ID:', user.id);
    
    try {
      // First, test if we can reach the backend
      console.log('1. Testing backend connectivity...');
      const connectivityTest = await axios.get('http://localhost:3000/users');
      const usersTest = connectivityTest.data as any[];
      console.log('✓ Backend is reachable, found', usersTest.length, 'users');
      
      // Test creating a simple workout
      console.log('2. Creating test workout...');
      const workoutData = {
        title: 'Test Workout Debug',
        description: 'Workout créé via debug',
        level: 'débutant',
        exercises: [],
        createdById: user.id,
        assignedToIds: [user.id],
      };
      
      console.log('Workout data to send:', workoutData);
      
      const workoutRes = await axios.post('http://localhost:3000/workouts', workoutData);
      console.log('✓ Workout created successfully:', workoutRes.data);
      
      Alert.alert('Succès', 'Workout de test créé avec succès!');
    } catch (err: any) {
      console.error('❌ Workout creation failed:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      Alert.alert('Erreur', `Échec création workout: ${err.response?.data?.message || err.message}`);
    }
  };

  // Shared debug function
  const createDebugData = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Aucun utilisateur connecté');
      return;
    }
    
    console.log('Creating debug data for user:', user.id);
    
    try {
      // 1. Create example exercises (diverse set)
      const exercises = [
        {
          name: 'Développé couché',
          muscleGroups: ['Pectoraux', 'Épaules'],
          description: 'Exercice de base pour les pectoraux',
          icon: '💪',
          createdById: user.id,
        },
        {
          name: 'Squats',
          muscleGroups: ['Jambes', 'Fessiers'],
          description: 'Exercice de base pour les jambes',
          icon: '🏋️',
          createdById: user.id,
        },
        {
          name: 'Tractions',
          muscleGroups: ['Dos', 'Biceps'],
          description: 'Exercice pour le dos et les bras',
          icon: '🧗',
          createdById: user.id,
        },
        {
          name: 'Pompes',
          muscleGroups: ['Pectoraux', 'Triceps'],
          description: 'Exercice de musculation au poids du corps',
          icon: '🤸',
          createdById: user.id,
        },
        {
          name: 'Planche',
          muscleGroups: ['Abdominaux', 'Épaules'],
          description: 'Exercice de gainage',
          icon: '🧘',
          createdById: user.id,
        },
        {
          name: 'Burpees',
          muscleGroups: ['Cardio', 'Jambes', 'Pectoraux'],
          description: 'Exercice cardio complet',
          icon: '⚡',
          createdById: user.id,
        },
        {
          name: 'Curl biceps',
          muscleGroups: ['Biceps'],
          description: 'Exercice d’isolation pour les biceps',
          icon: '💪',
          createdById: user.id,
        },
        {
          name: 'Dips',
          muscleGroups: ['Triceps', 'Épaules'],
          description: 'Exercice pour les triceps et épaules',
          icon: '🏋️‍♂️',
          createdById: user.id,
        },
        {
          name: 'Soulevé de terre',
          muscleGroups: ['Dos', 'Jambes', 'Fessiers'],
          description: 'Exercice polyarticulaire pour le dos et les jambes',
          icon: '🏋️‍♂️',
          createdById: user.id,
        },
        {
          name: 'Développé militaire',
          muscleGroups: ['Épaules', 'Triceps'],
          description: 'Exercice pour les épaules et triceps',
          icon: '🏋️',
          createdById: user.id,
        },
        {
          name: 'Crunchs',
          muscleGroups: ['Abdominaux'],
          description: 'Exercice pour les abdominaux',
          icon: '🦾',
          createdById: user.id,
        },
        {
          name: 'Fentes',
          muscleGroups: ['Jambes', 'Fessiers'],
          description: 'Exercice pour les jambes et fessiers',
          icon: '🚶',
          createdById: user.id,
        },
      ];

      const createdExercises: { id: string }[] = [];
      for (const ex of exercises) {
        const created = await axios.post('http://localhost:3000/exercises', ex);
        createdExercises.push(created.data as { id: string });
      }
      
      // 2. Create a workout template and assign to user
      const workoutData = {
        title: 'Full Body Débutant',
        description: 'Programme complet pour débutant',
        level: 'débutant',
        exercises: [
          { exerciseId: createdExercises[0].id, targetSets: 3, targetReps: 10 },
          { exerciseId: createdExercises[1].id, targetSets: 4, targetReps: 8 },
          { exerciseId: createdExercises[2].id, targetSets: 3, targetReps: 8 },
        ],
        createdById: user.id,
        assignedToIds: [user.id],
      };
      
      console.log('Creating workout with data:', workoutData);
      
      const workout = await axios.post('http://localhost:3000/workouts', workoutData);
      console.log('Workout created:', workout.data);
      
      Alert.alert('Succès', 'Exercices et workout créés !');
    } catch (err) {
      console.error('Error creating debug data:', err);
      Alert.alert('Erreur', 'Impossible de créer les exemples');
    }
  };

  // Debug: Reset DB
  const handleResetDb = async () => {
    try {
      await axios.post('http://localhost:3000/debug/reset-db');
      Alert.alert('Succès', 'La base de données a été réinitialisée.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible de réinitialiser la base de données.');
    }
  };

  const handleLogout = () => {
    clearUser();
    Alert.alert('Déconnexion', 'Utilisateur déconnecté');
  };

  const checkUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users');
      const users = res.data as any[];
      console.log('Users in database:', users);
      Alert.alert('Utilisateurs', `Il y a ${(users as any[]).length} utilisateur(s) dans la base de données`);
    } catch (err) {
      console.error('Error checking users:', err);
      Alert.alert('Erreur', 'Impossible de vérifier les utilisateurs');
    }
  };

  const toLoginPage = () => {
    router.push('/login');
  };

  const quickLogin = async () => {
    try {
      console.log('Quick login: fetching users...');
      const res = await axios.get('http://localhost:3000/users');
      const quickUsers = res.data as any[];
      if (quickUsers.length > 0) {
        const firstUser = quickUsers[0];
        console.log('Quick login: using first user:', firstUser.id);
        await setUser(firstUser);
        Alert.alert('Connexion rapide', `Connecté avec ${firstUser.prenom} ${firstUser.nom}`);
      } else {
        Alert.alert('Erreur', 'Aucun utilisateur trouvé dans la base de données');
      }
    } catch (err) {
      console.error('Quick login failed:', err);
      Alert.alert('Erreur', 'Impossible de se connecter rapidement');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Current User:</Text>
      <Text>{user ? `${user.prenom} ${user.nom} (${user.id})` : 'Aucun utilisateur sélectionné'}</Text>

      <Text style={styles.title}>Debug</Text>

      <Button
        title="Créer un utilisateur test"
        onPress={createTestUser}
        color="#28a745"
      />
      
      <Button
        title="Connexion rapide (premier utilisateur)"
        onPress={quickLogin}
        color="#17a2b8"
      />
      
      <Button
        title="Utilisateur existant 1"
        onPress={() => selectUser('8a579124-fad1-4a96-a2f6-93dc1f6c3709')}
      />
      <Button
        title="Utilisateur existant 2"
        onPress={() => selectUser('73fe1ac8-4726-48af-8bd3-255088066fdf')}
      />
      <Button title="Connexion" onPress={toLoginPage} />
      <Button title="Déconnexion" onPress={handleLogout} color="#d9534f" />
      <Button title="Effacer le contexte utilisateur" onPress={clearUser} color="#ffc107" />
      <Button title="Vérifier les utilisateurs" onPress={checkUsers} />

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Tests de connectivité</Text>
      <Button title="Tester la connectivité réseau" onPress={testNetworkConnectivity} color="#17a2b8" />
      <Button title="Tester création workout" onPress={testWorkoutCreation} color="#6f42c1" />

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Actions de Debug</Text>
      <Button title="Créer des entrainements fictifs" onPress={createDebugData} />
      <Button title="Réinitialiser la base de données" onPress={handleResetDb} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  title: { fontSize: 28, marginBottom: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 20, marginBottom: 10, marginTop: 20, fontWeight: '600' },
  separator: { height: 20 },
}); 