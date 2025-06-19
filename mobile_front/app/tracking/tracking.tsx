import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'expo-router';

export default function TrackingTab() {
  const { user } = useUser();
  const [seances, setSeances] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchSeances = async () => {
      if (!user) return;
      try {
        const res = await axios.get('http://localhost:3000/seances');
        const filtered = res.data.filter((s: any) => s.utilisateur?.id === user.id);
        setSeances(filtered);
      } catch (err) {
        console.error('Erreur lors du chargement des séances', err);
      }
    };
    fetchSeances();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vos Séances</Text>
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        {seances.map((s: any) => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            onPress={() => router.push(`/tracking/seance/${s.id}`)}
          >
            <Text style={styles.cardTitle}>{new Date(s.date).toLocaleDateString()}</Text>
            <Text>Durée : {s.duree} min</Text>
            <Text>Poids soulevé : {s.poidsSouleve} kg</Text>
            <Text>Répétitions : {s.repetitions}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
});
