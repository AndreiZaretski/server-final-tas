const express = require('express');
const mongoose = require('mongoose');
const router = require('./router');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors())
app.use('/auth', router);

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://Admin:final-task@cluster0.ic1uua6.mongodb.net/?retryWrites=true&w=majority')
    app.listen(PORT, ()=> console.log(`sServer started on port ${PORT}`))
  } catch (e) {
    console.error(e);
  }
}

start();