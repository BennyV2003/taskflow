const express = require('express')
const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Test route 
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

