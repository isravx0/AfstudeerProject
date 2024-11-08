const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET || '77b22a07938ccbb0565abc929d9ee5726affa3c4b197ea58ed28374d8f42161cadf47f74a95a10099d9c9d72541fbea1f579ba123b68cb9021edf8046ce030c6'; // Use environment variable for the secret key

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'depotproject_backend'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});
// Rate limiting setup
const requestCounts = {};
const rateLimitWindow = 86400000; // 24 hours in milliseconds
const requestLimit = 5;

const rateLimiter = (req, res, next) => {
    const email = req.body.email;
    if (!email) return next();

    const currentTime = Date.now();
    
    // Initialize request tracking for this email if it doesn't exist
    if (!requestCounts[email]) {
        requestCounts[email] = { count: 1, firstRequestTime: currentTime };
    } else {
        // Check if the current time is within the rate limit window
        if (currentTime - requestCounts[email].firstRequestTime < rateLimitWindow) {
            requestCounts[email].count += 1;
            console.log(`Request from ${email}: Count = ${requestCounts[email].count}`);
            
            // If the limit is exceeded, send a 429 response
            if (requestCounts[email].count > requestLimit) {
                return res.status(429).json({ message: 'Too many requests. Please try again later.' });
            }
        } else {
            // Reset the count after the window has expired
            requestCounts[email] = { count: 1, firstRequestTime: currentTime };
        }
    }
    next();
};
// JWT verification middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('No token provided.');
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey); 
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send('Unauthorized: Invalid token');
    }
};

// Register endpoint
app.post('/api/register', (req, res) => {
    const { email, name, password, phoneNumber, location } = req.body;

    // Validate required fields
    if (!email || !name || !password || !phoneNumber || !location) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Add user to the database
    db.query('INSERT INTO users (email, name, password, phoneNumber, location) VALUES (?, ?, ?, ?, ?)', 
        [email, name, hashedPassword, phoneNumber, location], (err, result) => {
            if (err) {
                console.error('Error registering user:', err.code); // Log error code
                console.error('Error message:', err.message); // Log error message
                return res.status(500).send('Error registering user'); // Return error response
            }
            res.status(200).send('User registered successfully');
        }
    );
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];

        // Compare the password
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        // Generate a token
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 }); // 24 hours
        res.status(200).send({ auth: true, token: token });
    });
});

// Attach db to all routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Use external user routes (e.g., /user-info)
app.use('/api', userRoutes);
// Password reset request endpoint with rate limiting
app.post('/api/password-reset', rateLimiter, (req, res) => {
    const { email } = req.body;
    const { token, newPassword } = req.body;
    // Validate that the email is provided
    if (!email) {
        return res.status(400).send('Email is required');
    }

    // Find the user in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database query error (SELECT):', err);
            return res.status(500).send('Server error while querying the database');
        }

        // Check if email exists
        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not registered' });
        }

        const user = results[0];
        const currentTime = new Date();
        const lastPasswordReset = user.lastPasswordReset ? new Date(user.lastPasswordReset) : null;

        // Check if lastPasswordReset exists and if it's within the rate limit window
        const requestsToday = lastPasswordReset && (currentTime - lastPasswordReset < rateLimitWindow) 
            ? 1 : 0;

        // If the user has requested more than the limit, deny the request
        if (requestsToday >= requestLimit) {
            return res.status(429).json({ message: 'You have reached the maximum number of password reset requests. Please try again later.' });
        }

        // Generate the reset token and expiration
        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration

        // Update the database with the token, expiration, and last password reset time
        db.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ?, lastPasswordReset = ? WHERE email = ?', 
            [token, tokenExpiration, currentTime, email], (err) => {
                if (err) {
                    console.error('Error saving token (UPDATE):', err);
                    return res.status(500).send('Error saving token in the database');
                }

                // Nodemailer setup
                const transporter = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    to: user.email,
                    from: 'passwordreset@solarpanelsimulation.com',
                    subject: 'Password Reset Request',
                    text: `Hello ${user.name},\n\n` + 
                          `You are receiving this email because we received a request to reset the password for your account.\n\n` +
                          `To reset your password, please click on the following link or paste it into your browser:\n\n` +
                          `http://localhost:3001/reset/${token}\n\n` +
                          `This link will expire in one hour. If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
                          `Best regards,\n` +
                          `The Solar Panel Simulation Team\n` +
                          `For questions or support, please contact us at solarpanelsimulation@gmail.com\n`,
                    html: `<h2>Password Reset Request</h2>
                           <p>Hello ${user.name},</p>
                           <p>You are receiving this email because we received a request to reset the password for your account.</p>
                           <p>To reset your password, please click on the following link or paste it into your browser:</p>
                           <p><a href="http://localhost:3001/reset/${token}">Reset Password</a></p>
                           <p>This link will expire in one hour. If you did not request this, please ignore this email and your password will remain unchanged.</p>
                           <p>Best regards,<br/>The Solar Panel Simulation Team</p>
                           <p>For questions or support, please contact us at <a href="mailto:solarpanelsimulation@gmail.com">solarpanelsimulation@gmail.com</a></p>`,
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.error('Error sending email:', err);
                        return res.status(500).send('Error sending email');
                    }
                    res.status(200).send('Password reset email sent');
                });
            });
    });
});


// Reset password verification endpoint
app.get('/reset/:token', (req, res) => {
    const token = req.params.token;
    // Find the user by token\
    console.log("test rese")
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
    [token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
        console.log("test rese2")
        res.status(200).send('Token is valid');
    });
});

// Reset password endpoint
app.post('/api/reset-password', (req, res) => {
    console.log('Received request for password reset');  
    const { token, newPassword } = req.body;
    console.log("test " + token)
    // Find the user based on the token
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
    [token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
        }

        const user = results[0];
        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        // Update the password in the database and clear the token
        db.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?', 
        [hashedPassword, user.email], (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error updating password' });
            }
            res.status(200).send({ message: 'Password has been updated successfully' });
        });
    });
});

// Feedback endpoint
app.post('/api/feedback', rateLimiter, (req, res) => {
    const { name, email, comments, rating, category } = req.body;

    // Validation
    if (!name || !email || !comments || !rating || !category) {
        return res.status(400).send('All fields are required');
    }

    // Nodemailer setup for feedback
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        to: process.env.EMAIL_USER, // Replace with the company's email address
        from: 'noreply@solarpanelsimulation.com',
        subject: 'New Feedback Received',
        text: `Feedback received from ${name} (${email}):\n\nCategory: ${category}\nRating: ${rating}\nComments: ${comments}`,
        html: `<h2>New Feedback Received</h2>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Category:</strong> ${category}</p>
               <p><strong>Rating:</strong> ${rating}</p>
               <p><strong>Comments:</strong> ${comments}</p>`
    };

    // Sending the emails
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('Error sending feedback email:', err);
            return res.status(500).send('An error occurred while sending the feedback');
        }
        res.status(200).send('Feedback successfully sent');
    });
});





// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
