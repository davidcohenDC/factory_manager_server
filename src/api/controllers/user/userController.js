const { userService, authenticationService } = require('@services/');
const { logWithSource } = require('@config/');
const logger = logWithSource('UserController');

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       description: User's information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSchema'
 *     responses:
 *       "201":
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSchema'
 */

const createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        if (result.success) {
            logger.info('User created successfully', { userId: result.data._id });
            res.status(201).json(result.data);
        } else {
            logger.warn('Validation error during user creation', { error: result.error });
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during user creation', { error: error.message, requestId: req.id });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user/id/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5f87f1f1b2c001e8d2b43
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSchema'
 */

const getUserById = async (req, res) => {
    try {
        const result = await userService.getUserById(req.params.id);
        if (result.success) {
            logger.info('User retrieved successfully by ID', { userId: result.data._id });
            res.status(200).json(result.data);
        } else {
            logger.warn(`User not found with ID: ${req.params.id}`, { error: result.error });
            res.status(result.status).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during getUserById', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user
 *     responses:
 *       "200":
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSchema'
 */

const getUserByEmail = async (req, res) => {
    try {
        const result = await userService.getUserByEmail(req.params.email);
        if (result.success) {
            logger.info('User retrieved successfully by email', { userEmail: result.data.email });
            res.status(200).json(result.data);
        } else {
            logger.warn(`User not found with email: ${req.params.email}`, { error: result.error });
            res.status(result.status).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during getUserByEmail', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: Number of users to return
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           description: Number of users to skip
 *     responses:
 *       "200":
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSchema'
 */

const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers(req.query.limit, req.query.offset);
        if (result.success) {
            logger.info('All users retrieved successfully', { userCount: result.data.length });
            res.status(200).json(result.data);
        } else {
            logger.error('Error retrieving all users', { error: result.error });
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during getAllUsers', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


/**
 * @swagger
 * /user/id/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       description: User's updated information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSchema'
 *     responses:
 *       "200":
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSchema'
 */

const updateUserById = async (req, res) => {
    try {
        const result = await userService.updateUserById(req.params.id, req.body);
        if (result.success) {
            logger.info('User updated successfully by ID', { userId: result.data._id });
            res.status(200).json(result.data);
        } else {
            logger.warn(`Update failed for user with ID: ${req.params.id}`, { error: result.error });
            res.status(result.status).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during updateUserById', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user/id/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       "200":
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 */

const deleteUserById = async (req, res) => {
    try {
        const result = await userService.deleteUserById(req.params.id);
        if (result.success) {
            logger.info('User deleted successfully by ID', { userId: req.params.id });
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } else {
            logger.warn(`Delete failed for user with ID: ${req.params.id}`, { error: result.error });
            res.status(result.status).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during deleteUserById', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate a user and return JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User's login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestBody'
 *     responses:
 *       "200":
 *         description: Returns the authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 */

const login = async (req, res) => {
    try {
        const result = await authenticationService.authenticateUser(req.body.email, req.body.password);
        if (result.success) {
            logger.info('User authenticated successfully', { userId: result.data.userId });
            res.status(200).json(result.data);
        } else {
            logger.warn('Authentication failed', { error: result.error });
            res.status(401).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during login', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user/checkemail/:
 *   post:
 *     summary: Check if an email exists.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User's email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckEmailRequestBody'
 *     responses:
 *       "200":
 *         description: Email check result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Indicates if the email is valid (true) or not (false).
 */

const checkEmail = async (req, res) => {
    try {
        const result = await userService.checkUserEmail(req.body.email);
        if (result.success) {
            logger.info('Email check completed', { email: req.body.email, valid: result.exists });
            res.status(200).json({ valid: result.exists });
        } else {
            logger.warn('Email check failed', { error: result.error });
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during checkEmail', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    createUser,
    login,
    checkEmail,
    getUserByEmail,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
};
