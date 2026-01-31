import { useLocalSearchParams } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { getHistoryByExercise } from '../src/database/services/historyService';

export default function History() {
  const { exerciseId } = useLocalSearchParams();
  const history = getHistoryByExercise(Number(exerciseId));

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Histórico 📈
      </Text>

      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text>{item.date}</Text>
            <Text>{item.weight}kg × {item.reps}</Text>
          </View>
        )}
      />
    </View>
  );
}
