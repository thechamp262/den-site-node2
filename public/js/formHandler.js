let formHandler = function(formType,formInputs,location){
  console.log('this is the location',location);

  messageHandeler(['','',location],true);

  switch (formType) {
    case 'signupForm':
      signupFormHandler(formInputs,location);
      break;
    case 'poemSubmitForm':
      poemSubmitFormHandler(formInputs,location);
      break;
    default:
      messageHandeler([false,'Sorry, the form doesn\'t seem to be working.',location]);
      break;

  }
}

//function is called to send the needed information to alertmessage.js
let messageSender = function(activeButton,messageInfo){
  if(activeButton[0]){
    activeButton[1].removeAttr('disabled').text(activeButton[2]);
  }
  messageHandeler([messageInfo[0],messageInfo[1],messageInfo[2]]);
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
        messageSender([],[passwordChecked[0],passwordChecked[1],signUpFormP]);
      }else{
        socket.emit('incomingSignUp',{
          email,
          password
        },function(){
          messageSender([],[true,'You\'ve successfully signed up! Please check your email.',signUpFormP]);
        })
      }

    }else{
        messageSender([],[emailRes[0],emailRes[1],signUpFormP]);
    }
  });
}

let poemSubmitFormHandler = function(Inputs,location){
  Inputs[0].button.locations.attr('disabled','disabled').text('Submitting Poem...');

  let image = Inputs[0].image.image;
  let imageName;
  let imageSize;

  if(!image){
    imageName = null;
    imageSize = null;
  }else{
    imageName = image.name;
    imageSize = image.size;
  }

  titleCheck(Inputs[0].title.value,function(titles){

    if(!titles[0]){
      messageSender([true,Inputs[0].button.locations,'Submit Poem'],[titles[0],titles[1],location]);
    }else{

      let categoryChecked =  categoryCheck(Inputs[0].category.value);

      if(!categoryChecked[0]){
        messageSender([true,Inputs[0].button.locations,'Submit Poem'],[categoryChecked[0],categoryChecked[1],location]);
      }else{
        let poemChecked  = poemCheck(Inputs[0].poem.value);

        if(!poemChecked[0]){
          messageSender([true,Inputs[0].button.locations,'Submit Poem'],[poemChecked[0],poemChecked[1],location]);
        }else{
          imageCheck([imageSize,imageName],function(emails){
            console.log('We made it!',emails);
            if(!emails[0]){
              console.log('Here in emails emails@@!')
              messageSender([true,Inputs[0].button.locations,'Submit Poem'],[emails[0],emails[1],location]);
            }else{
              socket.emit('newPoemIncoming',{
                title: Inputs[0].title.value,
                poem: Inputs[0].poem.value,
                cat: Inputs[0].category.value,
                active: Inputs[0].active.active,
                image: imageName
              },function(){
                messageSender([true,Inputs[0].button.locations,'Submit Poem'],[true,'Your Poem was successfully submitted',location]);
                // title.val('');
                // poem.val('');
                // cat.val('original-select');
                // active.prop('checked',false);
              })
            }
          })
        }
      }
    }
  });
}
