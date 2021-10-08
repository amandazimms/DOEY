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

  const queryString= `INSERT INTO tasks (task, completed) VALUES ($1, $2)`;
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

  let key = `${Object.keys(req.body)[0]}` //this gets, for example, 'completed' from client PUT's data
  let val = `${req.body[key]}` //this gets, for example, 'true' from client PUT's data

  const queryString =   `UPDATE tasks SET ${key}=${val}
                        WHERE id = '${req.query.id}';`;

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