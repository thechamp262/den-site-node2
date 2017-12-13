const mongoose = require('mongoose');
const _ = require('lodash');

let  PoemSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  poem:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  categories:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  author:{
    type: Number,
    required: true,
    trim: true,
    minlength: 1
  },
  createdAt:{
    type: Number,
    required: true,
    trim: true,
    minlength: 1
  },
  active:{
    type: Boolean,
    required: true
  }
})

PoemSchema.methods.toJSON = ()=>{
  let poem = this;
  let poemObject = poem.toObject();

  return _.pick(poemObject,['_id','poem','title']);
}

PoemSchema.statics.grabAll = ()=>{

  return new Promise((resolve,reject)=>{
    Poems.find().then((poems)=>{
      if(!poems){
        return Promise.reject();
      }
      return resolve(poems);
    })
  })

}

PoemSchema.statics.grabOneById = (_id)=>{

  return new Promise((resolve,reject)=>{
    Poems.findOne({
      _id
    }).then((poem)=>{
      console.log("Here Here", poem);
      if(!poem){
        return Promise.reject();
      }
      return resolve(poem);
    }).catch((e)=>{
      return Promise.reject();
    })
  })
}

PoemSchema.statics.grabByCat = (sectionId)=>{
  let poem = this;
  poem.findOne({
    categories:sectionId,
    active: true
  }).then((poem)=>{
    if(!poem){
      return res.status(404).send();
    }
    res.send({poem});
  }).catch((e)=>{
    res.status(404).send();
  })
}

PoemSchema.statics.saveNewPoem = (name,poem,categories,active)=>{
  console.log('I am at the saveNewPoem section');
  let poems = new Poems({
    name,
    poem,
    categories,
    author: 1,
    createdAt: new Date().getTime(),
    active
  });
  return new Promise((resolve,reject)=>{
    poems.save().then((poem)=>{
      if(!poem){
        return Promise.reject();
      }
      return resolve(poem);
    })
  })
}

let Poems = mongoose.model('poems',PoemSchema);

module.exports = {Poems};
