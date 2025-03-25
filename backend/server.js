import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db.js';
import { signup, signin } from './controller/auth.js';
import { getAllUsers } from './controller/user.js';
import { userMiddleWare } from './middleware.js';
import { addAccount, getUserAccounts } from './controller/account.js';
import path from 'path';
import paymentRoutes from "./payUIntegeration.js";
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";

// Required for ES module environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // ✅ Load environment variables early

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "https://wallet-application-iz8f.onrender.com",
    "https://wallet-application-iglo.onrender.com",
    "https://wallet-application-ial8i6198-hasan-razas-projects.vercel.app",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

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

// Payment Routes
app.use("/api/payment", paymentRoutes);

// ✅ Serve Frontend (Vite uses "dist" instead of "build")
const frontendPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send('Frontend build not found. Run "npm run build" in frontend.');
    }
  });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
