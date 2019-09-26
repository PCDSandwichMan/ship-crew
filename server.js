/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const db = mongoose.connection;
const config = require('./util/config');

app.use(express.static('./client'));
// - Server Config
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: false }));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(cors());

// - Route Imports
const userRoute = require('./api/routes/userRoute');
const dataRoute = require('./api/routes/dataRoute');

// - DB Connection
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

db.on('error', err => console.log(err));
db.once('open', () => {
  // - Route Assign
  app.use('/', dataRoute);
  app.use('/', userRoute);
  // * handles 404
  app.use((req, res, next) => {
    res.status(404);

    // respond with json
    if (req.accepts('json')) {
      res.send({ error404: 'invalid call to API' });
    }
    next();
  });

  // ! Heroku Stuff
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

  // - Server Connection
  app.listen(config.PORT, () =>
    console.log(`Server is connected on port ${config.PORT}`)
  );
});
