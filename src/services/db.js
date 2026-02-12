import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
    if (db) return db;
    try {
        db = await SQLite.openDatabaseAsync('weather.db');
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      );
    `);
        console.log('Database initialized');
        return db;
    } catch (error) {
        console.error('Error initializing database', error);
    }
};

export const getSavedLocations = async () => {
    if (!db) await initDB();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM locations');
        return allRows;
    } catch (error) {
        console.error('Error getting locations', error);
        return [];
    }
};

export const saveLocation = async (city, lat, lon) => {
    if (!db) await initDB();
    try {
        // Check count
        const locations = await getSavedLocations();
        if (locations.length >= 5) {
            throw new Error("Maximum 5 saved locations allowed.");
        }

        // Check if duplicate (optional but good)
        const exists = locations.find(l => l.city.toLowerCase() === city.toLowerCase());
        if (exists) {
            // Return silently or maybe update? For now, we'll just not duplicate.
            return;
        }

        const result = await db.runAsync(
            'INSERT INTO locations (city, latitude, longitude) VALUES (?, ?, ?)',
            city,
            lat,
            lon
        );
        return result;
    } catch (error) {
        console.error('Error saving location', error);
        throw error;
    }
};

export const removeLocation = async (id) => {
    if (!db) await initDB();
    try {
        await db.runAsync('DELETE FROM locations WHERE id = ?', id);
    } catch (error) {
        console.error('Error removing location', error);
        throw error;
    }
};
