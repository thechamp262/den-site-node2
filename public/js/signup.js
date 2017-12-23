jQuery('document').ready(function(){
  let socket = io();

  console.log('Document Ready!');

  let signUpButton = jQuery('#signup-submit-button');
  let signUpFormP = jQuery('#signup-form p');

  signUpButton.click(function(e){
    e.preventDefault();

    let email = jQuery('[name=email-input]');
    let password = jQuery('[name=password-input]');

    formHandler('signupForm',[ {email:{
      name: email[0].name,
      value: email.val(),
    },
    password: {
      name: password[0].name,
      value: password.val()
    }
    }],signUpFormP);
  })

})
