import AppLayout from '@/components/app-layout';
import { getWorkoutById } from '@/src/database/services/workoutService';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getExercisesByWorkout } from '../src/database/services/workoutExerciseService';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/* ================= TYPES ================= */

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

type Workout = {
  id: number;
  name: string;
};

/* ================= SCREEN ================= */

export default function ExecuteWorkout() {
  const { workoutId } = useLocalSearchParams();

  const [exercises, setExercises] = useState<ExecutionExercise[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const data = getExercisesByWorkout(Number(workoutId));
    setWorkout(getWorkoutById(Number(workoutId)));

    setExercises(
      data.map(e => ({
        id: e.id,
        name: e.name,
        reps: e.reps,
        weight: e.weight,
        rest: e.rest ?? 1,
        totalSets: e.sets,
        currentSet: 1,
        resting: false,
        completed: false
      }))
    );
  }, []);

  const currentExercise =
    activeIndex !== null ? exercises[activeIndex] : null;

  function startExercise(index: number) {
    setActiveIndex(index);
  }

  /* ================= CONCLUIR SÉRIE ================= */

    function completeSet() {
    setExercises(prev => {
        return prev.map((ex, index) => {
        if (index === activeIndex) {
            // Retornamos um NOVO objeto com as propriedades alteradas
            return { ...ex, resting: true };
        }
        return ex;
        });
    });
    }

    /* ================= FINALIZAR DESCANSO ================= */

    function finishRest() {
    setExercises(prev => {
        return prev.map((ex, index) => {
        if (index === activeIndex) {
            const isLastSet = ex.currentSet === ex.totalSets;
            
            return {
            ...ex,
            resting: false,
            currentSet: isLastSet ? ex.currentSet : ex.currentSet + 1,
            completed: isLastSet
            };
        }
        return ex;
        });
    });

    // Fechar o modal apenas se o exercício foi concluído
    const currentEx = exercises[activeIndex!];
    if (currentEx.currentSet === currentEx.totalSets) {
        setActiveIndex(null);
    }
    }

  /* ================= CARD ================= */

  function ExerciseCard({ item, index }: any) {
    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            {item.weight}kg × {item.reps} reps
          </Text>
          <Text style={styles.subtitle}>
            Séries: {item.totalSets}
          </Text>
        </View>

        {!item.completed && (
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => startExercise(index)}
          >
            <Text style={styles.cardButtonText}>Iniciar</Text>
          </TouchableOpacity>
        )}

        {item.completed && (
          <Text style={styles.completed}>✔ Concluído</Text>
        )}
      </View>
    );
  }

  return (
    <AppLayout
      title={workout ? workout.name : 'Executar Treino'}
      showLinks={false}
    >
      <FlatList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <ExerciseCard item={item} index={index} />
        )}
      />

      {/* ================= MODAL EXECUÇÃO ================= */}

      <Modal visible={activeIndex !== null} transparent animationType="fade">
        <View style={modal.overlay}>
          <View style={modal.container}>
            {currentExercise && (
              <>
                <Text style={modal.title}>{currentExercise.name}</Text>

                <Text style={modal.subtitle}>
                  Série {currentExercise.currentSet} /{' '}
                  {currentExercise.totalSets}
                </Text>

                {!currentExercise.resting && !currentExercise.completed && (
                    <TouchableOpacity
                        style={modal.mainButton}
                        onPress={completeSet}
                    >
                        <Text style={modal.mainButtonText}>
                        Concluir série
                        </Text>
                    </TouchableOpacity>
                )}

                {currentExercise.resting && (
                    <RestTimer
                        key={`${currentExercise.id}-${currentExercise.currentSet}`} 
                        seconds={currentExercise.rest}
                        onFinish={finishRest}
                    />
                )}

                {currentExercise.completed && (
                  <Text style={modal.completed}>
                    Exercício concluído ✅
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {exercises.every(e => e.completed) && (
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishText}>Finalizar treino 🏁</Text>
        </TouchableOpacity>
      )}
    </AppLayout>
  );
}

/* ================= TIMER ================= */

function RestTimer({
  seconds,
  onFinish
}: {
  seconds: number;
  onFinish: () => void;
}) {
  const safeSeconds = seconds > 0 ? seconds : 1;
  const radius = 65;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  const animatedValue = useRef(new Animated.Value(0)).current;
  const [remaining, setRemaining] = useState(safeSeconds);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: safeSeconds * 1000,
      useNativeDriver: false
    }).start();

    const interval = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(interval);
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          onFinish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      animatedValue.stopAnimation();
    };
  }, []);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference]
  });

  return (
    <View style={pizza.container}>
      <Svg width={160} height={160}>
        {/* Fundo */}
        <Circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#2c3168"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Pizza animada */}
        <AnimatedCircle
          cx="80"
          cy="80"
          r={radius}
          stroke="#78f4ffff"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="80,80"
        />
      </Svg>

      <View style={pizza.center}>
        <Text style={pizza.time}>{remaining}s</Text>
        <Text style={pizza.label}>Descanso</Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const pizza = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  center: {
    position: 'absolute',
    alignItems: 'center'
  },
  time: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff'
  },
  label: {
    fontSize: 14,
    color: '#dce1ff'
  }
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#3a4b74ff',
    marginBottom: 18,
    padding: 22,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800'
  },
  subtitle: {
    color: '#dce1ff',
    fontSize: 16,
    marginTop: 4
  },
  cardButton: {
    backgroundColor: '#78f4ffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12
  },
  cardButtonText: {
    fontWeight: '800',
    color: '#13163aff'
  },
  completed: {
    color: '#78f4ffff',
    fontWeight: '800'
  },
  finishButton: {
    backgroundColor: '#407ddfff',
    padding: 18,
    borderRadius: 14,
    marginTop: 12
  },
  finishText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center'
  }
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 16
  },
  container: {
    backgroundColor: '#13163aff',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center'
  },
  subtitle: {
    color: '#dce1ff',
    fontSize: 18,
    marginVertical: 16
  },
  mainButton: {
    backgroundColor: '#78f4ffff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#13163aff'
  },
  completed: {
    marginTop: 12,
    color: '#78f4ffff',
    fontSize: 18,
    fontWeight: '800'
  }
});

const timer = StyleSheet.create({
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: '#78f4ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
  },
  time: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff'
  },
  label: {
    color: '#dce1ff',
    fontSize: 14
  }
});
