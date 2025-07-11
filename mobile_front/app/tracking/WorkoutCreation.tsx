import { useUser } from '@/app/context/UserContext';
import { Exercise } from '@/lib/models/exercise';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  exercises: Exercise[];
  onSaved?: () => void;
}

export default function WorkoutCreation({ exercises, onSaved }: Props) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('débutant');
  const [targets, setTargets] = useState(
    exercises.map((ex) => ({
      exerciseId: ex.id,
      targetSets: '3',
      targetReps: '10',
      notes: '',
    }))
  );

  // Sync targets with exercises prop
  useEffect(() => {
    setTargets(
      exercises.map((ex) => ({
        exerciseId: ex.id,
        targetSets: '3',
        targetReps: '10',
        notes: '',
      }))
    );
  }, [exercises]);

  const handleChange = (idx: number, field: string, value: string) => {
    setTargets((prev) => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const validateForm = () => {
    console.log('=== VALIDATION DEBUG ===');
    console.log('Title:', title, 'Length:', title.length, 'Trimmed:', title.trim().length);
    console.log('Targets:', targets);
    
    if (!title.trim()) {
      console.log('❌ Validation failed: Title is empty');
      Alert.alert('Erreur', 'Le titre est requis');
      return false;
    }
    
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      console.log(`Exercise ${i + 1}:`, target);
      
      if (!target.targetSets || !target.targetReps) {
        console.log(`❌ Validation failed: Missing sets/reps for exercise ${i + 1}`);
        Alert.alert('Erreur', `Veuillez remplir les séries et répétitions pour l'exercice ${i + 1}`);
        return false;
      }
      
      const sets = parseInt(target.targetSets);
      const reps = parseInt(target.targetReps);
      
      if (isNaN(sets) || sets <= 0 || sets > 20) {
        console.log(`❌ Validation failed: Invalid sets (${sets}) for exercise ${i + 1}`);
        Alert.alert('Erreur', `Le nombre de séries doit être entre 1 et 20 pour l'exercice ${i + 1}`);
        return false;
      }
      
      if (isNaN(reps) || reps <= 0 || reps > 100) {
        console.log(`❌ Validation failed: Invalid reps (${reps}) for exercise ${i + 1}`);
        Alert.alert('Erreur', `Le nombre de répétitions doit être entre 1 et 100 pour l'exercice ${i + 1}`);
        return false;
      }
    }
    
    console.log('✅ Validation passed');
    return true;
  };

  const handleSave = async () => {
    if (!user) {
      console.error('No user found in context');
      return Alert.alert('Erreur', 'Utilisateur non connecté');
    }
    
    console.log('=== WORKOUT CREATION DEBUG ===');
    console.log('Current user:', user);
    console.log('User ID:', user.id);
    console.log('Form data:', { title, description, level, targets });
    
    // Provide a default title if none is entered
    const finalTitle = title.trim() || `Workout ${new Date().toLocaleDateString()}`;
    console.log('Final title:', finalTitle);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed, not proceeding with save');
      return;
    }
    
    try {
      // 1. Create the entrainement first
      const entrainementData = {
        titre: finalTitle,
        description: description.trim(),
        niveau: level,
        methodologie: 'force', // or let user choose
      };
      const entrainementRes = await axios.post('http://localhost:3000/entrainements', entrainementData);
      const entrainementId = entrainementRes.data.id;

      // 2. Then create the workout, and store the entrainementId
      const workoutData = {
        title: finalTitle,
        description: description.trim(),
        level,
        exercises: targets.map(t => ({
          exerciseId: t.exerciseId,
          targetSets: Number(t.targetSets),
          targetReps: Number(t.targetReps),
          notes: t.notes.trim() || undefined,
        })),
        createdById: user.id,
        assignedToIds: [user.id],
        entrainementId, // <-- store this in the workout
      };
      
      console.log('Sending workout data to backend:', workoutData);
      console.log('Backend URL: http://localhost:3000/workouts');
      
      const response = await axios.post('http://localhost:3000/workouts', workoutData);
      console.log('✓ Workout created successfully:', response.data);
      console.log('✓ Response data structure:', {
        id: response.data.id,
        title: response.data.title,
        createdBy: response.data.createdBy,
        assignedTo: response.data.assignedTo,
        assignedToIds: response.data.assignedTo?.map(u => u.id),
        entrainementId: response.data.entrainementId,
      });
      
      Alert.alert('Succès', 'Workout créé avec succès !');
      onSaved && onSaved();
    } catch (err: any) {
      console.error('❌ Error creating workout:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      Alert.alert('Erreur', `Impossible de créer le workout: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un workout</Text>
      
      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <Text style={styles.helpText}>Donnez un titre à votre workout pour le retrouver facilement</Text>
        <TextInput 
          placeholder="Ex: Full Body Débutant" 
          value={title} 
          onChangeText={setTitle} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Description (optionnel)" 
          value={description} 
          onChangeText={setDescription} 
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
        />
        
        <Text style={styles.label}>Niveau</Text>
        <View style={styles.levelRow}>
          {['débutant', 'intermédiaire', 'avancé'].map((lvl) => (
            <Button 
              key={lvl} 
              title={lvl} 
              onPress={() => setLevel(lvl)} 
              color={level === lvl ? '#007AFF' : '#ccc'} 
            />
          ))}
        </View>
      </View>

      {/* Exercises */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Configuration des exercices ({exercises.length})
        </Text>
        <Text style={styles.helpText}>Ajustez le nombre de séries et répétitions pour chaque exercice</Text>
        {exercises.map((ex, idx) => {
          const target = targets[idx];
          if (!target) return null;
          return (
            <View key={ex.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>
                {ex.icon} {ex.name}
              </Text>
              <Text style={styles.exerciseGroup}>
                Cible : {ex.muscleGroups.join(', ')}
              </Text>
              <View style={styles.targetRow}>
                <View style={styles.targetInput}>
                  <Text style={styles.targetLabel}>Séries</Text>
                  <TextInput
                    placeholder="3"
                    keyboardType="numeric"
                    value={target.targetSets}
                    onChangeText={v => handleChange(idx, 'targetSets', v)}
                    style={styles.input}
                  />
                </View>
                <View style={styles.targetInput}>
                  <Text style={styles.targetLabel}>Répétitions</Text>
                  <TextInput
                    placeholder="10"
                    keyboardType="numeric"
                    value={target.targetReps}
                    onChangeText={v => handleChange(idx, 'targetReps', v)}
                    style={styles.input}
                  />
                </View>
              </View>
              <TextInput
                placeholder="Notes (optionnel)"
                value={target.notes}
                onChangeText={v => handleChange(idx, 'notes', v)}
                style={[styles.input, styles.notesInput]}
              />
            </View>
          );
        })}
      </View>

      <Button 
        title="Créer le workout" 
        onPress={handleSave}
        color="#007AFF"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  helpText: { fontSize: 14, color: '#666', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: { fontWeight: '600', marginTop: 16, marginBottom: 6 },
  levelRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  exerciseCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  exerciseName: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  exerciseGroup: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 12 
  },
  targetRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  targetInput: {
    flex: 1,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesInput: {
    height: 60,
    textAlignVertical: 'top',
  },
}); 