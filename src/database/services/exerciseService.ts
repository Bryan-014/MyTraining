import { db } from '../db';

export type Exercise = {
  id: number;
  name: string;
};

export function createExercise(name: string) {
  db.runSync(
    'INSERT INTO exercises (name) VALUES (?);',
    [name]
  );
}

export function getExercises(): Exercise[] {
  return db.getAllSync<Exercise>(
    'SELECT * FROM exercises ORDER BY name;'
  ) ?? [];
}

export function deleteExercise(id: number) {
  db.runSync(
    'DELETE FROM exercises WHERE id = ?;',
    [id]
  );
}