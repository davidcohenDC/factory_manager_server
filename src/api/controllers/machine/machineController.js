const { machineService } = require('@services/');
const { logger } = require('@config/');

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
        const machineData = req.body;
        const result = await machineService.createMachine(machineData);
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json(result.error);
        }
    } catch (error) {
        logger.error(`Error creating machine: ${error.message}`);
        res.status(500).json('Internal server error');
    }
};

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
        const id = req.params.id;
        const result = await machineService.getMachineById(id);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error retrieving machine by id: ${error.message}`);
        res.status(500).json('Internal server error');
    }
};

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
        const id = req.params.id;
        const updateData = req.body;
        const result = await machineService.updateMachineById(id, updateData);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json(result.error);
        }
    } catch (error) {
        logger.error(`Error updating machine by id: ${error.message}`);
        res.status(500).json('Internal server error');
    }
};

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
        const id = req.params.id;
        const result = await machineService.deleteMachineById(id);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error deleting machine by id: ${error.message}`);
        res.status(500).json('Internal server error');
    }
};

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
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const result = await machineService.getAllMachines(limit, offset);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error retrieving all machines: ${error.message}`);
        res.status(500).json('Internal server error');
    }
};

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
        const serial = req.params.serial;
        const result = await machineService.getMachineBySerial(serial);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json(result.error);
        }
    } catch (error) {
        logger.error(`Error retrieving machine by serial: ${error.message}`);
        res.status(500).json('Internal server error');
    }
};

module.exports = {
    createMachine,
    getMachineById,
    updateMachineById,
    deleteMachineById,
    getAllMachines,
    getMachineBySerial
};
