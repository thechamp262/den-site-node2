jQuery('document').ready(function(){
  let socket = io();

  console.log('Document Ready!');

  let signUpButton = jQuery('#signup-submit-button');
  let signUpFormP = jQuery('#signup-form p');

  signUpButton.click(function(e){
    e.preventDefault();
    signUpFormP.text('');
    signUpFormP.attr('hidden');

    let email = jQuery('[name=email-input]').val();
    let password = jQuery('[name=password-input]').val();

    let emailChecked  = emailCheck(email,function(emails){

      if(emails[0]){
        let passwordChecked = passwordCheck(password);
        if(!passwordChecked[0]){
          signUpFormP.text(passwordChecked[1]);
          signUpFormP.removeAttr('hidden');
        }else{
          socket.emit('incomingSignUp',{
            email,
            password
          })
        }
      }else{
        signUpFormP.text(emails[1]);
        signUpFormP.removeAttr('hidden');
      }
    });
  })

  let passwordCheck = function (password){

    if(password.length < 10){
      return [false,'Password must be at least 10 characters long!'];
    }
    return [true];
  }

  let emailCheck = function(email,callback){
    if(email.match('.com') >= 0 || email.match('@') >= 0){
      return callback([false,'Email is not valid']);
    }

    let emailChecks = emailExistCheck(email,function(emails){
      let emailAlertText;
      if(!emails){
        emailAlertText = "That email is already in use!";
      }
      callback([emails,emailAlertText]);
    });
  }

  let emailExistCheck = function(email,callback){
    socket.emit('emailExistCheck',{
      email
    },function(emails){
      callback(emails);
    })
  }
  
})
