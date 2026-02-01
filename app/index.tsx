import AppLayout from '@/components/app-layout';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createWorkout, getWorkouts } from '../src/database/services/workoutService';

type Workout = {
  id: number;
  name: string;
};

export default function Index() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [name, setName] = useState('');

  const router = useRouter();

  function load() {
    setWorkouts(getWorkouts());
  }

  useEffect(() => {
    load();
  }, []);

  function handleAdd() {
    if (!name.trim()) return;

    createWorkout(name);
    setName('');
    load();
  }

  return (
    <AppLayout title="Vamos Cuidar da Saúde?">
      {/* <TextInput
        placeholder="Nome do treino"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginVertical: 12
        }}
      />

      <Button title="Adicionar treino" onPress={handleAdd} />

      <Link href="/exercises" style={{ marginVertical: 8 }}>
        <Text style={{ color: 'blue' }}>Ver exercícios</Text>
      </Link> */}

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        style={{ marginTop: 32, marginBottom: 8

         }}
        renderItem={({ item }) => (
          <View style={styles.workoutCard}>
            <Text style={styles.workoutTitle}>{item.name}</Text>
            <TouchableOpacity
                style={styles.workoutButton}
                onPress={() =>
                    router.push({
                    pathname: '/executeWorkout',
                    params: { workoutId: item.id }
                    })
                }
                >
                <Text style={styles.workoutButtonText}>Iniciar treino</Text>
            </TouchableOpacity>
          </View>
        
        )}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  workoutCard: {
    width: '100%',
    backgroundColor: '#3a4b74ff',
    marginBottom: 32,
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