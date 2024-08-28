const { machineSensorService } = require('@services/')
const { logWithSource } = require('@config/')
const logger = logWithSource('MachineSensorController')

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
 *             $ref: '#/components/schemas/MachineSensorSchema'
 *     responses:
 *       "201":
 *         description: Machine sensor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineSensorSchema'
 */
const createMachineSensor = async (req, res) => {
  try {
    const result = await machineSensorService.createMachineSensor(req.body)
    if (result.success) {
      logger.info('Machine sensor created successfully', {
        machineSensorId: result.data._id
      })
      res.status(201).json(result.data)
    } else {
      logger.warn('Validation error during machine sensor creation', {
        error: result.error
      })
      res.status(400).json({ success: false, error: result.error })
    }
  } catch (error) {
    logger.error('Internal server error during machine sensor creation', {
      error: error.message
    })
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

/**
 * @swagger
 * /machine-sensor/id/{id}:
 *   get:
 *     summary: Retrieve a machine sensor by ID
 *     tags:
 *       - MachineSensor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "5f8d0d55b54764421b7156d9"
 *         description: The ID of the machine sensor to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the machine sensor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineSensorSchema'
 */
const getMachineSensorById = async (req, res) => {
  try {
    const result = await machineSensorService.getMachineSensorById(
      req.params.id
    )
    if (result.success) {
      logger.info('Machine sensor retrieved successfully by ID', {
        machineSensorId: result.data._id
      })
      res.status(200).json(result.data)
    } else {
      logger.warn(`Machine sensor not found with ID: ${req.params.id}`, {
        error: result.error
      })
      res
        .status(404)
        .json({ success: false, error: 'Machine sensor not found' })
    }
  } catch (error) {
    logger.error('Internal server error during getMachineSensorById', {
      error: error.message
    })
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

/**
 * @swagger
 * /machine-sensor/serial/{serial}:
 *   get:
 *     summary: Retrieve a machine sensor by serial
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
 *       200:
 *         description: Successfully retrieved the machine sensor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineSensorSchema'
 */
const getMachineSensorBySerial = async (req, res) => {
  try {
    const result = await machineSensorService.getMachineSensorBySerial(
      req.params.serial
    )
    if (result.success) {
      logger.info('Machine sensor retrieved successfully by serial', {
        serial: result.data.serial
      })
      res.status(200).json(result.data)
    } else {
      logger.warn(
        `Machine sensor not found with serial: ${req.params.serial}`,
        { error: result.error }
      )
      res
        .status(404)
        .json({ success: false, error: 'Machine sensor not found' })
    }
  } catch (error) {
    logger.error('Internal server error during getMachineSensorBySerial', {
      error: error.message
    })
    res.status(500).json({ success: false, error: 'Internal server error' })
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
 *           description: Number of machine sensors to return
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           description: Number of machine sensors to skip
 *     responses:
 *       "200":
 *         description: List of machine sensors retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MachineSensorSchema'
 */
const getAllMachineSensors = async (req, res) => {
  try {
    const result = await machineSensorService.getAllMachineSensors(
      req.query.limit,
      req.query.offset
    )
    if (result.success) {
      logger.info('All machine sensors retrieved successfully', {
        sensorCount: result.data.length
      })
      res.status(200).json(result.data)
    } else {
      logger.warn('No machine sensors found', { error: result.error })
      res
        .status(404)
        .json({ success: false, error: 'No machine sensors found' })
    }
  } catch (error) {
    logger.error('Internal server error during getAllMachineSensors', {
      error: error.message
    })
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

module.exports = {
  createMachineSensor,
  getMachineSensorById,
  getMachineSensorBySerial,
  getAllMachineSensors
}
