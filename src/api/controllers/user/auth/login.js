const User = require("../../../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logEvent } = require('../../../../utils/logger.js'); // Importa il logger avanzato

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            // logEvent('API1001', req?.user?._id ?? '', 'warn', 'Invalid email attempted for login'); // Registro tentativo di accesso con email non valida
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            // logEvent('API1002', req?.user?._id ?? '', 'warn', 'Invalid password attempted for login'); // Registro tentativo di accesso con password non valida
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        // logEvent('API1003', user._id, 'info', 'User logged in successfully'); // Registro l'accesso riuscito
        res.json({ token: token });

    } catch (err) {
        // logEvent('API1004', req?.user?._id ?? '', 'error', `Error during login: ${err.message}`);
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
