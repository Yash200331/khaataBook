const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  name: {
    type: String,
    
    trim: true,
  },
  profilepicture: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    Select:false
  },
  hisaab:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"hisaab"
  }]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
