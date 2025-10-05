const http = require("http");
const next = require("next");

const port = parseInt(process.env.PORT ?? "8080", 10);
const hostname = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      handle(req, res).catch((error) => {
        console.error("Request handling failed", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    });

    server.listen(port, hostname, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
