import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import Food from './models/Food.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const ensureDefaultAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@restaurant.com' });
    if (existingAdmin) return;
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@restaurant.com', password: hashedPassword, role: 'admin' });
    console.log('Default admin user ready');
  } catch (error) {
    console.error('Admin seed error:', error);
  }
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.get('/', (_req, res) => {
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  if (_req.accepts('html')) {
    return res.redirect(frontendUrl);
  }
  return res.json({ message: 'Restaurant QR Ordering API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/coupons', couponRoutes);

io.on('connection', (socket) => {
  socket.on('join-room', (room) => socket.join(room));
  socket.on('new-order', (order) => io.emit('order-update', order));
  socket.on('status-update', (payload) => io.to(payload.room).emit('status-update', payload));
});

const PORT = process.env.PORT || 5000;

console.log('Connecting to MongoDB at:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  })
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    const count = await Food.countDocuments();
    console.log(`Found ${count} food items in database`);
    if (count === 0) {
      console.log('Seeding initial menu items...');
      await Food.insertMany([
        { name: 'Smoked Truffle Pizza', description: 'Wood-fired crust with truffle cream and mushrooms', category: 'Pizza', price: 480, rating: 4.8, preparationTime: 20, veg: true, available: true },
        { name: 'Classic Chicken Burger', description: 'Grilled chicken patty with cheddar and slaw', category: 'Burger', price: 320, rating: 4.5, preparationTime: 15, veg: false, available: true },
        { name: 'Kung Pao Noodles', description: 'Wok-tossed noodles with crisp vegetables and peanuts', category: 'Chinese', price: 290, rating: 4.6, preparationTime: 18, veg: true, available: true },
        { name: 'Paneer Butter Masala', description: 'Creamy tomato-based curry with soft paneer cubes', category: 'Indian', price: 260, rating: 4.7, preparationTime: 20, veg: true, available: true },
        { name: 'Chocolate Lava Cake', description: 'Warm dessert with molten chocolate core', category: 'Desserts', price: 220, rating: 4.9, preparationTime: 10, veg: true, available: true },
        { name: 'Mango Smoothie', description: 'Fresh mango blend with a hint of cardamom', category: 'Drinks', price: 180, rating: 4.4, preparationTime: 8, veg: true, available: true },
        { name: 'Loaded Fries', description: 'Golden fries topped with cheese and herbs', category: 'Fast Food', price: 190, rating: 4.3, preparationTime: 12, veg: true, available: true }
      ]);
      console.log('✅ Menu items seeded successfully');
    }
    await ensureDefaultAdminUser();
    httpServer.listen(PORT, () => console.log(`\n✅ Server running on http://localhost:${PORT}\n`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

export { io };
