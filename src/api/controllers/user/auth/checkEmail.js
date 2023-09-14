const User = require('@models/user')
const { logger } = require('@config/')

module.exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // If the email exists, return 200 with a message that it exists
      logger.info('Email exists', { req , source: 'checkEmail'});
      return res.status(200).json({ message: 'Email exists', exists: true });
    } else {
      // If the email does not exist, return 200 with a message that it does not exist
      logger.info('Email does not exist', { req , source: 'checkEmail'});
      return res.status(200).json({ message: 'Email does not exist', exists: false });
    }
  } catch (error) {
    logger.error('Error checking email', { req, error , source: 'checkEmail'});
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @swagger
 * /user/checkemail/:
 *    post:
 *      summary: Check if an email exists.
 *      tags:
 *        - Authentication
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        description: User's login credentials
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CheckEmailRequestBody'
 *      responses:
 *        "200":
 *          description: Email check successful or not.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  exists:
 *                    type: boolean
 *                    description: Indicates if the email exists (true) or not (false).
 *        "500":
 *          description: Internal server error.q
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
