const jwt = require('jsonwebtoken')
const User = require('../models/user')

const protect = async (req, res, next) => {
  try {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
    // Check if token exists in the Authorization header
    // Token is sent like this: "Bearer eyJhbGci..."
    {
      token = req.headers.authorization.split(' ')[1]  
      // Split "Bearer eyJhbGci..." into ["Bearer", "eyJhbGci..."]
      // and take index [1] which is the actual token
    }

    if(!token)
    {
      return res.status(401).json({
        success : false,
        message : 'Not authorized, no token'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      })
    }
    req.user = user

    next()
  }

  catch(error)
  {
    console.log('Protect error:', error.message)
     return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token'
    })
  }
}

module.exports = protect

/*When a logged in user makes a request, the token in the authorization header looks like - Authorization: Bearer eyJhbjnu...*/
