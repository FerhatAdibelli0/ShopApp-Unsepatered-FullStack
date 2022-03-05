const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    //res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send Input</button></input></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first Server</title></head>");
  res.write("<body><h1>This is really great for me </h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
