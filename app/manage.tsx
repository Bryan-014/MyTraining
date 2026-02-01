import AppLayout from '@/components/app-layout';
import FloatingLabelInput from '@/components/floatin-label-input';
import { createWorkout, getWorkouts } from '@/src/database/services/workoutService';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Workout = {
  id: number;
  name: string;
};


export default function Manage() {
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
    <AppLayout title="Gerenciar Treinos">
        <FloatingLabelInput 
            label='Nome do Treino'
            value={name}
            onChangeText={setName}
        />
        <TouchableOpacity 
            style={styles.button}
            onPress={handleAdd}
        >
            <Text style={styles.buttonText}>Adicionar Treino</Text>
        </TouchableOpacity>
        <Link 
            style={styles.button}
            href="/exercises"
        >
            <Text style={styles.buttonText}>Gerenciar Exercícios</Text>
        </Link>
        <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={{ marginTop: 12, marginBottom: 8 }}
            renderItem={({ item }) => (
                <View style={styles.workoutCard}>
                    <Text style={styles.workoutTitle}>{item.name}</Text>
                    <TouchableOpacity
                        style={styles.workoutButton}
                        onPress={() =>
                            router.push({
                            pathname: '/workout',
                            params: { id: item.id, name: item.name }
                            })
                        }
                        >
                        <Text style={styles.workoutButtonText}>Exercícios</Text>
                    </TouchableOpacity>
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
