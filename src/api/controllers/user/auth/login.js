const User = require("../../../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.login = async (req, res) => {
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
