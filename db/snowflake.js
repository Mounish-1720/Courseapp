import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';
dotenv.config();


const connection = snowflake.createConnection({
  account: process.env.SF_ACCOUNT,
  username: process.env.SF_USERNAME,
  password: process.env.SF_PASSWORD,
  warehouse: process.env.SF_WAREHOUSE,
  database: process.env.SF_DATABASE,
  schema: process.env.SF_SCHEMA,
});


connection.connect(err => {
  if (err) console.error('❌ Snowflake connection failed:', err);
  else console.log('✅ Connected to Snowflake');
});



export const fetchCourses = (track) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, title, track, level FROM courses
 WHERE track = ?`;
    connection.execute({
      sqlText: query,
      binds: [track],
      complete: (err, stmt, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    });
  });
};


export const insertPayment = (email, course, amount) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO payments (email, course_name, amount_paid) VALUES (?, ?, ?)`;
    connection.execute({
      sqlText: query,
      binds: [email, course, amount],
      complete: (err) => {
        if (err) reject(err);
        else resolve('✅ Payment saved');
      }
    });
  });
};