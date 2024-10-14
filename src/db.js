import { openDB } from 'idb';

const DB_NAME = 'musicPlayer';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
  return db;
};

// Generate a unique ID
const generateId = async () => {
  const db = await initDB();
  const currentTracks = await db.getAll(STORE_NAME);
  return currentTracks.length + 1; // Simple way to generate unique IDs
};

// Add tracks to the database
export const addTrack = async (track) => {
  const id = await generateId(); // Get a new ID
  const db = await initDB();
  await db.put(STORE_NAME, { ...track, id });
};

// Get all tracks from the database
export const getTracks = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Delete a track from the database
export const deleteTrack = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
