const { userService, authenticationService } = require('@services/');

const { logger } = require('@config/');

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
 *       "400":
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await userService.createUser(userData);

        if (result && result.success) {
            return res.status(201).json(result.data);
        } else {
            const errorMessage = result && result.error ? result.error : 'Unknown error';
            return res.status(400).json({ error: errorMessage });
        }
    } catch (error) {
        console.error('[createUserController] Create user error:', error?.message || error);
        res.status(500).json({ message: 'Error creating user', error: error?.message || 'Unknown error' });
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
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d5f87f1f1b2c001e8d2b43
 *                 name:
 *                   type: object
 *                   properties:
 *                     first:
 *                       type: string
 *                       example: John
 *                     last:
 *                       type: string
 *                       example: Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 role:
 *                   type: string
 *                   example: user
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserById(id);

        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(404).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Get user by ID error: ${error.message}`, { source: 'getUserByIdController' });
        return res.status(500).json({ error: 'Internal server error' });
    }
}
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
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await userService.getUserByEmail(email);

        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(404).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Get user by email error: ${error.message}`, { source: 'getUserByEmailController' });
        return res.status(500).json({ error: 'Internal server error' });
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
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const getAllUsers = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const result = await userService.getAllUsers(limit, offset);

        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Get all users error: ${error.message}`, { source: 'getAllUsersController' });
        return res.status(500).json({ error: 'Internal server error' });
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
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await userService.updateUserById(id, updateData);

        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(404).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Update user by ID error: ${error.message}`, { source: 'updateUserByIdController' });
        return res.status(500).json({ error: 'Internal server error' });
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
 *               $ref: '#/components/schemas/ResponseSuccess'
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUserById(id);

        if (result.success) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Delete user by ID error: ${error.message}`, { source: 'deleteUserByIdController' });
        return res.status(500).json({ error: 'Internal server error' });
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
 *       "401":
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authenticationService.authenticateUser(email, password);

        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(401).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Login error: ${error.message}`, { source: 'loginController' });
        return res.status(500).json({ error: 'Internal server error' });
    }
}

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
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.checkUserEmail(email);

        if (result.success) {
            return res.status(200).json({ valid: result.exists });
        } else {
            return res.status(500).json({ error: result.error });
        }
    } catch (error) {
        logger.error(`Check email error: ${error.message}`, { source: 'checkEmailController' });
        return res.status(500).json({ error: 'Internal server error' });
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
