jQuery('document').ready(function(){

   let socket = io();

   //messageHandeler([0,'hello world',jQuery('#table-body-poems')],true);

  console.log("Boom!!");

  //Function call for the materialize css framework

   let inputButton = jQuery('#poem-submit-button');//
   let form = jQuery('#new-poem-form');

   let tableId = jQuery('#table-body-poems');
   let c = 0;
   socket.on('poemsLoad',function(poem){
     if(poem.length !== jQuery('#admin-poems-table tbody tr').length){
        c++;
       let tr =jQuery(`
         <tr>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.name}</p></div></th>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.poem}</th>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.categories}</p></div></th>
         <th><div class="admin-main-section-table-body-divs"><p>${poem.active}</p></div></th>
         <th><div class="admin-main-section-table-body-divs"><button id='${poem._id}' class="enter-edit-poem">Edit</button></div></th>
         </tr>`);
         jQuery('#table-body-poems').append(tr);


        if(c === poem.length){
          jQuery('#admin-poems-table').after('<div id="table-container"></div>');
          let VisibleRow = 6;
          let totalRows = jQuery('#admin-poems-table tbody tr').length;
          let pageAmount = totalRows/VisibleRow;
          console.log('This is the amount of rows: ', totalRows);
          for(i=0;i<pageAmount;i++){
            let pageNum = i + 1;
            jQuery('#table-container').append(`<a class="page-nav-sel" style="
            padding:2px" href="#" rel=${i}>${pageNum}</a>`);
          };
          jQuery('#admin-poems-table tbody tr').hide();
          jQuery('#admin-poems-table tbody tr').slice(0,VisibleRow).show();
          jQuery('#table-container a:first').addClass('active');
          jQuery('#table-container a').bind('click',function(){
            jQuery('#table-container a').removeClass('active');
            jQuery(this).addClass('active');
            let currentPage = jQuery(this).attr('rel');
            let startItem = currentPage * VisibleRow;
            let endItem = startItem + VisibleRow;
            $('#admin-poems-table tbody tr').css('opacity','0.0').hide().slice(startItem,endItem).css('display','table-row').animate({opacity:1},300);
          })
        }
      }//ends if statment checking poem.length and tr.lenght
   });

   jQuery('#table-body-poems').on('click','button.enter-edit-poem',function(){
     socket.emit('IncomingForEditPoem',{
       _id:jQuery(this).attr('id')
     },function(poem){
     })
   });


   socket.on('editPoem',function(poem){
     jQuery('#edit-poem-form').empty();
     let check;
     let checkText;
     if(poem.active){
       check = 'checked="checked"';
       checkText = 'Make Inactive';
     }else{
       check = '';
       checkText = 'Make Active';
     }
     let formInput = `<input autofocus type="text" value="${poem.name}"/><p>
       <input name="is-active"${check}  type="checkbox" id="test5" /><label for="test5">${checkText}</label></p>
       <textarea id="textarea1" class="materialize-textarea" name="poem">${poem.poem}</textarea>
       <img class="responsive-img" src='/images/poem-images/${poem.image}'/>
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
   })

   form.on('submit',function(e){
     //e.preventDefault();
    console.log('This is this @@this:: ',jQuery('[name=image-upload]'));
     inputButton.attr('disabled','disabled').text('Submitting Poem...');
     let title = jQuery('[name=title]'),
        poem = jQuery('[name=poem]'),
        cat = jQuery('[name=category-select]'),
        image = jQuery('[name=image-upload]')[0].files[0].name;
        active = jQuery('[name=is-active]');
    socket.emit('newPoemIncoming',{
      title: title.val(),
      poem: poem.val(),
      cat: jQuery(`#${cat.attr('id')} option:selected`).attr('id'),
      active: active.is(':checked'),
      image
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
