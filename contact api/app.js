import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { User } from "./Models/User.js";
import { Contact } from "./Models/Contact.js";

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI,{
    dbName:"contact-api"
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// ----------------- ROUTES -----------------

// Home / Register page
app.get('/', (req, res) => {
    res.render('index', { error: null, success: null, name: '', email: '' });
});

// Register submit
app.post('/submit', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.render('index', { error: "All fields are required!", success: null, name, email });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('index', { error: "User already exists!", success: null, name, email });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPassword });
    res.render('login', { success: "Account created successfully!", error: null, email: '' });
});

// Login page
app.get('/login', (req, res) => {
    res.render('login', { error: null, success: null, email: '' });
});

// Login submit
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: "All fields are required", success: null, email });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.render('login', { error: "User not found", success: null, email });
    }
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('login', { error: "Password incorrect", success: null, email });
    }

    // On successful login, render portfolio page
    res.render('portfolio', { name: user.name, email: user.email, success: null, error: null });
});

// Contact form submit
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.render('portfolio', { error: "All fields are required", success: null, name, email });
    }

    await Contact.create({ name, email, message });
    res.render('portfolio', { success: "Message sent successfully!", error: null, name, email });
});

// Admin route to view all messages
app.get('/messages', async (req, res) => {
    const messages = await Contact.find().sort({ date: -1 });
    res.render('messages', { messages });
});

// Server start
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
