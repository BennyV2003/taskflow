const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware — runs on every request before it hits the routes
app.use(cors())
app.use(express.json())

// Test route — confirms the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

