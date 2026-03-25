import type { SQLiteDatabase } from "expo-sqlite";

export type Note = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const DATABASE_NAME = "makeitv2.db";

class DbService {
  async migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
    const DATABASE_VERSION = 2;
    const result = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
    const currentVersion = result?.user_version ?? 0;

    if (currentVersion >= DATABASE_VERSION) {
      return;
    }

    await db.execAsync("PRAGMA journal_mode = WAL;");

    const hasLegacyTable = await db.getFirstAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'test'",
    );
    const hasNotesTable = await db.getFirstAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'notes'",
    );

    if (currentVersion === 0) {
      if (hasLegacyTable) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS notes_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          INSERT INTO notes_new (id, title, description, created_at, updated_at)
          SELECT
            id,
            COALESCE(NULLIF(TRIM(title), ''), 'Sin titulo'),
            COALESCE(descripcion, ''),
            COALESCE(date, datetime('now')),
            COALESCE(date, datetime('now'))
          FROM test;

          DROP TABLE IF EXISTS test;
          ALTER TABLE notes_new RENAME TO notes;

          CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
        `);
      } else {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
        `);
      }

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS app_lock (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          pass_hash TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    }

    if (currentVersion > 0 && currentVersion < 2) {
      if (hasLegacyTable && !hasNotesTable) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS notes_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          INSERT INTO notes_new (id, title, description, created_at, updated_at)
          SELECT
            id,
            COALESCE(NULLIF(TRIM(title), ''), 'Sin titulo'),
            COALESCE(descripcion, ''),
            COALESCE(date, datetime('now')),
            COALESCE(date, datetime('now'))
          FROM test;

          DROP TABLE IF EXISTS test;
          ALTER TABLE notes_new RENAME TO notes;
        `);
      }

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS app_lock (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          pass_hash TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
      `);
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
  }

  async listNotes(db: SQLiteDatabase, query = ""): Promise<Note[]> {
    const trimmed = query.trim();

    if (!trimmed) {
      return db.getAllAsync<Note>(`
        SELECT
          id,
          title,
          description,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM notes
        ORDER BY updated_at DESC
      `);
    }

    const pattern = `%${trimmed}%`;
    return db.getAllAsync<Note>(
      `
        SELECT
          id,
          title,
          description,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM notes
        WHERE title LIKE ? OR description LIKE ?
        ORDER BY updated_at DESC
      `,
      pattern,
      pattern,
    );
  }

  async createNote(db: SQLiteDatabase, title: string, description: string): Promise<void> {
    const now = new Date().toISOString();
    const normalizedTitle = title.trim() || "Sin titulo";
    await db.runAsync(
      `
        INSERT INTO notes (title, description, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `,
      normalizedTitle,
      description.trim(),
      now,
      now,
    );
  }

  async deleteNote(db: SQLiteDatabase, id: number): Promise<void> {
    await db.runAsync("DELETE FROM notes WHERE id = ?", id);
  }
}

export const dbService = new DbService();
