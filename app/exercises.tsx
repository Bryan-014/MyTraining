import AppLayout from '@/components/app-layout';
import FloatingLabelInput from '@/components/floatin-label-input';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createExercise, getExercises } from '../src/database/services/exerciseService';

type Exercise = {
  id: number;
  name: string;
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');

  function load() {
    setExercises(getExercises());
  }

  useEffect(() => {
    load();
  }, []);

  function handleAdd() {
    if (!name.trim()) return;

    createExercise(name);
    setName('');
    load();
  }

  return (
    <AppLayout title="Gerenciar Exercícios">
      <FloatingLabelInput 
          label='Nome do Exercício'
          value={name}
          onChangeText={setName}
      />
      <TouchableOpacity 
          style={styles.button}
          onPress={handleAdd}
      >
          <Text style={styles.buttonText}>Adicionar Exercício</Text>
      </TouchableOpacity>
      <Link 
          style={styles.button}
          href="/manage"
      >
          <Text style={styles.buttonText}>Gerenciar Treinos</Text>
      </Link>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16, marginBottom: 8 }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            style={styles.workoutCard}
          >
            <Text style={styles.workoutTitle}>{item.name}</Text>
          </View>
        )}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#407ddfff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: 18
  },
  workoutCard: {
    width: '100%',
    backgroundColor: '#3a4b74ff',
    marginBottom: 18,
    padding: 22,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,  
    alignItems: 'center'
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600'
  },
  workoutButton: {
    backgroundColor: '#78f4ffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  workoutButtonText: {
    color: '#13163aff',
    fontWeight: '700',
    fontSize: 14
  }
});