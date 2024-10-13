import { openDB } from 'idb';

const DB_NAME = 'musicPlayer';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

// Initialize the database
export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Failed to open the database:', error);
  }
};

// Add a track to the database
export const addTrack = async (track) => {
  try {
    const db = await initDB();
    if (db) {
      await db.put(STORE_NAME, { ...track, id: track.id || Date.now() });
      console.log('Track added successfully');
    }
  } catch (error) {
    console.error('Failed to add track:', error);
  }
};

// Get all tracks from the database
export const getTracks = async () => {
  try {
    const db = await initDB();
    if (db) {
      const tracks = await db.getAll(STORE_NAME);
      return tracks;
    }
  } catch (error) {
    console.error('Failed to get tracks:', error);
  }
  return [];
};

// Delete a track from the database
export const deleteTrack = async (id) => {
  try {
    const db = await initDB();
    if (db) {
      await db.delete(STORE_NAME, id);
      console.log(`Track with ID ${id} deleted successfully`);
    }
  } catch (error) {
    console.error('Failed to delete track:', error);
  }
};