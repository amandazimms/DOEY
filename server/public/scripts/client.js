$( document ).ready( function(){
  setupClickListeners();
});

function setupClickListeners() {
  $( '#addTaskButton' ).on( 'click', addNewTask );
  $('#outputDiv').on('click', '.check-box', checkBoxToMarkComplete);
}

function checkBoxToMarkComplete(){
//todo - this only marks the box 'checked' - no way to uncheck it and set back to 'incomplete'
  $.ajax({
    method: 'PUT',
    url: '/tasks?id=' + $(this).data('id'), 
    data: 'completed=true'

  }).then(function(response){
    displayAllTasks();

  }).catch(function(err){
    console.log('error updating task complete', err);
    alert(`error updating task complete - see console`);
  });

}

function addNewTask(){
  let taskString =  $( '#taskIn' ).val();

  let taskObj = {
    task: taskString,
    completed: false
  }

  $.ajax({
    method: 'POST',
    url: '/tasks',
    data: taskObj

  }).then( function (response) {
    displayAllTasks();
    $( '#taskIn' ).val();

  }).catch(function ( err ){
    console.log('error sending task to server', err);
    alert(`error sending task to server - see console`);
  });
}

function displayAllTasks(){

  $.ajax({
    method: 'GET',
    url: '/tasks'

  }).then (function(response) {
    let outputArea = $( '#outputDiv' );
    outputArea.empty();

    for(let i=0; i<response.length; i++){
      let stringToAppend = '';
      
      if(response[i].completed) 
        stringToAppend += `<input type='checkbox' checked=checked class='check-box' data-id='${response[i].id}'></input>`;
      else 
        stringToAppend += `<input type='checkbox' class='check-box' data-id='${response[i].id}'></input>`;

      stringToAppend += `<a data-id='${response[i].id}'>${response[i].task}</a><br>`;

      outputArea.append(stringToAppend);
       
        
    }

  }).catch(function(err) {
    console.log('error getting tasks from server:', err);
    alert('error getting tasks from server - see console');
  });
}