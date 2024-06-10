import express, { Express, Request, Response } from "express";
const app: Express = express();
const port = process.env.PORT || 5000;
import cors from 'cors';

import webRoutes from './modules/common/routes/web';

// middleware
// Enable CORS for http://localhost:3000
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // enable set cookie with CORS
  })
)

// routes
app.use('/', webRoutes) // No prefix for web routes

// add default route
app.all('*', (_req: Request, res: Response) => {
  return res.status(404).json({ message: 'Route not found' })
})

// Error handling middleware
app.use((err: any, _req: Request, res: Response) => {
  console.error(err)
  res.status(500).send({ message: 'Something went wrong!' })
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
