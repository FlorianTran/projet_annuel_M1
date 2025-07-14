import { useUser } from '@/app/context/UserContext';
import { getExerciseById } from '@/lib/api/exercise';
import { Workout } from '@/lib/models/workout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  workout: Workout;
  onSaved?: () => void;
}

type SetLog = { weight: string; reps: string; rpe: string; note: string };

export default function WorkoutLogging({ workout, onSaved }: Props) {
  const { user } = useUser();
  const [logs, setLogs] = useState(
    workout.exercises.map(() => [{ weight: '', reps: '', rpe: '', note: '' }])
  );
  const [isSaving, setIsSaving] = useState(false);
  const [exerciseDetails, setExerciseDetails] = useState<(null | { name: string; icon?: string })[]>([]);

  useEffect(() => {
    // Fetch exercise details for each exerciseId
    const fetchDetails = async () => {
      const details = await Promise.all(
        workout.exercises.map(async (ex) => {
          try {
            const data = await getExerciseById(ex.exerciseId);
            return { name: data.name, icon: data.icon };
          } catch (err) {
            return { name: ex.exerciseId, icon: undefined };
          }
        })
      );
      setExerciseDetails(details);
    };
    fetchDetails();
  }, [workout.exercises]);

  const handleSetChange = (exIdx: number, setIdx: number, field: string, value: string) => {
    setLogs((prev) =>
      prev.map((exSets, i) =>
        i === exIdx
          ? exSets.map((set, j) => (j === setIdx ? { ...set, [field]: value } : set))
          : exSets
      )
    );
  };

  const handleAddSet = (exIdx: number) => {
    setLogs((prev) =>
      prev.map((exSets, i) => (i === exIdx ? [...exSets, { weight: '', reps: '', rpe: '', note: '' }] : exSets))
    );
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      return;
    }

    setIsSaving(true);
    
    try {
      console.log('=== SAVING WORKOUT SESSION ===');
      console.log('Workout:', workout.title);
      console.log('User:', user.id);
      console.log('Logs:', logs);

      // Calculate summary statistics
      let totalWeight = 0;
      let totalReps = 0;
      let totalSets = 0;
      let validSets = 0;

      logs.forEach((exerciseSets, exerciseIndex) => {
        exerciseSets.forEach((set) => {
          const weight = parseFloat(set.weight);
          const reps = parseInt(set.reps);
          
          if (!isNaN(weight) && !isNaN(reps) && weight > 0 && reps > 0) {
            totalWeight += weight;
            totalReps += reps;
            validSets++;
          }
        });
        totalSets += exerciseSets.length;
      });

      // Build exercises array for the seance
      const exercises = workout.exercises.map((ex, exIdx) => {
        const sets = logs[exIdx];
        let totalSets = sets.length;
        let totalReps = 0;
        let totalWeight = 0;
        let notes = sets.map(s => s.note).filter(Boolean).join(' | ');
        sets.forEach(set => {
          const reps = parseInt(set.reps);
          const weight = parseFloat(set.weight);
          if (!isNaN(reps)) totalReps += reps;
          if (!isNaN(weight)) totalWeight += weight;
        });
        return {
          exerciseId: ex.exerciseId,
          name: exerciseDetails[exIdx]?.name || ex.exerciseId,
          sets: totalSets,
          reps: totalReps,
          weight: totalWeight,
          notes,
        };
      });

      // Create a seance entry that summarizes the workout session
      let finalEntrainementId = workout.entrainementId;
      
      // If workout doesn't have entrainementId, create one
      if (!finalEntrainementId) {
        console.log('⚠️ Workout missing entrainementId, creating new entrainement...');
        try {
          const entrainementData = {
            titre: workout.title,
            description: workout.description,
            niveau: workout.level,
            methodologie: 'force',
          };
          const entrainementRes = await axios.post('http://localhost:3000/entrainements', entrainementData);
          finalEntrainementId = entrainementRes.data.id;
          console.log('✅ Created new entrainement with ID:', finalEntrainementId);
          
          // Update the workout with the new entrainementId
          try {
            await axios.patch(`http://localhost:3000/workouts/${workout.id}`, {
              entrainementId: finalEntrainementId
            });
            console.log('✅ Updated workout with entrainementId');
          } catch (updateErr) {
            console.warn('⚠️ Failed to update workout with entrainementId:', updateErr);
            // Continue anyway, the seance creation should still work
          }
        } catch (err) {
          console.error('❌ Failed to create entrainement:', err);
          Alert.alert('Erreur', 'Impossible de créer l\'entraînement associé');
          return;
        }
      }

      const seanceData = {
        date: new Date().toISOString(),
        duree: 60, // Default duration, could be made configurable
        poidsSouleve: validSets > 0 ? Math.round(totalWeight / validSets) : 0,
        repetitions: totalReps,
        entrainementId: finalEntrainementId, // Use the final entrainement ID
        utilisateurId: user.id,
        exercises, // <-- send all performed exercises!
      };

      console.log('=== SEANCE CREATION DEBUG ===');
      console.log('Workout object:', workout);
      console.log('Workout entrainementId:', workout.entrainementId);
      console.log('Workout entrainementId type:', typeof workout.entrainementId);
      console.log('Seance data to send:', seanceData);

      const response = await axios.post('http://localhost:3000/seances', seanceData);
      console.log('✓ Seance saved successfully:', response.data);

      Alert.alert('Succès', 'Séance enregistrée !');
      onSaved && onSaved();
    } catch (err: any) {
      console.error('❌ Error saving seance:', err);
      console.error('Error response:', err.response?.data);
      Alert.alert('Erreur', `Impossible d'enregistrer la séance: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enregistrer séance</Text>
      <Text style={styles.subtitle}>{workout.title}</Text>
      {workout.exercises.map((ex, exIdx) => (
        <View key={ex.exerciseId} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>
            Exercice: {exerciseDetails[exIdx]?.icon ? `${exerciseDetails[exIdx].icon} ` : ''}{exerciseDetails[exIdx]?.name || ex.exerciseId}
          </Text>
          {logs[exIdx].map((set, setIdx) => (
            <View key={setIdx} style={styles.setRow}>
              <Text>Set {setIdx + 1}</Text>
              <TextInput
                placeholder="Poids (kg)"
                keyboardType="numeric"
                value={set.weight}
                onChangeText={v => handleSetChange(exIdx, setIdx, 'weight', v)}
                style={styles.input}
              />
              <TextInput
                placeholder="Répétitions"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={v => handleSetChange(exIdx, setIdx, 'reps', v)}
                style={styles.input}
              />
              <TextInput
                placeholder="RPE (optionnel)"
                keyboardType="numeric"
                value={set.rpe}
                onChangeText={v => handleSetChange(exIdx, setIdx, 'rpe', v)}
                style={styles.input}
              />
              <TextInput
                placeholder="Note (optionnel)"
                value={set.note}
                onChangeText={v => handleSetChange(exIdx, setIdx, 'note', v)}
                style={styles.input}
              />
            </View>
          ))}
          <Button title="Ajouter une série" onPress={() => handleAddSet(exIdx)} />
        </View>
      ))}
      <Button 
        title={isSaving ? "Enregistrement..." : "Valider la séance"} 
        onPress={handleSave}
        disabled={isSaving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  exerciseCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  exerciseName: { fontWeight: '500', marginBottom: 8 },
  setRow: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
}); 