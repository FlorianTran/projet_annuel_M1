import { getAllExercises } from '@/lib/api/exercise';
import { Exercise } from '@/lib/models/exercise';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExerciseLibrary({ onSelect }: { onSelect?: (exercises: Exercise[]) => void }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [basket, setBasket] = useState<Exercise[]>([]);

  useEffect(() => {
    getAllExercises().then(setExercises);
  }, []);

  // Get unique muscle groups from exercises
  const muscleGroups = Array.from(
    new Set(exercises.flatMap((e) => e.muscleGroups))
  ).sort();

  const filtered = selectedGroup
    ? exercises.filter((e) => e.muscleGroups.includes(selectedGroup))
    : exercises;

  const handleAdd = (ex: Exercise) => {
    if (!basket.find((b) => b.id === ex.id)) {
      setBasket([...basket, ex]);
    }
  };

  const handleRemove = (exId: string) => {
    setBasket(basket.filter((b) => b.id !== exId));
  };

  const handleConfirm = () => {
    console.log('Confirming selection with basket:', basket);
    if (basket.length > 0 && onSelect) {
      onSelect(basket);
    }
  };

  const isInBasket = (exId: string) => basket.some((b) => b.id === exId);

  // Render muscle group chip
  const renderGroupChip = ({ item }: { item: string | null }) => (
    <TouchableOpacity
      style={[
        styles.groupChip,
        (selectedGroup === item || (!item && !selectedGroup)) && styles.groupChipSelected,
      ]}
      onPress={() => setSelectedGroup(item)}
    >
      <Text style={styles.groupChipText}>{item || 'Tous'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Muscle Group Filter */}
      <Text style={styles.subtitle}>Filtrer par groupe musculaire</Text>
      <View style={{ height: 36, marginBottom: 12 }}>
        <FlatList
          data={[null, ...muscleGroups]}
          renderItem={renderGroupChip}
          keyExtractor={item => item || 'Tous'}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', height: 36, maxHeight: 36 }}
        />
      </View>

      {/* Exercise List */}
      <Text style={styles.subtitle}>
        {selectedGroup ? `Exercices pour ${selectedGroup}` : 'Tous les exercices'}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.exerciseCard, isInBasket(item.id) && styles.exerciseCardSelected]}
            onPress={() => handleAdd(item)}
          >
            <Text style={styles.exerciseName}>{item.icon} {item.name}</Text>
            <Text style={styles.exerciseGroup}>Cible : {item.muscleGroups.join(', ')}</Text>
            {item.description && <Text style={styles.exerciseDesc}>{item.description}</Text>}
            {isInBasket(item.id) && (
              <Text style={styles.addedText}>✓ Ajouté</Text>
            )}
          </TouchableOpacity>
        )}
        style={styles.exerciseList}
      />

      {/* Selected Exercises Basket */}
      {basket.length > 0 && (
        <View style={styles.basketContainer}>
          <Text style={styles.subtitle}>Exercices sélectionnés ({basket.length})</Text>
          <ScrollView style={styles.basketList}>
            {basket.map((ex) => (
              <View key={ex.id} style={styles.selectedCard}>
                <Text style={styles.selectedName}>{ex.icon} {ex.name}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemove(ex.id)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <Button 
            title={`Créer un workout avec ${basket.length} exercice(s)`} 
            onPress={handleConfirm}
            color="#007AFF"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  groupRow: {}, // No layout here, only margin if needed
  groupChip: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 6,
    height: 28,
    minHeight: undefined,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupChipSelected: { backgroundColor: '#007AFF' },
  groupChipText: { fontSize: 13 },
  exerciseList: { flex: 1 },
  exerciseCard: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  exerciseCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  exerciseName: { fontSize: 15, fontWeight: '500' },
  exerciseGroup: { fontSize: 13, color: '#666', marginTop: 2 },
  exerciseDesc: { fontSize: 12, color: '#888', marginTop: 4, fontStyle: 'italic' },
  addedText: { fontSize: 12, color: '#007AFF', fontWeight: '600', marginTop: 4 },
  basketContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginTop: 16,
  },
  basketList: { maxHeight: 200 },
  selectedCard: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedName: { fontSize: 14, fontWeight: '500' },
  removeButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
}); 