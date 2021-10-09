$( document ).ready( function(){
  displayAllTasks();

  setupClickListeners();
});

function setupClickListeners() {
  $( '#addTaskButton' ).on( 'click', addNewTask );
  $('#outputDiv').on('click', '.checkButtonUnchecked', {param: true}, toggleCheck);
  $('#outputDiv').on('click', '.checkButtonChecked', {param: false}, toggleCheck);
  $('#outputDiv').on('click', '.deleteButton', removeTask);
}

function toggleCheck(_isComplete){  
  let isComplete = _isComplete.data.param;

  //note - this project is fully ready to accept and send objects with
  //multiple properties to server and then db!
  //tragically it was not required here, as we are timestamping
  //in server, when creating the querystring
  let objectToSend = {
    completed: isComplete
    //in the future - add more properties to update here!
  }

    $.ajax({
      method: 'PUT',
      url: '/tasks?id=' + $(this).data('id'), 
      data: objectToSend
  
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
    completed: false,
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
      let stringToAppend = '<div class="task">';
      
      if(response[i].completed) {
        stringToAppend += `<button class="iconButton checkButton checkButtonChecked " data-id='${response[i].id}'>
                            <img class="iconImg" src="./images/checkedBox.png" alt="Un-Complete Task">
                            </img>
                          </button>
                          <a class="taskText taskComplete" data-id='${response[i].id}'>${response[i].task}</a>
                          <a class="timeStamp">${response[i].time_completed}</a>
                          `;
      }
      else {
        stringToAppend += `<button class="iconButton checkButton checkButtonUnchecked" data-id='${response[i].id}'>
                              <img class="iconImg" src="./images/box.png" alt="Complete Task">
                              </img>
                          </button>
                          <a class="taskText" data-id='${response[i].id}'>${response[i].task}</a>`;
      }
      stringToAppend += `<button class="iconButton deleteButton" data-id='${response[i].id}'><img class="iconImg" src="./images/trash.png" alt="Delete Task"></img></button>
                        <br></div>`;

      outputArea.append(stringToAppend);    
    }

  }).catch(function(err) {
    console.log('error getting tasks from server:', err);
    alert('error getting tasks from server - see console');
  });
}

function removeTask(){


  Swal.fire({
    text: 'Are you sure you want to remove this task?',
    icon: 'question',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonText: 'No'
  }).then((result)=>{
    if (result.isConfirmed){
      $.ajax({
        method: 'DELETE',
        url: '/tasks?id=' + $(this).data('id'), 
    
      }).then(function(response){
        displayAllTasks();
    
      }).catch(function(err){
        console.log('error deleting task', err);
        alert(`error deleting task - see console`);
      })
    }
  })


 
}