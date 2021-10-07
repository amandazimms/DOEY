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
  
}