const MachineSensor = require('@models/machineSensor')
const { logger } = require('@config/')

module.exports.getByMachine = async (req, res) => {
    const { machineId } = req.params

    try {
        const machineSensor = await MachineSensor.find({ machineId: machineId }).exec()
        if (!machineSensor) {
            logger.warn('machineSensor not found', {
                machineId,
                req,
                source: 'getByMachine'
            })
            return res.status(404).json({ error: 'machineSensor not found' })
        } else {
            logger.info('machineSensor found by machineId', {
                machineId,
                req,
                source: 'getByMachine'
            })
            res.status(200).json(machineSensor)
        }
    } catch (err) {
        logger.error('Error during get by machineId', {
            req,
            source: 'getByMachine'
        })
        res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * @swagger
 * /machinesensor/machineId/{machineId}:
 *   get:
 *     summary: Get machineSensor by machineId.
 *     tags:
 *       - machineSensor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: machineId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the machine
 *     responses:
 *       "200":
 *         description: machineSensor found by machineId.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/machineSensorSchema'
 *       "404":
 *         description: machineSensor not found.
 *         content:
 *           application/json:
 *             schema:
 */