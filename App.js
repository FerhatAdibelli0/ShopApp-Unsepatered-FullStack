const routes = require("./routes");
const http = require("http");

const server = http.createServer(routes.handler);
console.log(routes.text);

server.listen(3000);
