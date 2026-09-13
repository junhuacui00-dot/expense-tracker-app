import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('expense_tracker.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_type ON transactions(type);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const addTransaction = async (type, amount, category, date, remark) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO transactions (type, amount, category, date, remark) 
       VALUES (?, ?, ?, ?, ?)`,
      [type, amount, category, date, remark]
    );
    return result;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactionsByMonth = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const result = await db.getAllAsync(
      `SELECT * FROM transactions 
       WHERE date >= ? AND date <= ? 
       ORDER BY date DESC`,
      [startDate, endDate]
    );
    return result || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const getRecentTransactions = async (limit = 5) => {
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM transactions 
       ORDER BY date DESC, created_at DESC 
       LIMIT ?`,
      [limit]
    );
    return result || [];
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
};

export const deleteTransaction = async (id) => {
  try {
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getMonthStats = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const result = await db.getAllAsync(
      `SELECT type, SUM(amount) as total 
       FROM transactions 
       WHERE date >= ? AND date <= ? 
       GROUP BY type`,
      [startDate, endDate]
    );
    return result || [];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
};

export const getCategoryStats = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const result = await db.getAllAsync(
      `SELECT category, SUM(amount) as total 
       FROM transactions 
       WHERE type = 'expense' AND date >= ? AND date <= ? 
       GROUP BY category 
       ORDER BY total DESC`,
      [startDate, endDate]
    );
    return result || [];
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }
};

export default db;
