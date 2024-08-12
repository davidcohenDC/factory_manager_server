const { machineSensorService } = require('@services/');
const { logger } = require('@config/');

/**
 * @swagger
 * /machine-sensor:
 *   post:
 *     summary: Create a new machine sensor
 *     tags:
 *       - MachineSensor
 *     requestBody:
 *       description: Data for the new machine sensor
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serial:
 *                 type: string
 *                 example: "MCH1011"
 *               sensorData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-01T08:00:00Z"
 *                     powerConsumption:
 *                       type: number
 *                       format: decimal
 *                       example: 150.00
 *                     emissions:
 *                       type: number
 *                       format: decimal
 *                       example: 0.75
 *                     operatingTemperature:
 *                       type: number
 *                       format: decimal
 *                       example: 35.00
 *                     vibration:
 *                       type: number
 *                       format: decimal
 *                       example: 0.05
 *                     pressure:
 *                       type: number
 *                       format: decimal
 *                       example: 100.00
 *                     anomaly:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       "201":
 *         description: Machine sensor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 sensorData:
 *                   type: array
 *       "400":
 *         description: Bad Request - Invalid data
 *       "500":
 *         description: Internal Server Error
 */
const createMachineSensor = async (req, res) => {
    try {
        const machineSensorData = req.body;
        const result = await machineSensorService.createMachineSensor(machineSensorData);
        if (result.success) {
            return res.status(201).json(result.data);
        } else {
            return res.status(400).json(result.error);
        }
    } catch (error) {
        logger.error(`Error creating machine sensor: ${error.message}`);
        return res.status(500).json('Internal server error');
    }
}

/**
 * @swagger
 * /machine-sensor/id/{id}:
 *   get:
 *     summary: Get machine sensor by ID
 *     tags:
 *       - MachineSensor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "5f8d0d55b54764421b7156d9"
 *         description: ID of the machine sensor to retrieve
 *     responses:
 *       "200":
 *         description: Machine sensor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 sensorData:
 *                   type: array
 *       "404":
 *         description: Machine sensor not found
 *       "500":
 *         description: Internal Server Error
 */
const getMachineSensorById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await machineSensorService.getMachineSensorById(id);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error retrieving machine sensor by id: ${error.message}`);
        return res.status(500).json('Internal server error');
    }
}

/**
 * @swagger
 * /machine-sensor/serial/{serial}:
 *   get:
 *     summary: Get machine sensor by serial
 *     tags:
 *       - MachineSensor
 *     parameters:
 *       - in: path
 *         name: serial
 *         required: true
 *         schema:
 *           type: string
 *           example: "MCH1011"
 *         description: Serial of the machine sensor to retrieve
 *     responses:
 *       "200":
 *         description: Machine sensor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 sensorData:
 *                   type: array
 *       "404":
 *         description: Machine sensor not found
 *       "500":
 *         description: Internal Server Error
 */
const getMachineSensorBySerial = async (req, res) => {
    try {
        const serial = req.params.serial;
        const result = await machineSensorService.getMachineSensorBySerial(serial);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error retrieving machine sensor by serial: ${error.message}`);
        return res.status(500).json('Internal server error');
    }
}

/**
 * @swagger
 * /machine-sensor:
 *   get:
 *     summary: Get all machine sensors
 *     tags:
 *       - MachineSensor
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of machine sensors to retrieve
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       "200":
 *         description: List of machine sensors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   serial:
 *                     type: string
 *                   sensorData:
 *                     type: array
 *       "404":
 *         description: Machine sensors not found
 *       "500":
 *         description: Internal Server Error
 */
const getAllMachineSensors = async (req, res) => {
    try {
        const limit = req.query.limit;
        const offset = req.query.offset;
        const result = await machineSensorService.getAllMachineSensors(limit, offset);
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error retrieving all machine sensors: ${error.message}`);
        return res.status(500).json('Internal server error');
    }
}


module.exports = {
    createMachineSensor,
    getMachineSensorById,
    getMachineSensorBySerial,
    getAllMachineSensors
};
