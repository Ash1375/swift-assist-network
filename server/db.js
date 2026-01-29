import mysql from "mysql2/promise";

let pool = null;

export async function getPool() {
  if (pool) return pool;
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 4000;
  const useSsl = process.env.DB_SSL === "true" || process.env.DB_SSL === "1";
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number.isNaN(port) ? 4000 : port,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "resqnow",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ...(useSsl && {
      ssl: {
        rejectUnauthorized: true,
      },
    }),
  });
  return pool;
}

export async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

const TECHNICIANS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS technicians (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  service_type VARCHAR(100),
  location VARCHAR(255),
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password_hash VARCHAR(255),
  address VARCHAR(512),
  region VARCHAR(255),
  district VARCHAR(255),
  state VARCHAR(255),
  locality VARCHAR(255),
  service_area_range INT DEFAULT 10,
  experience INT DEFAULT 0,
  specialties JSON,
  pricing JSON
)
`.trim();

export async function ensureTechniciansTable() {
  const p = await getPool();
  await p.execute(TECHNICIANS_TABLE_SQL);
}
