const mongooes = require('mongooes');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = required('bcryptjs');

let UserSchema = new mongooes.Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validator:{
      validator: validator.isEmail,
      message: "Sorry, {VALUE} is not a valid email address"
    }
  }
  password:{
    type: String,
    required: true,
    minlength: 8
  },
  tokens:[{
    access:{
      type: String,
      required: true,
    },
    token:{
      type: String,
      required: true
    }
  }]
})
