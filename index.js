const express = require('express');
const mongoose = require('mongoose');
const router = require('./router/router');
const cors = require('cors');
const { MONGODB } = require('./config');
const PORT = process.env.PORT || 5000;



const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', router);
mongoose.set('strictQuery', false);

const start = async () => {
  try {
    await mongoose.connect(MONGODB);
    app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.error(e);
  }
}

start();