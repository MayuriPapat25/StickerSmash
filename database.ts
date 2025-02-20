import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("pokemon.db"); // ✅ Correct function for newer versions

export const initializeDatabase = () => {
  try {
    const result = db.execAsync(
      "CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY, name TEXT,url TEXT)"
    );
    console.log("Pokemon Database created", result);
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

export const insertPokemon = async (id: number, name: string, url: string) => {
  try {
    const response = await db.runAsync(
      'INSERT OR REPLACE INTO pokemon (id, name, url) VALUES (?, ?, ?)',
      [id, name, url]
    );
    console.log('Pokemon inserted or updated', response);
  } catch (error) {
    console.error("Error saving item:", error);
  }
};

export const fetchPokemon = async () => {
  try {
    const result = await db.getAllAsync<{
      id: number;
      name: string;
      url: string;
    }>("SELECT * FROM pokemon");
    console.log("result", result);
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

export default db;
