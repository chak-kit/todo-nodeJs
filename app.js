const express = require('express');
const app = express();
const port = 3000;
let items = require('./to-do-items');
const bodyParser = require('body-parser');
items = [];
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/to-do-items', (req,res) =>{
  res.status(200).json(items);
});

function saveRegistrationData(req) {
  
  console.log(items)
}

app.post('/to-do-items', (req,res) =>{
  res.status(200).json(req.body);

  saveRegistrationData(req);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

