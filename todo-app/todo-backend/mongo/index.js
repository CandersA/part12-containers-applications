const mongoose = require('mongoose')
const Todo = require('./models/Todo')
const { MONGO_URL } = require('../util/config')

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully!');
  })
  .catch(() => {
    console.log("Bad connection!");
  });
} else {
  console.log("Didn't attempt connection!");
}


module.exports = {
  Todo
}
