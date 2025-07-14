import { getAllExercises } from '@/lib/api/exercise';
import { getAllWorkouts } from '@/lib/api/workout';
import { Exercise } from '@/lib/models/exercise';
import { Workout } from '@/lib/models/workout';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';
import ExerciseLibrary from './ExerciseLibrary';
import WorkoutCreation from './WorkoutCreation';
import WorkoutLogging from './WorkoutLogging';

export default function TrackingScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [seances, setSeances] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeTab, setActiveTab] = useState<'workouts' | 'library' | 'historic'>('workouts');
  const [preselectedExercises, setPreselectedExercises] = useState<Exercise[] | null>(null);

  const fetchWorkouts = async () => {
    try {
      const data = await getAllWorkouts();
      console.log('=== WORKOUTS FETCHED ===');
      console.log('Raw workout data:', JSON.stringify(data, null, 2));
      data.forEach((workout, index) => {
        console.log(`Workout ${index + 1}:`, {
          id: workout.id,
          title: workout.title,
          entrainementId: workout.entrainementId,
          hasEntrainementId: !!workout.entrainementId
        });
      });
      setWorkouts(data);
    } catch (err) {
      console.error('Erreur lors du chargement des workouts:', err);
    }
  };

  const fetchExercises = async () => {
    try {
      const data = await getAllExercises();
      console.log('Exercises fetched:', data);
      setExercises(data);
    } catch (err) {
      console.error('Erreur lors du chargement des exercices:', err);
    }
  };

  const fetchSeances = async () => {
    if (!user) return;
    try {
      console.log('Fetching seances for user:', user.id);
      const res = await axios.get('http://localhost:3000/seances');
      console.log('All seances from backend:', res.data);
      // Defensive: filter only seances with valid utilisateur and id match
      const filtered = (res.data as any[]).filter((s: any) => s.utilisateur && s.utilisateur.id === user.id);
      console.log('Filtered seances for user:', filtered);
      setSeances(filtered);
    } catch (err) {
      console.error('Erreur lors du chargement des séances', err);
      setSeances([]); // Defensive: clear on error
    }
  };

  // Use focus effect to reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Tracking screen focused, reloading data...');
      fetchWorkouts();
      fetchExercises();
      fetchSeances();
    }, [user])
  );

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
    fetchSeances();
  }, [user]);

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleWorkoutSaved = () => {
    setSelectedWorkout(null);
    setPreselectedExercises(null);
    fetchWorkouts(); // Reload workouts after creation
  };

  const handleSeanceSaved = () => {
    fetchSeances(); // Reload seances after creation
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workouts' && styles.activeTab]}
          onPress={() => setActiveTab('workouts')}
        >
          <Text style={[styles.tabText, activeTab === 'workouts' && styles.activeTabText]}>
            Mes Workouts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'library' && styles.activeTab]}
          onPress={() => setActiveTab('library')}
        >
          <Text style={[styles.tabText, activeTab === 'library' && styles.activeTabText]}>
            Bibliothèque
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'historic' && styles.activeTab]}
          onPress={() => setActiveTab('historic')}
        >
          <Text style={[styles.tabText, activeTab === 'historic' && styles.activeTabText]}>
            Historique
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'workouts' && (
        <View style={styles.content}>
          {selectedWorkout ? (
            <WorkoutLogging workout={selectedWorkout} onSaved={handleSeanceSaved} />
          ) : (
            <WorkoutCreation exercises={preselectedExercises ?? exercises} onSaved={handleWorkoutSaved} />
          )}
          
          <View style={styles.workoutList}>
            <Text style={styles.sectionTitle}>Mes Workouts</Text>
            <ScrollView style={{ maxHeight: 250 }}>
              {workouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={styles.workoutCard}
                  onPress={() => handleWorkoutSelect(workout)}
                >
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutDescription}>{workout.description}</Text>
                  <Text style={styles.workoutLevel}>Niveau: {workout.level}</Text>
                  <Text style={styles.workoutExercises}>
                    {workout.exercises.length} exercices
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {activeTab === 'library' && (
        <View style={styles.content}>
          <ExerciseLibrary
            onSelect={(selectedExercises) => {
              setSelectedWorkout(null);
              setActiveTab('workouts');
              setPreselectedExercises(selectedExercises);
            }}
          />
        </View>
      )}

      {activeTab === 'historic' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Historique des séances</Text>
          <View style={styles.historicSection}>
            <ScrollView contentContainerStyle={{ gap: 16 }}>
              {seances.length === 0 && (
                <Text style={styles.noHistoric}>Aucune séance enregistrée pour l'instant.</Text>
              )}
              {seances.map((s: any) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.historicCard}
                  onPress={() => router.push(`/tracking/seance/${s.id}`)}
                >
                  <Text style={styles.historicDate}>
                    {s.entrainement?.titre ? s.entrainement.titre + ' - ' : ''}
                    {s.date ? new Date(s.date).toLocaleDateString() : 'Date inconnue'}
                    {s.date ? ' à ' + new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                  <Text style={styles.historicInfo}>Durée : {s.duree ?? '-'} min</Text>
                  <Text style={styles.historicInfo}>Poids soulevé : {s.poidsSouleve ?? '-'} kg</Text>
                  <Text style={styles.historicInfo}>Répétitions : {s.repetitions ?? '-'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  workoutList: {
    marginTop: 20,
  },
  workoutCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  workoutLevel: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  workoutExercises: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  historicSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noHistoric: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 40,
  },
  historicCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  historicDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  historicInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
