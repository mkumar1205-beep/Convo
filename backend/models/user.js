const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    username : {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      minlength:6
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password:{
      type: String,
      required: true,
      minlength: 6
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

userSchema.pre('save', async function(){
  if(!this.isModified('password')) return

  this.password=await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword=async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User