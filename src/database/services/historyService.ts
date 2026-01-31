import { db } from '../db';

export function addHistory(
  exerciseId: number,
  workoutId: number,
  weight: number,
  reps: number
) {
  db.runSync(
    `
    INSERT INTO exercise_history
      (exercise_id, workout_id, weight, reps, date)
    VALUES (?, ?, ?, ?, date('now'));
    `,
    [exerciseId, workoutId, weight, reps]
  );
}

export function getHistoryByExercise(exerciseId: number) {
  return db.getAllSync<{
    id: number;
    weight: number;
    reps: number;
    date: string;
  }>(
    `
    SELECT weight, reps, date
    FROM exercise_history
    WHERE exercise_id = ?
    ORDER BY date DESC;
    `,
    [exerciseId]
  ) ?? [];
}