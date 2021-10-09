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
  //function that runs when a task's checkbox is toggled - either on or off.
  //it updates the completed property of the task in serverside

  let isComplete = _isComplete.data.param; //data.param is some fanciness to allow us to use a function with parameters in the onReady

  //note - this project is fully ready to accept and send objects with
  //multiple properties to server and then db!
  //tragically it was not required here, as we are timestamping
  //in server, when creating the querystring
  let objectToSend = {
    completed: isComplete
    //in the future - add more properties to update here!
  }

    $.ajax({ //hey ajax, PUT (update/change) this object into the server.
      method: 'PUT',
      url: '/tasks?id=' + $(this).data('id'), 
      data: objectToSend
  
    }).then(function(response){
      displayAllTasks(); //after making any change, we want to refresh the DOM
  
    }).catch(function(err){
      console.log('error updating task complete', err);
      alert(`error updating task complete - see console`);
    });
  }


function addNewTask(){
  //function that captures user input (a task string) and adds it to our 
  //db of tasks.

  let taskString =  $( '#taskIn' ).val(); //get the string

  let taskObj = { //save it as a task
    task: taskString,
    completed: false, //by default, no to do item is complete right when you think of it :)
  }

  $.ajax({ //hey ajax, POST (add/create) this object into our server
    method: 'POST',
    url: '/tasks',
    data: taskObj

  }).then( function (response) {
    displayAllTasks(); //after making any change, we want to refresh the DOM
    $( '#taskIn' ).val(''); //clear out the input field so next task can be more easily entered

  }).catch(function ( err ){
    console.log('error sending task to server', err);
    alert(`error sending task to server - see console`);
  });
}

function displayAllTasks(){
  //function that gets all tasks from the database and displays them on the DOM

  $.ajax({ //hey ajax, GET (fetch/find and capture) all the tasks from the db
    method: 'GET',
    url: '/tasks'

  }).then (function(response) { 
    let outputArea = $( '#outputDiv' ); //target area where we want the tasks to appear
    outputArea.empty(); //empty it out, so we don't have duplicates

    for(let i=0; i<response.length; i++){ //for however many tasks we got back from the db...
      //APPEND STRING STEP 1: create the outer div - all tasks will have this
      let stringToAppend = '<div class="task">';
      
      let prettyTimeStamp; //initialize this to hold our more human readable timestamp
      if(response[i].time_completed)  //only run the function if there is a time_completed (so not for brand new tasks)
        prettyTimeStamp = makePrettyTimeStamp(response[i].time_completed); 

      //APPEND STRING STEP 2a: IF the task is a completed one, use the checked icon image, tag its classes as such, and add a timestamp to show when it was finished
      if(response[i].completed) {
        stringToAppend += `<button class="iconButton checkButton checkButtonChecked " data-id='${response[i].id}'>
                            <img class="iconImg" src="./images/checkedBox.png" alt="Un-Complete Task">
                            </img>
                          </button>
                          <a class="taskText taskComplete" data-id='${response[i].id}'>${response[i].task}</a>
                          <a class="timeStampCompleted">finished ${prettyTimeStamp}</a>
                          `;
      }
      //APPEND STRING STEP 2b: ELSE, use the unchecked image, and add appropriate classes, and don't show a completed date (since it's not yet complete)
      else {
        stringToAppend += `<button class="iconButton checkButton checkButtonUnchecked" data-id='${response[i].id}'>
                              <img class="iconImg" src="./images/box.png" alt="Complete Task">
                              </img>
                          </button>
                          <a class="taskText" data-id='${response[i].id}'>${response[i].task}</a>`;
      }

      //APPEND STRING STEP 3: in any case, add a delete button, and close out the div for this task
      stringToAppend += `<button class="iconButton deleteButton" data-id='${response[i].id}'><img class="iconImg" src="./images/trash.png" alt="Delete Task"></img></button>
                        <br></div>`;

      //APPEND STRING STEP 4:, finally, apppend our string we've been building for the last 3 steps!                 
      outputArea.append(stringToAppend);    
    }

  }).catch(function(err) {
    console.log('error getting tasks from server:', err);
    alert('error getting tasks from server - see console');
  });
}

function removeTask(){
  //function that removes a task from the database
  //runs when a delete icon next to any specific task is clicked

  Swal.fire({ //SweetAlert2 popup that asks us to confirm first
    text: 'Are you sure you want to remove this task?',
    icon: 'question',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonText: 'No'

  }).then((result)=>{ //after the popup is closed or marked yes/no
    if (result.isConfirmed){ //if we clicked yes, do the following

      $.ajax({ //hey ajax, DELETE (remove)...
        method: 'DELETE',
        url: '/tasks?id=' + $(this).data('id'),  //THIS specific item, which we find by its data id, from our database
    
      }).then(function(response){
        displayAllTasks();//after making any update, refresh the DOM
    
      }).catch(function(err){
        console.log('error deleting task', err);
        alert(`error deleting task - see console`);
      })
    }
  }) 
}


function makePrettyTimeStamp(timeStampIn) {
  //function that takes in a timetamp formatted via postgres's "now()"
  //splits it into meaningful chunks, and reassembles them in a more user friendly way
  //also formats specifically for CST, in MM/DD/YYYY, 12hr format
  let timeChunkArray = timeStampIn.split(/[- T . :]/); //split the string so that each 'unit' of time is its own item in an array

  let year = timeChunkArray.slice(0, 1)[0];
  let month = timeChunkArray.slice(1, 2)[0];
  let day = timeChunkArray.slice(2, 3)[0];

  let hourUTC = timeChunkArray.slice(3, 4)[0]; //it's already stored as utc
  let hourCST = String(hourUTC-5); //to get CST, subtract 5, and be sure to store as a string so no unintended math is performed after this
  let amPM = hourCST > 12 ? "pm" : "am"; //in military time, > 12 means PM
  let hourTwelveHR = hourCST > 12 ? String(hourCST-12) : String(hourCST); //convert to 12hr time
  let min = timeChunkArray.slice(4, 5)[0]; 
  //note - I chose not to display seconds for this project
  
  return `on ${month}.${day}.${year} at ${hourTwelveHR}:${min} ${amPM}`;
}