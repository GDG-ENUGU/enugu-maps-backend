const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const Ddos = require('ddos');
const {
	whitelist,
	ddosConfig
} = require('./config');
const routes = require('./api/v1/router');
const error = require('./middlewares/error');

const ddos = new Ddos(ddosConfig);

const corsOptions = {
  exposedHeaders: 'authorization, x-refresh-token, x-token-expiry-time',
  origin: (origin, callback) => {
    if (!whitelist || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const server = express();

server.use(ddos.express);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(helmet());
server.use(cors(corsOptions));
server.use('/api/v1', routes);
server.use(error.converter);
server.use(error.notFound);
server.use(error.handler);

module.exports = server;
