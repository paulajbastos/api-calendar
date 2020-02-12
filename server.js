require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import routes from './routes/api';

const ENV = process.env.NODE_ENV;


//setup port
const port = process.env.PORT || 3000;

//setup express app
const app = express();

mongoose.Promise = global.Promise;

// connect to mongoDb
if (ENV === 'development') {
  mongoose.connect('mongodb://localhost/calendargo', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
} else {
  mongoose.connect('mongodb://localhost/calendargo', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
}

// serve static files middleware - para um frontend
// app.use(express.static('public'));

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// JSON.stringify(

// handling Access-Control-Allow-Origin problems
app.use(( req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
  // if(req.method === 'OPTIONS') {
  //   res.header('Access-Control-Allow-Methods', 'POST, GET');
  //   return res.status(200).json({});
  // }
});

// initialize routes
app.use('/api', routes);


// error handling middleware
app.use((err, req, res, next) => {
  console.log('err', err);
  res.status(422).send({error: err.message})
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
});
