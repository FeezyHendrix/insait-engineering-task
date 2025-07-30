import { Server, Socket } from 'socket.io';

const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on('connection', (socket: Socket) => {
    socket.on('message', (data) => {
      io.emit('message', `Server: ${data}`);
    });
  });

  return io;
};  

export default setupSocket;
