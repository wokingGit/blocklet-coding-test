import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

// 创建或打开SQLite数据库文件
export const initializeDatabase = async () => {
  if (db) return;

  db = await open({
    filename: './codingtest.db',
    driver: sqlite3.Database,
  });

  try {
    // 执行CREATE TABLE语句
    await db.run(
      `CREATE TABLE IF NOT EXISTS profile_info (  
        id INTEGER PRIMARY KEY AUTOINCREMENT,  
        name TEXT NOT NULL, 
        phone INTEGER,  
        email TEXT  
      )`,
    );

    const row = await db.get('SELECT COUNT(*) AS count FROM profile_info');

    if (row.count === 0) {
      // 插入数据
      await db.run('INSERT INTO profile_info (name, phone, email) VALUES (?, ?, ?)', [
        'Alice',
        13295167541,
        '15426763671@gmail.com',
      ]);
    } else {
      console.error('表已包含数据.');
    }
  } catch (err) {
    console.error(err.message);
  }
};

// 导出数据库连接以便在其他地方使用
export const getDatabase = (): Database => {
  if (!db) {
    throw new Error('数据库尚未初始化。请先调用 initializeDatabase()。');
  }
  return db;
};
