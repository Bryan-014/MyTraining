import { db } from '../db';

export type Workout = {
  id: number;
  name: string;
};

export function createWorkout(name: string) {
  db.runSync(
    'INSERT INTO workouts (name) VALUES (?);',
    [name]
  );
}

export function getWorkouts(): Workout[] {
  const result = db.getAllSync<Workout>(
    'SELECT * FROM workouts ORDER BY id DESC;'
  );
  return result ?? [];
}

export function deleteWorkout(id: number) {
  db.runSync(
    'DELETE FROM workouts WHERE id = ?;',
    [id]
  );
}