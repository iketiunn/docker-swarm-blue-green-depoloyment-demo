const http = require("http");
const port = process.env.PORT || 3000;
const v = process.env.VERSION || "[Not given]";
/** Every request will hold 5s to response */
const server = http.createServer((_, res) => {
  const startAt = new Date();
  setTimeout(() => {
    res.write(
      `Hello world with version: ${v}. ${startAt.toISOString()} ~ ${new Date().toISOString()}`
    );
    res.end();
  }, 5000);
});
/** When received SIGTERM stop accept new request and exit the process in 30s */
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("SIGTERM");
    setTimeout(() => {
      process.exit(1);
    }, 30000);
  });
});
server.listen(port, () =>
  console.log(`Server with version ${v} start at:`, port)
);
