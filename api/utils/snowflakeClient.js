import snowflake from 'snowflake-sdk';

// Configuration (load from environment variables)
const config = {
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  clientSessionKeepAlive: true,
};

// Connection pool
const connectionPool = [];
const MAX_POOL_SIZE = 5;

// Initialize a new connection
const createConnection = () => snowflake.createConnection(config);

// Get a connection from pool or create new
export const getConnection = async () => {
  // Return an available connection
  while (connectionPool.length > 0) {
    const conn = connectionPool.pop();
    if (conn.isUp()) return conn;
  }

  // Create new connection
  return new Promise((resolve, reject) => {
    const conn = createConnection();
    conn.connect((err) => {
      if (err) {
        console.error('Snowflake connection error:', err);
        reject(err);
      } else {
        console.log('New Snowflake connection established');
        resolve(conn);
      }
    });
  });
};

// Release connection back to pool
export const releaseConnection = (conn) => {
  if (conn && conn.isUp() && connectionPool.length < MAX_POOL_SIZE) {
    connectionPool.push(conn);
  } else if (conn) {
    conn.destroy();
  }
};

// Execute a query with automatic connection handling
export const executeQuery = async (sqlText, binds = []) => {
  let conn;
  try {
    conn = await getConnection();
    
    return new Promise((resolve, reject) => {
      conn.execute({
        sqlText,
        binds,
        complete: (err, stmt, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      });
    });
  } finally {
    if (conn) releaseConnection(conn);
  }
};

// For TypeScript users (optional)
/**
 * @template T
 * @param {string} sqlText 
 * @param {any[]} [binds] 
 * @returns {Promise<T[]>}
 */
export const typedExecuteQuery = executeQuery;