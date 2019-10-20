const mongoose = require('mongoose');

mongoose.Promise = Promise;

if (process.env.environment === 'development') {
  mongoose.set('debug', false);
}

mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connetion error : ${err}`);
  process.exit(-1);
});

const initMongoDB = () => {
  mongoose.set('userNewUrlParser', true);
  mongoose.set('userFindAndModify', false);
  mongoose.set('userCreateIndex', true);
  mongoose.set('userUnifiedTopology', true);
  mongoose.connect(process.env.MONGO_URI, {
    keepAlive: 1,
    useCreateIndex: true,
    userNewUrlParser: true,
  });
  console.log(`Connected to MongoDB....`);
  return mongoose.connection;
};

module.exports = {
  initMongoDB,
};
