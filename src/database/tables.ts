export const CREATE_TABLES = `
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        sets INTEGER,
        reps INTEGER,
        weight REAL,
        rest INTEGER,
        FOREIGN KEY (workout_id) REFERENCES workouts(id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );
    
    CREATE TABLE IF NOT EXISTS exercise_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      workout_id INTEGER NOT NULL,
      weight REAL,
      reps INTEGER,
      date TEXT NOT NULL
    );
`;
