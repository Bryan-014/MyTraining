import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import AppLayout from '@/components/app-layout';
import FloatingLabelInput from '@/components/floatin-label-input';
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
  exercise_id: number;
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

  const [selectVisible, setSelectVisible] = useState(false);

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
    <AppLayout title={String(name)}>
      <Link 
          style={styles.button}
          href="/manage"
      >
          <Text style={styles.buttonText}>Gerenciar Treinos</Text>
      </Link>
      <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            setEditingItem(null);
            setExerciseId(null);
            setSets("");
            setReps("");
            setWeight("");
            setRest("");
            setModalVisible(true);
          }}
      >
          <Text style={styles.buttonText}>Adicionar Exercicio</Text>
      </TouchableOpacity>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        style={{ marginTop: 16, marginBottom: 18 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View
            style={styles.workoutCard}
          >
            <View>
                <Text style={{ fontWeight: 'bold', color: "#fff", fontSize: 18 }}>{item.name}</Text>
                <Text style={{ color: "#fff", fontSize: 18 }}>
                {item.sets}x{item.reps} — {item.weight}kg
                </Text>
                <Text style={{ color: "#fff", fontSize: 18 }}>Descanso: {item.rest}s</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button title="Editar" onPress={() => {
                    setEditingItem(item);
                    setExerciseId(item.exercise_id);
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
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>

            <Text style={modalStyles.title}>
              {editingItem ? 'Editar exercício' : 'Adicionar exercício'}
            </Text>
            <TouchableOpacity
              style={modalStyles.select}
              onPress={() => setSelectVisible(true)}
            >
              <Text style={modalStyles.selectText}>
                {allExercises.find(e => e.id === exerciseId)?.name ?? 'Selecionar exercício'}
              </Text>
            </TouchableOpacity>

            <FloatingLabelInput 
              label='Séries'
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"

            />
            <FloatingLabelInput 
              label='Repetições'
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"

            />
            <FloatingLabelInput 
              label='Carga (kg)'
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"

            />
            <FloatingLabelInput 
              label='Descanso (segundos)'
              value={rest}
              onChangeText={setRest}
              keyboardType="numeric"

            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#a81d1dff' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      <Modal visible={selectVisible} animationType="fade" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>

            <Text style={modalStyles.title}>Selecionar exercício</Text>

            <FlatList
              data={allExercises}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={selectStyles.option}
                  onPress={() => {
                    setExerciseId(item.id);
                    setSelectVisible(false);
                  }}
                >
                  <Text style={selectStyles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#a81d1dff' }]}
              onPress={() => setSelectVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </AppLayout>
  );
}


const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#13163aff',
    borderRadius: 22,
    padding: 22,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#78f4ffff',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
  select: {
    borderWidth: 1,
    borderColor: '#002fffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectText: {
    color: '#fff',
    fontSize: 16,
  },
});

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

const selectStyles = StyleSheet.create({
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2f335d',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
});