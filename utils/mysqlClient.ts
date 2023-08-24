import mysql from 'mysql2';

const mysqlClient = mysql.createConnection(process.env.DATABASE_URL!);
console.log('Connected to PlanetScale!');
export default mysqlClient;