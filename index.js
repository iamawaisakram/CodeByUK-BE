const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// * Routes
const user = require('./routes/user')
const microApp1 = require('./routes/microApp1')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Server is running though')
})

app.use('/user', user)
app.use('/data', microApp1)

app.listen(port, () => {
  console.log(`We are live at 127.0.0.1:${port}`)
})
