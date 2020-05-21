const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// * DB connection
const { pool } = require('../services/db')

// * Auth Middleware
const auth = require('../middleware/auth')

// * Validations
const {
  registerFormValidation,
  loginFormValidation
} = require('../helpers/validations')

/* * *
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post('/signup', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    town,
    postcode
  } = req.body
  let error = registerFormValidation(req.body)
  if (error) {
    return res.status(400).send({
      error
    })
  } else {
    try {
      pool.connect((err, client, done) => {
        const query = 'SELECT * FROM users where email = $1'
        client.query(query, [email], async (error, result) => {
          if (error) {
            res.status(400).json({ error })
          }
          if (result && result.rows > '0') {
            res.status(404).send({
              status: 404,
              message: 'User Already Exists'
            })
          } else {
            const salt = await bcrypt.genSalt(10)
            const cryptedPassword = await bcrypt.hash(password, salt)
            const query =
              'INSERT INTO users(firstName, lastName, email, password, address, town, postcode, createdAt, updatedAt) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *'
            const values = [
              firstName,
              lastName,
              email,
              cryptedPassword,
              address,
              town,
              postcode,
              Date.now(),
              Date.now()
            ]
            client.query(query, values, (error, result) => {
              done()
              if (error) {
                res.status(400).json({ error })
              }
              jwt.sign(
                { user: { id: result.rows[0].id } },
                'randomString',
                {
                  expiresIn: 10000
                },
                (err, token) => {
                  if (err) throw err
                  res.status(200).json({
                    token
                  })
                }
              )
            })
          }
        })
      })
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Error in Saving')
    }
  }
})

/* * *
 * @method - POST
 * @param - /login
 * @description - User Login
 */

router.post('/login', (req, res) => {
  const { email, password } = req.body
  let error = loginFormValidation(req.body)
  if (error) {
    return res.status(400).send({
      error
    })
  } else {
    try {
      pool.connect((err, client, done) => {
        done()
        const query = 'SELECT * FROM users where email = $1'
        client.query(query, [email], async (error, result) => {
          if (error) {
            res.status(400).json({ error })
          }
          if (result && result.rows > '0') {
            const isMatch = await bcrypt.compare(
              password,
              result.rows[0].password
            )
            if (!isMatch)
              return res.status(400).json({
                message: 'Incorrect Password !'
              })

            // * Send JWT Token by signing it with 'secret' string :p
            jwt.sign(
              { user: { id: result.rows[0].id } },
              'secret',
              {
                expiresIn: '360 days'
              },
              (err, token) => {
                if (err) throw err
                res.status(200).json({
                  token
                })
              }
            )
          } else {
            return res.status(400).json({
              message: 'User Not Exist'
            })
          }
        })
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({
        message: 'Server Error'
      })
    }
  }
})

/* * *
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get('/me', auth, async (req, res) => {
  try {
    // * request.user is getting fetched from Middleware after token authentication
    pool.connect((err, client, done) => {
      done()
      const query = 'SELECT * FROM users where id = $1'
      client.query(query, [req.user.id], async (error, result) => {
        if (error) {
          res.status(400).json({ error })
        }
        res.send(result.rows[0])
      })
    })
  } catch (e) {
    res.send({ message: 'Error in Fetching user' })
  }
})

/* * *
 * @method - GET
 * @description - Get All Registered Users
 * @param - /user/all-users
 */

router.get('/all-users', auth, async (req, res) => {
  try {
    pool.connect((err, client, done) => {
      done()
      const query = 'SELECT * FROM users order by id desc'
      client.query(query, async (error, result) => {
        if (error) {
          res.status(400).json({ error })
        }
        res.status(200).send({ users: result.rows })
      })
    })
  } catch (e) {
    res.send({ message: 'Error in Fetching user' })
  }
})

module.exports = router
