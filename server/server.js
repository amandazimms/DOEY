const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pool = require('./modules/pool');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Start listening for requests on a specific port
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});

//ROUTES

//POST
app.post('/tasks', (req, res) => {
  console.log('/tasks post hit! req.body is:', req.body);

  let queryString= `INSERT INTO tasks (task, completed) VALUES ($1, $2)`; //$1, etc sanitizes data
  let values = [req.body.task, req.body.completed];

  pool.query(queryString, values).then((results)=>{
    res.sendStatus(201);

  }).catch((err)=>{
    console.log('error posting task:', err);
    res.sendStatus(500);
  })
});

//GET
app.get('/tasks', (req, res) => {
  console.log('/tasks get hit!');

  const queryString = `SELECT * FROM tasks ORDER BY id`;

  pool.query(queryString).then( (results) => {
    res.send(results.rows);

  }).catch( (err) => {
    console.log('error getting tasks from database:', err);
    res.sendStatus(500);
  })
});

//PUT
app.put('/tasks', (req,res) => {
  console.log( '/tasks put hit:', req.query );
  console.log( '******** req.query is', req.query );
  console.log( '******** req.query.id is', req.query.id );

  
  //QS STEP 1: begin the query string the same each time.
  let queryString = `UPDATE tasks SET `

  //QS STEP 2: += as many additional properties into the query string as you want to update 
  //(as many properties as your req.body object has in it)
  let keys = Object.keys(req.body); //simplify naming here - keys is the array of keys
  for(let i=0; i<keys.length; i++){ //iterate through the keys
    
    let key = `${keys[i]}` //this gets, for example, 'completed' from client PUT's data
    let val = `${req.body[key]}` //this gets, for example, 'true' from client PUT's data
    
    queryString += `${key}=${val}` //add it onto the query string
  
    if (i !== keys.length -1) //we only want to add a comma if there will be another..
      queryString += `,`; //..property to update after this one
    
      queryString += ` `; //add a space regardless
  }

  //QS STEP 3: += the timestamp onto the queryString
  //todo - this is not modular or really correct - 
  //if we had a way to update another aspect of the task, it would also update
  //the completed_time to now, which we wouldn't want. As is there is only one thing to
  //update so it's ok for the scope of this project IMHO.
  queryString += `, time_completed=now() `;

  //QS STEP 4: += the end, where we target which row in the db we're updating
  queryString += `WHERE id = '${req.query.id}';`;

  pool.query(queryString).then( (results) => {
    res.sendStatus(200);
    
  }).catch( (err) =>{
    console.log('error updating task in database:', err);
    res.sendStatus(500);

  })
})

//DELETE
app.delete('/tasks', (req,res)=> {
  console.log('/tasks delete hit:', req.query);
  const queryString = `DELETE FROM tasks WHERE id='${req.query.id}';`;

  pool.query(queryString).then((results)=>{
    res.sendStatus(200);
  }).catch((err)=>{
    console.log('error deleting task from database:', err);
    res.sendStatus(500);
  })
})