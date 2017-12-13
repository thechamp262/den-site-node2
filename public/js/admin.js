jQuery('document').ready(function(){

   let socket = io();

  console.log("Boom!!");

  //Function call for the materialize css framework

   let inputButton = jQuery('#poem-submit-button');//
   let form = jQuery('#new-poem-form');

  jQuery('#table-body-poems').empty();

   socket.on('poemsLoad',function(poem){
     console.log("This is the ID: ", poem._id);

       let tr =jQuery(`
         <tr>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.name}</p></div></th>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.poem}</th>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.categories}</p></div></th>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.active}</p></div></th>
         <th><div class="admin-main-section-table-body-divs"><button id='${poem._id}' class="enter-edit-poem">Edit</button></div></th>
         </tr>`);
         jQuery('#table-body-poems').append(tr);

   });

   jQuery('#table-body-poems').on('click','button.enter-edit-poem',function(){
     socket.emit('IncomingForEditPoem',{
       _id:jQuery(this).attr('id')
     },function(poem){
       console.log(poem);
     })
   });


   socket.on('editPoem',function(poem){
     jQuery('#edit-poem-form').empty();
     console.log(poem);
     let check;
     if(poem.active){
       check = 'checked="checked"'
     }else{
       check = '';
     }
     let formInput = `<input autofocus type="text" value="${poem.name}"/><p>
       <input name="is-active"${check}  type="checkbox" id="test5" /><label for="test5">Make Active</label></p>
       <textarea id="textarea1" class="materialize-textarea" name="poem">${poem.poem}</textarea>
       <button id="${poem._id}" class="btn waves-effect waves-light" type="submit" name="action">Submit Edit<i class="material-icons right"></i></button>`
       jQuery('#edit-poem-form').append(formInput);
       jQuery('#edit-popup').css('display','block');
       jQuery('#popup-overlay').css('display','block');
   })

    jQuery('.row').on('click',function(){
       jQuery('#popup-overlay').css('display','none');
       document.getElementById('edit-popup').style.display = 'none';
    })

   socket.on('outGoingPoemCatInfo',function(cat){
     let option = jQuery(`<option id="${cat._id}">${cat.name}</option>`);
     jQuery('#poem-cat-sel').append(option);
     jQuery('select').material_select();
     console.log('This is the length:',jQuery('tbody tr').length);
   })

   form.on('submit',function(e){
     e.preventDefault();
     inputButton.attr('disabled','disabled').text('Submitting Poem...');
     let title = jQuery('[name=title]'),
        poem = jQuery('[name=poem]'),
        cat = jQuery('[name=category-select]'),
        active = jQuery('[name=is-active]');
    socket.emit('newPoemIncoming',{
      title: title.val(),
      poem: poem.val(),
      cat: jQuery(`#${cat.attr('id')} option:selected`).attr('id'),
      active: active.is(':checked')
    },function(){
      inputButton.removeAttr('disabled').text('Submit Poem');
      title.val('');
      poem.val('');
      cat.val('original-select');
      active.prop('checked',false);
    })
   })

  jQuery('#admin-side-section-buttons nav ul li').click(function(ele){
    let li = jQuery(this);
    let text = li[0].textContent;
    //#98ad8a
    li.css('background-color',"#aa4c50").siblings('li').css('background-color','#ee6e73');
    if(text === "View Poems"){
      jQuery('#admin-main-section-view-poems').css('display','block').siblings('.admin-main-section__section').css('display','none');
    }else if(text === "Add new Poem"){
      jQuery('#admin-main-section-add-poem').css('display','block').siblings('.admin-main-section__section').css('display','none');
    }else if(text === "View Messages"){
      jQuery('#admin-main-section-messages').css('display','block').siblings('.admin-main-section__section').css('display','none');
    }
  })
});
