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
  console.log('/post hit! req.query is:', req.query);

  const queryString= ``;
  let values = [];

  pool.query(queryString, values).then((results)=>{
    res.sendStatus(201);
    
  }).catch((err)=>{
    console.log('error posting task:', err);
    res.sendStatus(500);
  })
})