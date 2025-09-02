require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { createSocketLayer } = require("./socket");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/forensix";

async function start() {
  await mongoose.connect(MONGO_URI);
  const server = http.createServer(app);
  const { io } = createSocketLayer(server);
  server.listen(PORT, () => {
    console.log(`ForensiX http://localhost:${PORT}`);
  });

  // make graceful shutdown testable
  return { server, io, stop: async () => {
    await io.close();
    await new Promise(r => server.close(() => r()));
    await mongoose.disconnect();
  }};
}

if (require.main === module) {
  start().catch(err => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
}

module.exports = { start };
