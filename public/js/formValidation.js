let socket = io();

let emailChecked = function(email,callback){

  if(email.match('.com') >= 0 || email.match('@') >= 0){
    return callback([false,'Email is not valid']);
  }

  socket.emit('emailExistCheck',{
    email
  },function(emails){
    let emailAlertText;

    if(!emails){
      emailAlertText = "That email is already in use!!";
    }
    return callback([emails,emailAlertText]);
  })

}

let passwordCheck = function(password){
  if(password.length < 10){
    return [false,'Password must be at least 10 characters long!'];
  }
  return [true];
}

let titleCheck = function(title,callback){
  if(!title){
    return callback([false,'There Must be a title to the poem']);
  }

  socket.emit('checkTitle',{
    title
  },function(titles){
    console.log('This i the titles', titles);
    if(!titles){
      return callback([false,'That title already exsist!']);
    }
    return callback([true]);
  })
}

let categoryCheck = function(cat){
  if(!cat){
    return [false,'You must choose a category!'];
  }
  return [true];
}

let imageCheck = function(image,callback){
  let max = 4 * 1024 * 1024;

  if(!image[1]){
    return callback([false,'You must add an image to your poem!']);
  }

  if(image[0] > max){
    return callback([false,'The image file is too large, it shouldn\'t be more than 4MB.']);
  }

  socket.emit('imageNameCheck',{
    name: image[1]
  },function(image){
    if(!image){
      return callback([false,'An image with that name already exsist.']);
    }
    return callback([true]);
  })

}

let poemCheck = function(poem){
  if(!poem){
    return [false,'You must add the actual poem!'];
  }
  return [true];
}
