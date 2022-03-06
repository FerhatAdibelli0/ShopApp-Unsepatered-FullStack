const fs = require("fs");

const requestHandler = (req, res) => {
  const method = req.method;
  if (req.url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send Input</button></input></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (req.url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first Server</title></head>");
  res.write("<body><h1>This is really great for me </h1></body>");
  res.write("</html>");
  res.end();
};

//module.exports = requestHandler;

module.exports = {
  handler: requestHandler,
  text: "handler test text",
};

// module.exports.handler = requestHandler;
// module.exports.text = "handler test text";

// exports.handler = requestHandler;
// exports.text = "handler test text";
