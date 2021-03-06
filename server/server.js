require("./config/config");
const path = require('path');
const hbs = require('hbs');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {mongoose} = require('./db/mongoose');
const multer = require('multer');


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

const storage = multer.diskStorage({
  destination: './public/images/poem-images',
  filename: (req,file,callback)=>{
    callback(null,file.originalname);
  }
})

//Init Upload
const upload = multer({
  storage
}).single('image-upload');


io.on('connection',(socket)=>{

  Poems.grabAll().then((poems)=>{
    for(i=0;i<poems.length;i++){
      socket.emit('poemsLoad',{
        name:poems[i].name,
        categories:poems[i].categories,
        poem: poems[i].poem,
        active: poems[i].active,
        _id:poems[i]._id,
        length: poems.length,
        image: poems[i].image
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

  socket.on('checkTitle',(title,callback)=>{
    Poems.grabOneByName(title.title).then((poem)=>{
      callback(poem);
    })
  });

  socket.on('newPoemIncoming',(poem,callback)=>{
    Poems.saveNewPoem(poem.title,poem.poem,poem.cat,poem.active,poem.image).then((poem)=>{
      socket.emit('poemsLoad',{
        name:poem.name,
        categories:poem.categories,
        poem: poem.poem,
        active: poem.active,
        _id:poem._id,
        image:poem.image
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
        active: poem.active,
        image: poem.image
      })
    })
  });

  socket.on('incomingSignUp',(user,callback)=>{
    Users.saveUser(user.email,user.password).then((user)=>{
      callback();
    }).catch((e)=>{
      console.log(e);
    })
  })

  socket.on('emailExistCheck',(email,callback)=>{
    Users.checkEmail(email.email).then((emails)=>{
      callback(emails);
    }).catch((e)=>{
      callback(e);
    })
  })

  socket.on('imageNameCheck',(image,callback)=>{
    Poems.imageExistCheck(image).then((images)=>{
      callback(images);
    }).catch((e)=>{

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

app.post('/upload',(req,res)=>{
  upload(req,res,(e)=>{
    if(e){
      console.log(e);
    }else{
      res.render('admin.hbs',{
        cssStyle: "/css/admin.css"
      });
    }
  })
})

module.exports = {app};
