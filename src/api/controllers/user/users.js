const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token and send it as a response
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: token });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET all users
exports.getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error in getAll:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}