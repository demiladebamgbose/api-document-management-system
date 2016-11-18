'use stict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

require('./server/routes/user-route')(app);
require('./server/routes/role-route')(app);
require('./server/routes/document-route')(app);

app.get('/', (req, res) => {
  res.json({
    message: 'root route'
  });
});

app.listen(port, () => {
  console.log ('app started on port' + port);
});

module.exports = app;
