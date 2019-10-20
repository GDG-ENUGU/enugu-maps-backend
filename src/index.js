const server = require('./server');
const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT;
const ENV = process.env.ENVIRONMENT;

db.initMongoDB();

server.listen(PORT, () => {
  console.info(`Server started on port ${PORT} => (${ENV})`);
});
