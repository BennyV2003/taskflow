const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { username, email, password } = req.body

  try {

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' })
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    )

    // Create a JWT token 
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(201).json({ token, user: newUser.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}


const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

  
  // Compare password against the hash
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

   
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { register, login }