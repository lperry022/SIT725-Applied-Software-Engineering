const { Server } = require("socket.io");


function createSocketLayer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" }, 
    connectionStateRecovery: true
  });

  const fx = io.of("/forensix");

  io.on("connection", (socket) => {
  
    const timer = setInterval(() => {
      socket.emit("number", Math.floor(Math.random() * 10));
    }, 1000);

    socket.on("disconnect", () => clearInterval(timer));
  });

  return { io };
}

module.exports = { createSocketLayer };
