import express, { Express, Request, Response } from 'express';
const app: Express = express();
const port = process.env.PORT || 5000;
import cors from 'cors';
import { Server } from 'socket.io';
import webRoutes from './modules/common/routes/web';
import http from 'http';
import connectionDB from './modules/common/config/db';

connectionDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

interface User {
  id: string;
  username: string;
}

const users: Record<string, User> = {};
const messages: any[] = [];

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Enable CORS for http://localhost:3000

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable set cookie with CORS
  }),
);

// routes
app.use('/', webRoutes); // No prefix for web routes

const updateUsers = () => {
  const usernames = Object.values(users).map((user) => user.username);
  io.emit('update_users', usernames);
};

io.on('connection', (socket) => {
  // Handle new user registration
  socket.on('register', (username: string) => {
    users[username] = { id: socket.id, username }; // Store user by socket.id
    console.log(`User registered: ${username} with ID: ${socket.id}`);
    updateUsers();
  });

  socket.on('private_message', ({ recipientUsername, message }) => {
    const recipientId = users[recipientUsername]?.id;
    console.log('users', users);
    if (recipientId) {
      const recipientSocket = io.sockets.sockets.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit('private_message', {
          message,
          senderUsername: 'fatima', // Use username instead of socket.id
        });
        console.log(`Message from fatima to ${recipientUsername}: ${message}`);
      } else {
        console.log(`Recipient socket ${recipientUsername} not found`);
      }
    } else {
      console.log(`Recipient ${recipientUsername} not found`);
    }
  });

  // Handle public messages
  socket.on('message', (data) => {
    messages.push(data);
    console.log('data', data);
    io.emit('message', data);
  });

  // Handle typing notification
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
    if (users[socket.id]) {
      console.log(`User ${users[socket.id].username} disconnected`);
      delete users[socket.id]; // Remove user from users object
      updateUsers();
    }
  });
});

// Add default route
app.all('*', (_req: Request, res: Response) => {
  return res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response) => {
  console.error(err);
  res.status(500).send({ message: 'Something went wrong!' });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
