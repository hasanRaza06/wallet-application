import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db.js';
import { signup, signin } from './controller/auth.js';
import { getAllUsers } from './controller/user.js';
import { userMiddleWare } from './middleware.js';
import { addAccount, getUserAccounts } from './controller/account.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Required for ES module environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Authentication Routes
app.post('/auth/signup', signup);
app.post('/auth/signin', signin);

// User Routes
app.get('/all_users', userMiddleWare, getAllUsers);

// Account Routes
app.post('/user/add_account', userMiddleWare, addAccount);
app.get('/account_details', userMiddleWare, getUserAccounts);

// ✅ Serve Frontend **after** API routes
const frontendPath = path.resolve(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
