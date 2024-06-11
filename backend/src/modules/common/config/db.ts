const mongoose = require('mongoose');

const mongoDB = process.env.DB_URL || 'mongodb://localhost:27017/jwt-aut';

const connectionDB = async () => {
  try {
    mongoose.connect(mongoDB, {});
    console.log('mongoDB', mongoDB);
    console.log('mongodb connection established');
  } catch (error) {
    console.log('Error in DB connection: ' + error);
    process.exit(1);
  }
};

export default connectionDB;
