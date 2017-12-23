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

let passwordCheck = function(password,callback){
  if(password.length < 10){
    return [false,'Password must be at least 10 characters long!'];
  }
  return [true];
}
