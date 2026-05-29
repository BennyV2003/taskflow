const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    // Verify the token using our JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user id to the request so route handlers can use it
    req.user = decoded

    // next() passes the request on to the actual route handler
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' })
  }
}

module.exports = authMiddleware