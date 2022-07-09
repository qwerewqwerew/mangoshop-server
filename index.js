
var http = require("http");
var hostname = "127.0.0.1";
var port = 3000;
/* req 요청, res 응답 */
const server = http.createServer(function (req, res) {
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      const products = JSON.stringify([
        {
          name: "배변패드",
          price: 50000,
        },
      ]);
      res.end(products);
    } else if (method === "POST") {
      res.end("생성되었습니다!");
    }
  }
  res.end("Good Bye");
});

server.listen(port, hostname);

console.log("mangoshop server on!");