const { areaService } = require('@services/');
const { logger } = require('@config/');

/**
 * @swagger
 * /area:
 *   post:
 *     summary: Create a new area
 *     tags:
 *       - Area
 *     requestBody:
 *       description: Data for the new area
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AreaSchema'
 *     responses:
 *       "201":
 *         description: Area created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSchema'
 *       "400":
 *         description: Bad request - Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 */
const createArea = async (req, res) => {
    try {
        const areaData = req.body;
        const result = await areaService.createArea(areaData);
        if (result.success) {
            return res.status(201).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        logger.error(`Error creating area: ${error.message}`);
        return res.status(500).json({ error: 'Failed to create area' });
    }
}

/**
 * @swagger
 * /area/id/{id}:
 *   get:
 *     summary: Get an area by ID
 *     tags:
 *       - Area
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the area to retrieve
 *     responses:
 *       "200":
 *         description: Area retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSchema'
 *       "404":
 *         description: Area not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response404'
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 */
const getAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await areaService.getAreaById(id);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(404).json({ error: result.error });
    } catch (error) {
        logger.error(`Error retrieving area by id: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve area by id' });
    }
}

/**
 * @swagger
 * /area/id/{id}:
 *   patch:
 *     summary: Update an area by ID
 *     tags:
 *       - Area
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the area to update
 *     requestBody:
 *       description: Data to update the area
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AreaSchema'
 *     responses:
 *       "200":
 *         description: Area updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSchema'
 *       "400":
 *         description: Bad request - Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 *       "404":
 *         description: Area not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response404'
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 */
const updateAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await areaService.updateAreaById(id, updateData);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        logger.error(`Error updating area by id: ${error.message}`);
        return res.status(500).json({ error: 'Failed to update area' });
    }
}

/**
 * @swagger
 * /area/id/{id}:
 *   delete:
 *     summary: Delete an area by ID
 *     tags:
 *       - Area
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the area to delete
 *     responses:
 *       "200":
 *         description: Area deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Area deleted successfully
 *       "404":
 *         description: Area not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response404'
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 */
const deleteAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await areaService.deleteAreaById(id);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        logger.error(`Error deleting area by id: ${error.message}`);
        return res.status(500).json({ error: 'Failed to delete area' });
    }
}

/**
 * @swagger
 * /area:
 *   get:
 *     summary: Get all areas
 *     tags:
 *       - Area
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of areas to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       "200":
 *         description: List of areas retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaSchema'
 *       "400":
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 */
const getAllAreas = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const result = await areaService.getAllAreas(limit, offset);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        logger.error(`Error retrieving all areas: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve all areas' });
    }
}

/**
 * @swagger
 * /area/name/{name}:
 *   get:
 *     summary: Get an area by name
 *     tags:
 *       - Area
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the area to retrieve
 *     responses:
 *       "200":
 *         description: Area retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSchema'
 *       "404":
 *         description: Area not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response404'
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response400'
 */
const getAreaByName = async (req, res) => {
    try {
        const { name } = req.params;
        const result = await areaService.getAreaByName(name);
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(404).json({ error: result.error });
    } catch (error) {
        logger.error(`Error retrieving area by name: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve area by name' });
    }
}

module.exports = {
    createArea,
    getAreaById,
    updateAreaById,
    deleteAreaById,
    getAllAreas,
    getAreaByName
};
