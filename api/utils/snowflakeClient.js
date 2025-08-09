import snowflake from 'snowflake-sdk';

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA
});

connection.connect(err => {
  if (err) {
    console.error('Snowflake connection failed: ' + err.message);
  } else {
    console.log('Connected to Snowflake.');
  }
});

export const executeQuery = (query, binds = []) => {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    });
  });
};
