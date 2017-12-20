require("./config/config");
const path = require('path');
const hbs = require('hbs');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {mongoose} = require('./db/mongoose');

const {Poems} = require('./models/poem');
const {Categories} = require('./models/categories');
const {Users} = require('./models/users');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT;

const app = express();



const server = app.listen(port,function(){
  console.log(`Started on at port ${port}`);
});

const io = socketIO().listen(server);

hbs.registerPartials(publicPath + '/views/partials');

app.use(express.static(publicPath));
app.set('views', publicPath + '/views');
app.set('view engine','hbs');

io.on('connection',(socket)=>{

  Poems.grabAll().then((poems)=>{
    for(i=0;i<poems.length;i++){
      socket.emit('poemsLoad',{
        name:poems[i].name,
        categories:poems[i].categories,
        poem: poems[i].poem,
        active: poems[i].active,
        _id:poems[i]._id,
        length: poems.length
      })
    }
  })

  Categories.displayAll().then((cat)=>{
    for(i=0;i<cat.length;i++){
      // console.log(cat[i].name,cat[i]._id)
      socket.emit('outGoingPoemCatInfo',{
        name:cat[i].name,
        _id:cat[i]._id
      },()=>{
      });
    }
  });


  socket.on('newPoemIncoming',(poem,callback)=>{
    Poems.saveNewPoem(poem.title,poem.poem,poem.cat,poem.active).then((poem)=>{
      console.log('This is the saved poem: ',poem);
      socket.emit('poemsLoad',{
        name:poem.name,
        categories:poem.categories,
        poem: poem.poem,
        active: poem.active,
        _id:poem._id
      })
    });
    callback();
  })
  socket.on('IncomingForEditPoem',(poem,callback)=>{
    Poems.grabOneById(poem._id).then((poem)=>{
      socket.emit('editPoem',{
        name: poem.name,
        _id: poem._id,
        poem: poem.poem,
        active: poem.active
      })
    })
  })

  socket.on('incomingSignUp',(user)=>{
    Users.saveUser(user.email,user.password).then((user)=>{
      console.log("This is the user",user);
    },(e)=>{
      console.log(e);
    })
  })

  socket.on('emailExistCheck',(email,callback)=>{
    console.log('email check area!!',email);
    Users.checkEmail(email.email).then((emails)=>{
      console.log('This is the emails ', emails);
      callback(emails);
    }).catch((e)=>{
      callback(e);
    })
  })
});


app.get('/',(req,res)=>{
  res.render('admin.hbs',{
    cssStyle: "/css/admin.css"
  });
})

app.get('/signup',(req,res)=>{
  res.render('signup.hbs',{
    cssStyle: `/css/signup.css`
  });
})

app.get('/login',(req,res)=>{
  res.render('login.hbs',{
    title: 'login',
    css: '#'
  })
})

module.exports = {app};
