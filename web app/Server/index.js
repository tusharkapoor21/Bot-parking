const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')

app.use(cors())
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('ok')
})

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Bot_parking server listening on port ${port}`)
})
