import { openDB } from 'idb';

const DB_NAME = 'InterviewAssistantDB';
const DB_VERSION = 1;

let dbPromise = null;

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Candidates store
        if (!db.objectStoreNames.contains('candidates')) {
          const candidateStore = db.createObjectStore('candidates', {
            keyPath: 'id',
            autoIncrement: true,
          });
          candidateStore.createIndex('email', 'email', { unique: true });
          candidateStore.createIndex('score', 'finalScore', { unique: false });
          candidateStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Chat messages store
        if (!db.objectStoreNames.contains('chatMessages')) {
          const chatStore = db.createObjectStore('chatMessages', {
            keyPath: 'id',
            autoIncrement: true,
          });
          chatStore.createIndex('candidateId', 'candidateId', { unique: false });
          chatStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Interview sessions store
        if (!db.objectStoreNames.contains('interviewSessions')) {
          const sessionStore = db.createObjectStore('interviewSessions', {
            keyPath: 'id',
            autoIncrement: true,
          });
          sessionStore.createIndex('candidateId', 'candidateId', { unique: false });
          sessionStore.createIndex('status', 'status', { unique: false });
        }
      },
    });
  }
  return await dbPromise;
};

export const database = {
  // Candidate operations
  async addCandidate(candidate) {
    const db = await getDB();
    return await db.add('candidates', {
      ...candidate,
      createdAt: new Date().toISOString(),
    });
  },

  async getCandidate(id) {
    const db = await getDB();
    return await db.get('candidates', id);
  },

  async getAllCandidates() {
    const db = await getDB();
    return await db.getAll('candidates');
  },

  async getCandidatesByScore() {
    const db = await getDB();
    const tx = db.transaction('candidates', 'readonly');
    const store = tx.objectStore('candidates');
    const index = store.index('score');
    return await index.getAll();
  },

  async updateCandidate(id, updates) {
    const db = await getDB();
    const existing = await db.get('candidates', id);
    if (!existing) {
      return await db.put('candidates', { id, ...updates });
    }
    return await db.put('candidates', { ...existing, ...updates, id });
  },

  async deleteCandidate(id) {
    const db = await getDB();
    return await db.delete('candidates', id);
  },

  // Chat message operations
  async addChatMessage(message) {
    const db = await getDB();
    return await db.add('chatMessages', {
      ...message,
      timestamp: new Date().toISOString(),
    });
  },

  async getChatMessages(candidateId) {
    const db = await getDB();
    const tx = db.transaction('chatMessages', 'readonly');
    const store = tx.objectStore('chatMessages');
    const index = store.index('candidateId');
    return await index.getAll(candidateId);
  },

  // Interview session operations
  async addInterviewSession(session) {
    const db = await getDB();
    return await db.add('interviewSessions', {
      ...session,
      createdAt: new Date().toISOString(),
    });
  },

  async getInterviewSession(candidateId) {
    const db = await getDB();
    const tx = db.transaction('interviewSessions', 'readonly');
    const store = tx.objectStore('interviewSessions');
    const index = store.index('candidateId');
    const sessions = await index.getAll(candidateId);
    return sessions[sessions.length - 1]; // Get the latest session
  },

  async updateInterviewSession(id, updates) {
    const db = await getDB();
    const existing = await db.get('interviewSessions', id);
    if (!existing) {
      return await db.put('interviewSessions', { id, ...updates });
    }
    return await db.put('interviewSessions', { ...existing, ...updates, id });
  },

  async getUnfinishedSessions() {
    const db = await getDB();
    const tx = db.transaction('interviewSessions', 'readonly');
    const store = tx.objectStore('interviewSessions');
    const index = store.index('status');
    return await index.getAll('in_progress');
  },
};

export default database;
