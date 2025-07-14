import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EntrainementDetailScreen() {
  const { id } = useLocalSearchParams();
  const [seance, setSeance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workoutTitle, setWorkoutTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeance = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/seances/${id}`);
        setSeance(res.data);
        // Try to get workout/entrainement title if available
        if (res.data.entrainement && res.data.entrainement.titre) {
          setWorkoutTitle(res.data.entrainement.titre);
        } else {
          setWorkoutTitle(null);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la séance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeance();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!seance) return <Text>Pas de séance trouvée.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Détail de la séance</Text>
      {workoutTitle && (
        <Text style={styles.workoutTitle}>Workout : {workoutTitle}</Text>
      )}
      <View style={styles.card}>
        <Text>Date : {seance.date ? new Date(seance.date).toLocaleDateString() : 'Inconnue'}</Text>
        <Text>Durée : {seance.duree ?? '-'} min</Text>
        <Text>Poids soulevé : {seance.poidsSouleve ?? '-'} kg</Text>
        <Text>Répétitions : {seance.repetitions ?? '-'}</Text>
        {seance.utilisateur && (
          <Text>Utilisateur : {seance.utilisateur.prenom} {seance.utilisateur.nom}</Text>
        )}
      </View>
      {Array.isArray(seance.exercises) && seance.exercises.length > 0 && (
        <View style={styles.exerciseSection}>
          <Text style={styles.sectionTitle}>Exercices réalisés</Text>
          {seance.exercises.map((ex: any, idx: number) => (
            <View key={idx} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text>Séries : {ex.sets}</Text>
              <Text>Répétitions : {ex.reps}</Text>
              <Text>Poids : {ex.weight} kg</Text>
              {ex.notes && <Text>Notes : {ex.notes}</Text>}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  workoutTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#007AFF' },
  card: {
    padding: 16,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    marginBottom: 20,
  },
  exerciseSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseName: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
});
