
import * as SQLite from 'expo-sqlite';
class DbService{

    initDB = async()=>{
        const db = await SQLite.openDatabaseAsync('databaseName');
        return db
    }

 async migrateDbIfNeeded() {
    const db = await SQLite.openDatabaseAsync('databaseName');
  const DATABASE_VERSION = 1;
  let currentDbVersion = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  if (currentDbVersion?.user_version! >= DATABASE_VERSION) {
    return;
  }
  console.log(currentDbVersion)
  if (currentDbVersion?.user_version === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
`);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    currentDbVersion.user_version = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
    
}

export const dbService = new DbService()