const User = require('@models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET; // Directly from environment variable

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // logEvent('API1001', req?.user?._id ?? '', 'warn', 'Invalid email attempted for login');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // logEvent('API1002', req?.user?._id ?? '', 'warn', 'Invalid password attempted for login');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: '30d'
    });

    // logEvent('API1003', user._id, 'info', 'User logged in successfully');
    res.status(200).json({ token });

  } catch (err) {
    // logEvent('API1004', req?.user?._id ?? '', 'error', `Error during login: ${err.message}`);
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @swagger
 * /user/login:
 *    post:
 *      summary: Authenticate a user and return JWT token
 *      tags:
 *        - Authentication
 *      requestBody:
 *        description: User's login credentials
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginRequestBody'
 *      responses:
 *        "200":
 *          description: Returns the authentication token.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: JWT token for the authenticated user.
 *        "401":
 *          description: Invalid email or password.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        "500":
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
