require('dotenv').config();
const server = require('./server');
const db = require('./db');
const {createAdmin} = require('./bootstrap');
const PORT = process.env.PORT;
const ENV = process.env.ENVIRONMENT;

db.initMongoDB();
createAdmin();

server.listen(PORT, () => {
  console.info(`Server started on port ${PORT} => (${ENV})`);
});
