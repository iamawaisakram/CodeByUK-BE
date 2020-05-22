const express = require('express')
const router = express.Router()

// * DB connection
const { pool } = require('../services/db')

// * Auth Middleware
const auth = require('../middleware/auth')

// * Validations
const {
  logbookFormValidation,
  reminderFormValidation
} = require('../helpers/validations')

/* * *
 * @method - GET
 * @description - Get All Data Entries
 * @param - /data/get-data-entries
 */

router.get('/get-data-entries', auth, async (req, res) => {
  try {
    // * request.user is getting fetched from Middleware after token authentication
    pool.connect((err, client, done) => {
      done()
      const query = 'SELECT * FROM data order by id desc'
      client.query(query, (error, result) => {
        if (error) {
          res.status(400).json({ error })
        }
        res.send({ entries: result.rows })
      })
    })
  } catch (e) {
    res.send({ message: 'Error in Fetching Logbook Entries' })
  }
})

/* * *
 * @method - GET
 * @description - Get Min and Max Values
 * @param - /data/get-test-results
 */

router.get('/get-test-results', auth, async (req, res) => {
  try {
    // * request.user is getting fetched from Middleware after token authentication
    const minQuery = 'SELECT MIN(value) FROM data'
    const maxQuery = 'SELECT MAX(value) FROM data'
    const min = await pool.query(minQuery)
    const max = await pool.query(maxQuery)
    res.send({ result: { ...min.rows[0], ...max.rows[0] } })
  } catch (e) {
    res.send({ message: 'Error in Fetching Logbook Entries' })
  }
})

/* * *
 * @method - POST
 * @description - Add Data Entry
 * @param - /data/add-data
 */
router.post('/add-data', auth, (req, res) => {
  const { value, logbookEntry } = req.body
  let error = logbookFormValidation(req.body)
  if (error) {
    return res.status(400).send({
      error
    })
  } else {
    pool.connect((err, client, done) => {
      done()
      const query =
        'INSERT INTO data(value, logbookEntry, createdAt, updatedAt) VALUES($1,$2,$3,$4) RETURNING *'
      const values = [value, logbookEntry, Date.now(), Date.now()]
      client.query(query, values, (error, result) => {
        if (error) {
          res.status(400).json({ error })
        }
        const getAllValuesQuery = 'select * from data order by id desc'
        client.query(getAllValuesQuery, (error, selectQueryResult) => {
          if (error) {
            res.status(400).json({ error })
          }
          res.status(200).send({
            status: 'Successfull',
            message: 'Entry Added Successfully',
            entries: selectQueryResult.rows
          })
        })
      })
    })
  }
})

/* * *
 * @method - GET
 * @description - Get All Reminder Entries
 * @param - /data/get-reminder-entries
 */

router.get('/get-reminder-entries', auth, async (req, res) => {
  try {
    // * request.user is getting fetched from Middleware after token authentication
    pool.connect((err, client, done) => {
      done()
      const query = 'SELECT * FROM reminders order by id desc'
      client.query(query, (error, result) => {
        if (error) {
          res.status(400).json({ error })
        }
        res.send({ entries: result.rows })
      })
    })
  } catch (e) {
    res.send({ message: 'Error in Fetching Reminders' })
  }
})

/* * *
 * @method - POST
 * @description - Add Reminder Entry
 * @param - /data/add-reminder
 */

router.post('/add-reminder', auth, (req, res) => {
  const { time, routine, description } = req.body
  let error = reminderFormValidation(req.body)
  if (error) {
    return res.status(400).send({
      error
    })
  } else {
    pool.connect((err, client, done) => {
      done()
      const query =
        'INSERT INTO reminders(time, routine, description, createdAt, updatedAt) VALUES($1,$2,$3,$4,$5) RETURNING *'
      const values = [time, routine, description, Date.now(), Date.now()]
      client.query(query, values, (error, result) => {
        if (error) {
          res.status(400).json({ error })
        }
        const getAllValuesQuery = 'select * from reminders order by id desc'
        client.query(getAllValuesQuery, (error, selectQueryResult) => {
          if (error) {
            res.status(400).json({
              error
            })
          }
          res.status(200).send({
            status: 'Successfull',
            message: 'Entry Added Successfully',
            entries: selectQueryResult.rows
          })
        })
      })
    })
  }
})

module.exports = router
