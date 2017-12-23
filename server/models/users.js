const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
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
  },
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

UserSchema.methods.toJSON = ()=>{
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = ()=>{
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET);

  user.tokens.push({access,token});

  return user.save().then(()=>{
    return token;
  })
}

UserSchema.methods.removeToken = function(token){
  let user = this;

  return user.update({
    $pull:{
      tokens:{token}
    }
  })
}

UserSchema.statics.findByToken = function(token){
  let User = this;
  let decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.saveUser = (email,password)=>{
  let user = new Users({
    email,
    password
  });
  return new Promise((resolve,reject)=>{
    user.save().then((users)=>{
      if(!users){
        return reject();
      }
      return resolve(users);
    }).catch((e)=>{
      return reject();
    })
  })
}

UserSchema.statics.checkEmail = (email)=>{
  return new Promise((resolve,reject)=>{
    Users.findOne({
      email
    }).then((emails)=>{

      if(emails === null){
        return resolve(true);
      }
        return resolve(false);
    }).catch((e)=>{
        return Promise.reject(e);
    })
  })
}

UserSchema.pre('save',function(next){
  let user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,function(e,salt){
      bcrypt.hash(user.password,salt,function(e,hash){
        user.password = hash;
        next();
      })
    })
  }else{
    next();
  }
})

let Users = mongoose.model('users',UserSchema);

module.exports = {Users};
