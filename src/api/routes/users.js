const express = require('express');
const User = require('../../models/user');
const usersController = require('../controllers/user/users');
const router = express.Router();

// CREATE a new user
router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send({ user });
    } catch (error) {
        console.error("Error while saving user:", error);  // <-- Log the error
        res.status(400).send({ error: 'Failed to create user.' });
    }
});

router.post('/login', usersController.login);

// RETRIEVE all users
router.get('/', usersController.getAll);

// RETRIEVE a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send();
        res.json(user);
    } catch (error) {
        res.status(500).send();
    }
});

// UPDATE a user by ID
router.patch('/:id', async (req, res) => {
    // Ensure that no invalid fields are updated
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];  // Adjust as needed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).send();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send();
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
