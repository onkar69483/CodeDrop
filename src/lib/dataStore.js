import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './database.db',
  driver: sqlite3.Database
});

export async function initializeDatabase() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY,
      text TEXT,
      title TEXT,
      password TEXT,
      paste_expiration INTEGER,
      encrypted INTEGER
    )
  `);
}

export async function insertPaste(data) {
  const db = await dbPromise;
  const { id, text, title, password, paste_expiration, encrypted } = data;
  await db.run(`
    INSERT INTO pastes (id, text, title, password, paste_expiration, encrypted)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, text, title, password, paste_expiration, encrypted]);
}

export async function getPaste(id) {
  const db = await dbPromise;
  return db.get('SELECT * FROM pastes WHERE id = ?', [id]);
}

export async function getAllPastes() {
  const db = await dbPromise;
  const now = Date.now();
  return db.all('SELECT * FROM pastes WHERE paste_expiration > ?', [now]);
}
