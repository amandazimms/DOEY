console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  setupClickListeners();
});

function setupClickListeners() {
  $( '#addTaskButton' ).on( 'click', addNewTask );
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
    postAllTasks();
    $( '#taskIn' ).val();

  }).catch(function ( err ){
    alert(`error adding task`);
    console.log(err);
  });
}

function postAllTasks(){
  console.log('posting all tasks');
}