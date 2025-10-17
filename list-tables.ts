import mysql from "mysql2/promise";

async function listTables() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const [tables] = await connection.query("SHOW TABLES");
  console.log("\n📊 Tabelle nel database:\n");
  console.log(tables);
  await connection.end();
}

listTables();
