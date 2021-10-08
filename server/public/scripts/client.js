$( document ).ready( function(){
  displayAllTasks();

  setupClickListeners();
});

function setupClickListeners() {
  $( '#addTaskButton' ).on( 'click', addNewTask );
  $('#outputDiv').on('click', '.checkButtonUnchecked', {param: true}, toggleCheck);
  $('#outputDiv').on('click', '.checkButtonChecked', {param: false}, toggleCheck);
  $('#outputDiv').on('click', '.deleteTaskButton', removeTask);
}

function toggleCheck(_bool){  
  let bool = _bool.data.param;

  let dataToSend = 'completed=false';
  if (bool)
    dataToSend = 'completed=true'; 

    $.ajax({
      method: 'PUT',
      url: '/tasks?id=' + $(this).data('id'), 
      data: dataToSend
  
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
    $( '#taskIn' ).val('');

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
      
      if(response[i].completed) {
        stringToAppend += `<button class="checkButton checkButtonChecked " data-id='${response[i].id}'><img class="checkImg imgChecked" src="./images/checkedBox.png" alt="Checked-Box"></img></button>`;
      }
      else {
        stringToAppend += `<button class="checkButton checkButtonUnchecked" data-id='${response[i].id}'><img class="checkImg imgUnchecked" src="./images/box.png" alt="Unchecked-Box"></img></button>`;
      }
      stringToAppend += `<a data-id='${response[i].id}'>${response[i].task}</a>
                        <button class='deleteTaskButton' data-id='${response[i].id}'>Delete</button>
                        <br>`;

      outputArea.append(stringToAppend);    
    }

  }).catch(function(err) {
    console.log('error getting tasks from server:', err);
    alert('error getting tasks from server - see console');
  });
}

function removeTask(){
  $.ajax({
    method: 'DELETE',
    url: '/tasks?id=' + $(this).data('id'), 

  }).then(function(response){
    displayAllTasks();

  }).catch(function(err){
    console.log('error deleting task', err);
    alert(`error deleting task - see console`);
  });
}