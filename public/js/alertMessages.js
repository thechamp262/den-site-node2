let successColor = 'green';
let errorColor = 'red';

let messageHandeler = function(messages,remove){
  let messageType = messages[0];
  let message = messages[1];
  let location = messages[2];

  if(remove){
    return removeError(location);
  }

  if(!messageType){
      errorHandeler(message,location);
  }else{
    successHandeler(message,location);
  }
}

let errorHandeler = function(errorMessage,errorLocation){
  errorLocation.css('color',errorColor).removeAttr('hidden').text(errorMessage);
}

let successHandeler = function(successMessage,successLocation){
  successLocation.css('color',successColor).removeAttr('hidden').text(successMessage);
}

let removeError = function(location){
  location.attr('hidden',true).text('');
}
