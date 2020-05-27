const http = require('http');
const port = 8080;
const serverHandle = require('../app');

const server = http.createServer(serverHandle).listen(port);