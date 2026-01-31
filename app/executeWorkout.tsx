import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { getExercisesByWorkout } from '../src/database/services/workoutExerciseService';

type ExecutionExercise = {
  id: number;
  name: string;
  reps: number;
  weight: number;
  rest: number;
  totalSets: number;
  currentSet: number;
  resting: boolean;
  completed: boolean;
};

export default function ExecuteWorkout() {
    const { workoutId } = useLocalSearchParams();
    const [exercises, setExercises] = useState<ExecutionExercise[]>([]);

    useEffect(() => {
    const data = getExercisesByWorkout(Number(workoutId));

    setExercises(
        data.map(e => ({
        id: e.id,
        name: e.name,
        reps: e.reps,
        weight: e.weight,
        rest: e.rest,
        totalSets: e.sets,
        currentSet: 1,
        resting: false,
        completed: false
        }))
    );
    }, []);

    function completeSet(index: number) {
        setExercises(prev => {
            const updated = [...prev];
            const ex = updated[index];

            if (ex.currentSet >= ex.totalSets) {
            ex.completed = true;
            ex.resting = false;
            } else {
            ex.currentSet += 1;
            ex.resting = true;
            }

            return updated;
        });
    }

    function startRestTimer(index: number) {
    let remaining = exercises[index].rest;

    const interval = setInterval(() => {
            remaining--;

            if (remaining <= 0) {
            clearInterval(interval);
            setExercises(prev => {
                const updated = [...prev];
                updated[index].resting = false;
                return updated;
            });
            }
        }, 1000);
    }

    function ExerciseCard({ item, index }) {
        return (
            <View style={{
            padding: 16,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            backgroundColor: item.completed ? '#d4edda' : '#fff'
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {item.name}
            </Text>

            <Text>{item.weight}kg × {item.reps} reps</Text>
            <Text>Série {item.currentSet} / {item.totalSets}</Text>

            {!item.completed && !item.resting && (
                <Button
                title="Concluir série"
                onPress={() => {
                    completeSet(index);
                    if (item.rest > 0) startRestTimer(index);
                }}
                />
            )}

            {item.resting && (
                <Text style={{ color: 'orange', marginTop: 8 }}>
                Descanso...
                </Text>
            )}

            {item.completed && (
                <Text style={{ color: 'green', marginTop: 8 }}>
                Exercício concluído ✅
                </Text>
            )}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16, paddingTop: 48 }}>
            <FlatList
            data={exercises}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) =>
                <ExerciseCard item={item} index={index} />
            }
            />

            {exercises.every(e => e.completed) && (
            <Button title="Finalizar treino 🏁" />
            )}
        </View>
    );
}
