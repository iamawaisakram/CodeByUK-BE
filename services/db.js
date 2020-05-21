const pg = require('pg')

const config = {
  user: process.env.DB_USER, // * this is the db user credential
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10 // * max number of clients in the pool
  // idleTimeoutMillis: 30000,
}

const pool = new pg.Pool(config)

pool.on('connect', () => {
  console.log('connected to the Database')
})

const createTables = async () => {
  const userTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        address VARCHAR(128) NOT NULL,
        town VARCHAR(128) NOT NULL,
        postcode VARCHAR(128) NOT NULL,
        createdAt VARCHAR(128) NOT NULL,
        updatedAt VARCHAR(128) NOT NULL
      )`

  const dataTable = `CREATE TABLE IF NOT EXISTS
      data(
        id SERIAL PRIMARY KEY,
        value VARCHAR(128) NOT NULL,
        logbookEntry VARCHAR(128) NOT NULL,
        createdAt VARCHAR(128) NOT NULL,
        updatedAt VARCHAR(128) NOT NULL
      )`

  const remindersTable = `CREATE TABLE IF NOT EXISTS
      reminders(
        id SERIAL PRIMARY KEY,
        time VARCHAR(128) NOT NULL,
        routine VARCHAR(128) NOT NULL,
        description VARCHAR(128) NOT NULL,
        createdAt VARCHAR(128) NOT NULL,
        updatedAt VARCHAR(128) NOT NULL
      )`
  try {
    const userTableQuery = await pool.query(userTable)
    console.log(userTableQuery)
    const dataQuery = await pool.query(dataTable)
    console.log(dataQuery)
    const remindersQuery = await pool.query(remindersTable)
    console.log(remindersQuery)
    pool.end()
  } catch (error) {
    console.log(error)
    pool.end()
  }
}

pool.on('remove', () => {
  console.log('client removed')
  process.exit(0)
})

// * export pool and createTables to be accessible  from an where within the application
module.exports = {
  createTables,
  pool
}

require('make-runnable')
