import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
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
    <View style={{ flex: 1, padding: 16, paddingTop: 48 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Exercícios 🏋️
      </Text>

      <TextInput
        placeholder="Nome do exercício"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginVertical: 12
        }}
      />

      <Button title="Adicionar exercício" onPress={handleAdd} />

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 8
            }}
          >
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}