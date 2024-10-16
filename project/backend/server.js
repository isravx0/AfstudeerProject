const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'backend_database'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

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
                console.error('Error registering user:', err.code);
                console.error('Error message:', err.message);
                return res.status(500).send('Error registering user');
            }
            res.status(200).send('User  registered successfully');
        }
    );
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req .body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];

        // Compare password
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        // Generate a token
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: 86400 }); // 24 hours
        res.status(200).send({ auth: true, token: token });
    });
});

// Password reset endpoint
app.post('/api/password-reset', (req, res) => {
    const { email } = req.body;

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
            return res.status(404).send('Email not found');
        }

        const user = results[0];
        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = new Date(Date.now() + 7200000);

        console.log(`Generated Token: ${token}, Expiration: ${tokenExpiration.toISOString()}`);

        // Save the token and expiration date in the database
        db.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?', 
            [token, tokenExpiration, email], (err) => {
                if (err) {
                    console.error('Error saving token (UPDATE):', err);
                    return res.status(500).send('Error saving token in the database');
                }

                // Nodemailer setup
                const transporter = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                        user: 'solarpanelsimulation@gmail.com',
                        pass: 'zgyi dlqa zmgn gkdd',
                    },
                });

                const mailOptions = {
                    to: user.email,
                    from: 'passwordreset@solarpanelsimulation.com',
                    subject: 'Password Reset Request',
                    text: `Hello ${user.name},\n\n` + 
                          `You are receiving this email because we received a request to reset the password for your account.\n\n` +
                          `To reset your password, please click on the following link or paste it into your browser:\n\n` +
                          `http://localhost:3000/reset/${token}\n\n` +
                          `This link will expire in one hour. If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
                          `Best regards,\n` +
                          `The Solar Panel Simulation Team\n` +
                          `For questions or support, please contact us at solarpanelsimulation@gmail.com\n`,
                    html: `<h2>Password Reset Request</h2>
                           <p>Hello ${user.name},</p>
                           <p>You are receiving this email because we received a request to reset the password for your account.</p>
                           <p>To reset your password, please click on the following link or paste it into your browser:</p>
                           <p><a href="http://localhost:3000/reset/${token}">Reset Password</a></p>
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

    // Find the user by token
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
    [token, Date.now()], (err, results) => {
        if (err || results.length === 0 ) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        res.status(200).send('Token is valid');
    });
});

app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    console.log('Received token:', token);
    console.log('Received new password:', newPassword);

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});