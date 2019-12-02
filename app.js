const express = require('express');
const app = express();
const port = 3000;
let items = require('./to-do-items');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');
const helmet = require("helmet");
const schema = require('./schemas');
const middleware = require('./middleware');

app.use(helmet());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('', (req, res, next) => {
  if (req.headers.authorization === '12345') {
    console.log('Auth Success');
    next();
  } else {
    console.log('Auth Failed');
    next({status: 403, error: 'Error Auth'});
  }
});

let itemsArray = [];
itemsArray = items;

app.get('/to-do-items', (req, res, next) => {
  res.status(200).json(items);
  // if(error) return next(res.status)
});

app.post('/to-do-items', middleware(schema), (req, res, next) => {
  if (req.body.length === 0) return next('body is empty');
  req.body.id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
  itemsArray.push(req.body);
  saveRegistrationData();
  res.status(200).json(req.body);
});

app.delete('/to-do-items/:id', (req, res, next) => {
  const id = req.params.id;
  _.remove(itemsArray, function (val) {
    return val.id === id
  });
  saveRegistrationData();
  res.status(204).send();

});

app.patch('/to-do-items/:id', (req, res, next) => {
  const id = req.params.id;

  let findArray = _.filter(itemsArray, function (val) {
    return val.id === id;
  });
  if(findArray[0] === undefined) return res.status(404).json('404, unknown page');

  findArray[0].done = req.body.done;
  saveRegistrationData();
  res.status(200).json(findArray[0]);
});

function saveRegistrationData() {
  fs.writeFile('to-do-items.json', JSON.stringify(itemsArray), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  })
}

// error handler
app.use((err, req, res, next) => {
  console.log('From Error Handler:', err);
  res.status(err.status || 500).json(err);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

