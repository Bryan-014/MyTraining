import { db } from '../db';

export type WorkoutExercise = {
  id: number;
  exercise_id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
};

export function addExerciseToWorkout(
  workoutId: number,
  exerciseId: number,
  sets: number,
  reps: number,
  weight: number,
  rest: number
) {
  db.runSync(
    `
    INSERT INTO workout_exercises
      (workout_id, exercise_id, sets, reps, weight, rest)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    [workoutId, exerciseId, sets, reps, weight, rest]
  );
}

export function getExercisesByWorkout(
  workoutId: number
): WorkoutExercise[] {
  return db.getAllSync<WorkoutExercise>(
    `
    SELECT
      we.id,
      we.exercise_id,
      e.name,
      we.sets,
      we.reps,
      we.weight,
      we.rest
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    WHERE we.workout_id = ?
    ORDER BY we.id;
    `,
    [workoutId]
  ) ?? [];
}

export function updateWorkoutExercise(
  id: number,
  sets: number,
  reps: number,
  weight: number,
  rest: number
) {
  db.runSync(
    `
    UPDATE workout_exercises
    SET sets = ?, reps = ?, weight = ?, rest = ?
    WHERE id = ?;
    `,
    [sets, reps, weight, rest, id]
  );
}

export function removeWorkoutExercise(id: number) {
  db.runSync(
    'DELETE FROM workout_exercises WHERE id = ?;',
    [id]
  );
}