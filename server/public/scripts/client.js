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
      
      let prettyTimeStamp = `01.01.1920 12:00 am`
      if(response[i].time_completed) {
        prettyTimeStamp = makePrettyTimeStamp(response[i].time_completed);
        // console.log('SQL timestamp:', response[i].time_completed);
        // console.log('pretty timestamp:', prettyTimeStamp);
      }

      if(response[i].completed) {
        stringToAppend += `<button class="iconButton checkButton checkButtonChecked " data-id='${response[i].id}'>
                            <img class="iconImg" src="./images/checkedBox.png" alt="Un-Complete Task">
                            </img>
                          </button>
                          <a class="taskText taskComplete" data-id='${response[i].id}'>${response[i].task}</a>
                          <a class="timeStampCompleted">finished ${prettyTimeStamp}</a>
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


function makePrettyTimeStamp(timeStampIn) {
  let timeChunkArray = timeStampIn.split(/[- T . :]/);

  let year = timeChunkArray.slice(0, 1)[0];
  let month = timeChunkArray.slice(1, 2)[0];
  let day = timeChunkArray.slice(2, 3)[0];

  let hourUTC = timeChunkArray.slice(3, 4)[0];
  let hourCST = String(hourUTC-5);
  let amPM = hourCST > 12 ? "pm" : "am";
  let hourTwelveHR = hourCST > 12 ? String(hourCST-12) : String(hourCST);
  let min = timeChunkArray.slice(4, 5)[0];
  let sec = timeChunkArray.slice(5, 6)[0];
  
  return `on ${month}.${day}.${year} at ${hourTwelveHR}:${min} ${amPM}`;
  



  // // Create an array with the current month, day and time
  //   let date = [ timeStampIn.getMonth() + 1, timeStampIn.getDate(), timeStampIn.getFullYear() ];
  
  // // Create an array with the current hour, minute and second
  //   let time = [ timeStampIn.getHours(), timeStampIn.getMinutes(), timeStampIn.getSeconds() ];
  
  // // Determine AM or PM suffix based on the hour
  //   let suffix = ( time[0] < 12 ) ? "AM" : "PM";
  
  // // Convert hour from military time
  //   time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
  
  // // If hour is 0, set it to 12
  //   time[0] = time[0] || 12;
  
  // // If seconds and minutes are less than 10, add a zero
  //   for (let i = 1; i < 3; i++ ) 
  //     if ( time[i] < 10 ) 
  //       time[i] = "0" + time[i];

  // // Return the formatted string
  //   return date.join("/") + " " + time.join(":") + " " + suffix;
  }