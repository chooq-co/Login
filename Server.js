// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loginDB', { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', UserSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.redirect('/dashboard');
        } else {
            res.render('error', { message: "Invalid email or password." });
        }
    } catch (err) {
        console.error(err);
        res.render('error', { message: "An error occurred." });
    }
});

// Dashboard route
app.get('/dashboard', async (req, res) => {
    try {
        const users = await User.find();
        res.render('dashboard', { users: users });
    } catch (err) {
        console.error(err);
        res.render('error', { message: "An error occurred." });
    }
});

// Serve static files
app.use(express.static('public'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
