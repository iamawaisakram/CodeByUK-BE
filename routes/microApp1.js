const express = require('express');
const router = express.Router();

// * DB connection
const { pool } = require('../services/db');

// * Auth Middleware
const auth = require('../middleware/auth');

// * Validations
const {
  logbookFormValidation,
  reminderFormValidation,
} = require('../helpers/validations');

router.post('/add-data', auth, (req, res) => {
  const { value, logbookEntry } = req.body;
  let error = logbookFormValidation(req.body);
  if (error) {
    return res.status(400).send({
      error,
    });
  } else {
    pool.connect((err, client, done) => {
      done();
      const query =
        'INSERT INTO data(value, logbookEntry, createdAt, updatedAt) VALUES($1,$2,$3,$4) RETURNING *';
      const values = [value, logbookEntry, Date.now(), Date.now()];
      client.query(query, values, (error, result) => {
        if (error) {
          res.status(400).json({ error });
        }
        const getAllValuesQuery = 'select * from data order by id desc';
        client.query(getAllValuesQuery, (error, selectQueryResult) => {
          if (error) {
            res.status(400).json({ error });
          }
          res.status(200).send({
            status: 'Successfull',
            message: 'Entry Added Successfully',
            entries: selectQueryResult.rows,
          });
        });
      });
    });
  }
});

router.post('/add-reminder', auth, (req, res) => {
  const { time, routine, description } = req.body;
  let error = reminderFormValidation(req.body);
  if (error) {
    return res.status(400).send({
      error,
    });
  } else {
    pool.connect((err, client, done) => {
      done();
      const query =
        'INSERT INTO reminders(time, routine, description, createdAt, updatedAt) VALUES($1,$2,$3,$4,$5) RETURNING *';
      const values = [time, routine, description, Date.now(), Date.now()];
      client.query(query, values, (error, result) => {
        if (error) {
          res.status(400).json({ error });
        }
        const getAllValuesQuery = 'select * from reminders order by id desc';
        client.query(getAllValuesQuery, (error, selectQueryResult) => {
          if (error) {
            res.status(400).json({
              error,
            });
          }
          res.status(200).send({
            status: 'Successfull',
            message: 'Entry Added Successfully',
            entries: selectQueryResult.rows,
          });
        });
      });
    });
  }
});

module.exports = router;
