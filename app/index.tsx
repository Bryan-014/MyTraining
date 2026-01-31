import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    <View style={{ flex: 1, padding: 16, paddingTop: 48 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Meus Treinos 💪
      </Text>

      <TextInput
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
      </Link>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <Pressable
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 8
            }}
            onPress={() => {
                router.push(`/workout?id=${item.id}&name=${item.name}`);
            }}
          >
            <Text>{item.name}</Text>
            <TouchableOpacity
                onPress={() =>
                    router.push({
                    pathname: '/executeWorkout',
                    params: { workoutId: item.id }
                    })
                }
                >
                <Text>Iniciar treino</Text>
            </TouchableOpacity>
          </Pressable>
        )}
      />
    </View>
  );
}