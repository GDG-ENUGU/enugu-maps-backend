const server = require('./server');
const {
  port, env
} = require('./config');


server.listen(port, () => {
  console.info(`Server started on port ${port} (${env})`);
});
