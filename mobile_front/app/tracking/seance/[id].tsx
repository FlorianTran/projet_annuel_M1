import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function EntrainementDetailScreen() {
  const { id } = useLocalSearchParams();
  const [seance, setSeance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeance = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/seances/${id}`);
        setSeance(res.data);
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
      <View style={styles.card}>
        <Text>Date : {new Date(seance.date).toLocaleDateString()}</Text>
        <Text>Durée : {seance.duree} min</Text>
        <Text>Poids soulevé : {seance.poidsSouleve} kg</Text>
        <Text>Répétitions : {seance.repetitions}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 16,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
});
