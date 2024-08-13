const { machineService } = require('@services/');
const { logWithSource } = require('@config/');
const logger = logWithSource('MachineController');
/**
 * @swagger
 * /machine:
 *   post:
 *     summary: Create a new machine
 *     tags:
 *       - Machine
 *     requestBody:
 *       description: Data for the new machine
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serial:
 *                 type: string
 *                 example: "MCH101"
 *               name:
 *                 type: string
 *                 example: "Machine A"
 *               location:
 *                 type: object
 *                 properties:
 *                   area:
 *                     type: string
 *                     example: "Area 1"
 *               machineState:
 *                 type: object
 *                 properties:
 *                   currentState:
 *                     type: string
 *                     enum: ["operational", "anomaly", "off"]
 *                     example: "operational"
 *                   anomalyDetails:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: ["powerConsumption", "emissions", "operatingTemperature", "vibration", "pressure"]
 *               specifications:
 *                 type: object
 *                 properties:
 *                   powerConsumption:
 *                     type: object
 *                     properties:
 *                       measurementUnit:
 *                         type: string
 *                         example: "kW"
 *                       normalRange:
 *                         type: object
 *                         properties:
 *                           min:
 *                             type: string
 *                             format: decimal
 *                             example: "100.0"
 *                           max:
 *                             type: string
 *                             format: decimal
 *                             example: "200.0"
 *                   emissions:
 *                     type: object
 *                     properties:
 *                       measurementUnit:
 *                         type: string
 *                         example: "CO2"
 *                       normalRange:
 *                         type: object
 *                         properties:
 *                           min:
 *                             type: string
 *                             format: decimal
 *                             example: "50.0"
 *                           max:
 *                             type: string
 *                             format: decimal
 *                             example: "100.0"
 *     responses:
 *       "201":
 *         description: Machine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: object
 *                 machineState:
 *                   type: object
 *                 specifications:
 *                   type: object
 *       "400":
 *         description: Bad Request - Invalid data
 *       "500":
 *         description: Internal Server Error
 */
const createMachine = async (req, res) => {
    try {
        const result = await machineService.createMachine(req.body);
        if (result.success) {
            logger.info(`Machine created successfully:`, { serial: result.data._id });
            res.status(201).json(result.data);
        } else {
            logger.warn(`Validation error during machine creation`, { error: result.error });
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error', { error: error.message, requestId: req.id });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

/**
 * @swagger
 * /machine/id/{id}:
 *   get:
 *     summary: Get machine by ID
 *     tags:
 *       - Machine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "MCH101"
 *         description: ID of the machine to retrieve
 *     responses:
 *       "200":
 *         description: Machine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: object
 *                 machineState:
 *                   type: object
 *                 specifications:
 *                   type: object
 *       "404":
 *         description: Machine not found
 *       "500":
 *         description: Internal Server Error
 */
const getMachineById = async (req, res) => {
    try {
        const result = await machineService.getMachineById(req.params.id);
        if (result.success) {
            logger.info('Machine retrieved successfully by ID:', { machineId: result.data._id });
            res.status(200).json(result.data);
        } else {
            logger.warn(`Machine not found with ID: ${req.params.id}`, { error: result.error });
            res.status(404).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during getMachineById', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


/**
 * @swagger
 * /machine/serial/{serial}:
 *   get:
 *     summary: Get machine by serial
 *     tags:
 *       - Machine
 *     parameters:
 *       - in: path
 *         name: serial
 *         required: true
 *         schema:
 *           type: string
 *           example: "MCH1011"
 *         description: Serial of the machine to retrieve
 *     responses:
 *       "200":
 *         description: Machine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: object
 *                 machineState:
 *                   type: object
 *                 specifications:
 *                   type: object
 *       "404":
 *         description: Machine not found
 *       "500":
 *         description: Internal Server Error
 */
const getMachineBySerial = async (req, res) => {
    try {
        const result = await machineService.getMachineBySerial(req.params.serial);
        if (result.success) {
            logger.info('Machine retrieved successfully by Serial:', { machineSerial: result.data._id });
            res.status(200).json(result.data);
        } else {
            logger.warn(`Machine not found with Serial: ${req.params.serial}`, { error: result.error });
            res.status(404).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during getMachineBySerial', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

/**
 * @swagger
 * /machine/id/{id}:
 *   patch:
 *     summary: Update machine by ID
 *     tags:
 *       - Machine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "MCH101"
 *         description: ID of the machine to update
 *     requestBody:
 *       description: Data to update the machine
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *               machineState:
 *                 type: object
 *               specifications:
 *                 type: object
 *     responses:
 *       "200":
 *         description: Machine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: object
 *                 machineState:
 *                   type: object
 *                 specifications:
 *                   type: object
 *       "400":
 *         description: Bad Request - Invalid data
 *       "404":
 *         description: Machine not found
 *       "500":
 *         description: Internal Server Error
 */
const updateMachineById = async (req, res) => {
    try {
        const result = await machineService.updateMachineById(req.params.id, req.body);
        if (result.success) {
            logger.info('Machine updated successfully by ID', {machineId: result.data._id});
            res.status(200).json(result.data);
        } else {
            logger.warn(`Update failed for machine with ID: ${req.params.id}`, {error: result.error});
            res.status(result.status).json({success: false, error: result.error});
        }
    } catch (error) {
        logger.error('Internal server error during updateMachineById', {error: error.message});
        res.status(500).json({success: false, error: 'Internal server error'});
    }
}



/**
 * @swagger
 * /machine/serial/{serial}:
 *   patch:
 *     summary: Update machine by Serial
 *     tags:
 *       - Machine
 *     parameters:
 *       - in: path
 *         name: serial
 *         required: true
 *         schema:
 *           type: string
 *           example: "MCH1011"
 *         description: Serial of the machine to update
 *     requestBody:
 *       description: Data to update the machine
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *               machineState:
 *                 type: object
 *               specifications:
 *                 type: object
 *     responses:
 *       "200":
 *         description: Machine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serial:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: object
 *                 machineState:
 *                   type: object
 *                 specifications:
 *                   type: object
 *       "400":
 *         description: Bad Request - Invalid data
 *       "404":
 *         description: Machine not found
 *       "500":
 *         description: Internal Server Error
 */
const updateMachineBySerial = async (req, res) => {
    try {
        const result = await machineService.updateMachineBySerial(req.params.serial, req.body);
        if (result.success) {
            logger.info('Machine updated successfully by Serial', { machineSerial: result.data._id });
            res.status(200).json(result.data);
        } else {
            logger.warn(`Update failed for machine with Serial: ${req.params.serial}`, { error: result.error });
            res.status(result.status).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during updateMachineBySerial', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

/**
 * @swagger
 * /machine/id/{id}:
 *   delete:
 *     summary: Delete machine by ID
 *     tags:
 *       - Machine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "MCH101"
 *         description: ID of the machine to delete
 *     responses:
 *       "200":
 *         description: Machine deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Machine deleted successfully"
 *       "404":
 *         description: Machine not found
 *       "500":
 *         description: Internal Server Error
 */
const deleteMachineById = async (req, res) => {
    try {
        const result = await machineService.deleteMachineById(req.params.id);
        if (result.success) {
            logger.info('Machine deleted successfully by ID', { machineId: req.params.id });
            res.status(200).json({ message: 'Machine deleted successfully' });
        } else {
            logger.warn(`Delete failed for machine with ID: ${req.params.id}`, { error: result.error });
            res.status(404).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during deleteMachineById', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

/**
 * @swagger
 * /machine:
 *   get:
 *     summary: Get all machines
 *     tags:
 *       - Machine
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of machine to retrieve
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       "200":
 *         description: List of machines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   serial:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: object
 *                   machineState:
 *                     type: object
 *                   specifications:
 *                     type: object
 *       "404":
 *         description: Machine not found
 *       "500":
 *         description: Internal Server Error
 */

const getAllMachines = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const result = await machineService.getAllMachines(limit, offset);
        if (result.success) {
            logger.info('All machines retrieved successfully', { machineCount: result.data.length });
            res.status(200).json(result.data);
        } else {
            logger.error('Error retrieving all machines', { error: result.error });
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        logger.error('Internal server error during getAllMachines', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}



module.exports = {
    createMachine,
    getMachineById,
    updateMachineById,
    updateMachineBySerial,
    deleteMachineById,
    getAllMachines,
    getMachineBySerial
}
