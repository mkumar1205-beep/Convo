const jwt = require('jsonwebtoken')

const createToken = (userId) => {
  return jwt.sign(
    {id : userId},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRE} 
  )
}

const signup = async(req, res) => {
  try{
    const{username, email, password}=req.body

    if (!username || !email || !password) {
      return res.status(400).json({
      success: false,
      message: "Please provide username, email and password"
      })
    }

    const emailLower=email.toLowerCase()

    const existingEmail=await User.findOne({email: emailLower})
    if(existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      })
    }

    const existingUsername=await User.findOne({username})
    if(existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already registered'
      })
    }

    const user = await User.create({username, email: emailLower, password})

    const token = createToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  }

  catch(error){
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const login = async(req,res) => {
  try{
    const {email, password} = req.body

    if(!email || !password)
    {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({email: email.toLowerCase()})
    if(!user)
    {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch)
    {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    //password matched.create token
    const token = createToken(user._id)
    
    res.status(200).json({
      success: true,
      token,
      user:{
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  }

  catch(error)
  {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = {signup, login};