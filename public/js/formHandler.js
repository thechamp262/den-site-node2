let formHandler = function(formType,formInputs,location){

  messageHandeler(['','',location],true);

  switch (formType) {
    case 'signupForm':
      signupFormHandler(formInputs,location);
      break;
    case 'poemSubmitForm':
      poemSubmitFormHandler(formInputs,location);
      break;
    default:

  }
}

let signupFormHandler = function(Inputs,location){
  let email = Inputs[0].email.value;
  let password = Inputs[0].password.value;
  let signUpFormP = location;

  //checking the email / password in the formValidation js file
  emailChecked(email,function(emailRes){
    if(emailRes[0]){

      let passwordChecked = passwordCheck(password);

      if(!passwordChecked[0]){
        messageHandeler([passwordChecked[0],passwordChecked[1],signUpFormP]);
      }else{
        socket.emit('incomingSignUp',{
          email,
          password
        },function(){
          messageHandeler([true,'You\'ve successfully signed up! Please check your email.',signUpFormP]);
        })
      }

    }else{
        messageHandeler([emailRes[0],emailRes[1],signUpFormP]);
    }
  });
}

poemSubmitFormHandler = function(Inputs,location){
  console.log('Here now fool: ', Inputs);
}
