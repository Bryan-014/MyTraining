import { db } from './db';
import { CREATE_TABLES } from './tables';

export function runMigrations() {
  db.execSync(CREATE_TABLES);
}