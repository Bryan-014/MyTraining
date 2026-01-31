import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { getExercises } from '../src/database/services/exerciseService';
import {
    addExerciseToWorkout,
    getExercisesByWorkout,
    removeWorkoutExercise,
    updateWorkoutExercise
} from '../src/database/services/workoutExerciseService';

type Exercise = {
  id: number;
  name: string;
};

type WorkoutExercise = {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
};

export default function Workout() {
  const { id, name } = useLocalSearchParams();
  const workoutId = Number(id);

  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [editingItem, setEditingItem] = useState<WorkoutExercise | null>(null);

  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rest, setRest] = useState('');

  function load() {
    setExercises(getExercisesByWorkout(workoutId));
  }

  useEffect(() => {
    load();
    setAllExercises(getExercises());
  }, []);

  function handleSave() {
    if (!exerciseId && !editingItem) return;

    if (editingItem) {
        updateWorkoutExercise(
        editingItem.id,
        Number(sets),
        Number(reps),
        Number(weight),
        Number(rest)
        );
    } else {
        addExerciseToWorkout(
        workoutId,
        exerciseId!,
        Number(sets),
        Number(reps),
        Number(weight),
        Number(rest)
        );
    }

    setModalVisible(false);
    setEditingItem(null);
    setExerciseId(null);
    load();
  }

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 48 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {name}
      </Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 8,
              width: '98%',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>
                {item.sets}x{item.reps} — {item.weight}kg
                </Text>
                <Text>Descanso: {item.rest}s</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button title="Editar" onPress={() => {
                    setEditingItem(item);
                    setSets(String(item.sets));
                    setReps(String(item.reps));
                    setWeight(String(item.weight));
                    setRest(String(item.rest));
                    setModalVisible(true);
                }} />

                <View style={{ width: 8 }} />

                <Button
                    title="Remover"
                    color="red"
                    onPress={() => {
                    removeWorkoutExercise(item.id);
                    load();
                    }}
                />
            </View>
          </View>
          </View>
        )}
      />

      <Button title="Adicionar exercício" onPress={() => setModalVisible(true)} />

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
            Adicionar exercício
          </Text>

          <Text style={{ marginTop: 12 }}>Escolha o exercício:</Text>

          <FlatList
            data={allExercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setExerciseId(item.id)}
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderRadius: 6,
                  marginTop: 8,
                  backgroundColor:
                    exerciseId === item.id ? '#ddd' : 'transparent'
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TextInput
            placeholder="Séries"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
            style={{ borderWidth: 1, marginTop: 12, padding: 8 }}
          />

          <TextInput
            placeholder="Repetições"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
            style={{ borderWidth: 1, marginTop: 8, padding: 8 }}
          />

          <TextInput
            placeholder="Carga (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            style={{ borderWidth: 1, marginTop: 8, padding: 8 }}
          />

          <TextInput
            placeholder="Descanso (segundos)"
            keyboardType="numeric"
            value={rest}
            onChangeText={setRest}
            style={{ borderWidth: 1, marginTop: 8, padding: 8 }}
          />

          <View style={{ marginTop: 16 }}>
            <Button title="Salvar" onPress={handleSave} />
            <View style={{ marginTop: 8 }}>
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}