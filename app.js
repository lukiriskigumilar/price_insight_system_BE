import express from 'express';
import routes from './src/routes/routes.js';
import dotenv from 'dotenv';
import errorMiddleware from './src/middleware/error.middleware.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
