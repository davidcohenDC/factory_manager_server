const User = require('@models/user');
const { logger } = require('@config/');

module.exports.getByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('User not found', {
                email,
                req,
                source: 'getByEmail'
            });
            return res.status(404).json({ error: 'User not found' });
        } else {
            logger.info('User found by email', {
                email,
                req,
                source: 'getByEmail'
            });
            res.status(200).json(user);
        }
    } catch (err) {
        logger.error('Error during get by email', {
            req,
            source: 'getByEmail'
        });
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /user/email/{email}:
 *   get:
 *     summary: Get user by email.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user
 *     responses:
 *       "200":
 *         description: User found by email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSchema'
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response404'
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response404'
 */