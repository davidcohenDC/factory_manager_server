const { areaService } = require('@services/')
const { logWithSource } = require('@config/')
const logger = logWithSource('AreaController')

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
 */
const createArea = async (req, res) => {
  try {
    const result = await areaService.createArea(req.body)
    if (result.success) {
      logger.info('Area created successfully', { areaId: result.data._id })
      return res.status(201).json(result.data)
    }
    logger.warn('Validation error during area creation', {
      error: result.error
    })
    return res.status(400).json({ success: false, error: result.error })
  } catch (error) {
    logger.error('Internal server error during area creation', {
      error: error.message,
      requestId: req.id
    })
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' })
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
 */
const getAreaById = async (req, res) => {
  try {
    const result = await areaService.getAreaById(req.params.id)
    if (result.success) {
      logger.info('Area retrieved successfully by ID', {
        areaId: result.data._id
      })
      return res.status(200).json(result.data)
    }
    logger.warn(`Area not found with ID: ${req.params.id}`, {
      error: result.error
    })
    return res.status(404).json({ success: false, error: 'Area not found' })
  } catch (error) {
    logger.error('Internal server error during getAreaById', {
      error: error.message
    })
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' })
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
 */
const updateAreaById = async (req, res) => {
  try {
    const result = await areaService.updateAreaById(req.params.id, req.body)
    if (result.success) {
      logger.info('Area updated successfully by ID', {
        areaId: result.data._id
      })
      return res.status(200).json(result.data)
    }
    logger.warn(`Update failed for area with ID: ${req.params.id}`, {
      error: result.error
    })
    return res.status(404).json({ success: false, error: 'Area not found' })
  } catch (error) {
    logger.error('Internal server error during updateAreaById', {
      error: error.message
    })
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' })
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
 */
const deleteAreaById = async (req, res) => {
  try {
    const result = await areaService.deleteAreaById(req.params.id)
    if (result.success) {
      logger.info('Area deleted successfully by ID', { areaId: req.params.id })
      return res
        .status(200)
        .json({ success: true, message: 'Area deleted successfully' })
    }
    logger.warn(`Delete failed for area with ID: ${req.params.id}`, {
      error: result.error
    })
    return res.status(404).json({ success: false, error: 'Area not found' })
  } catch (error) {
    logger.error('Internal server error during deleteAreaById', {
      error: error.message
    })
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' })
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
 */
const getAllAreas = async (req, res) => {
  try {
    const result = await areaService.getAllAreas(
      req.query.limit,
      req.query.offset
    )
    if (result.success) {
      logger.info('All areas retrieved successfully', {
        areaCount: result.data.length
      })
      return res.status(200).json(result.data)
    }
    logger.error('Error retrieving all areas', { error: result.error })
    return res.status(500).json({ success: false, error: result.error })
  } catch (error) {
    logger.error('Internal server error during getAllAreas', {
      error: error.message
    })
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' })
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
 */
const getAreaByName = async (req, res) => {
  try {
    const result = await areaService.getAreaByName(req.params.name)
    if (result.success) {
      logger.info('Area retrieved successfully by name', {
        areaName: result.data.name
      })
      return res.status(200).json(result.data)
    }
    logger.warn(`Area not found with name: ${req.params.name}`, {
      error: result.error
    })
    return res.status(404).json({ success: false, error: 'Area not found' })
  } catch (error) {
    logger.error('Internal server error during getAreaByName', {
      error: error.message
    })
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' })
  }
}

module.exports = {
  createArea,
  getAreaById,
  updateAreaById,
  deleteAreaById,
  getAllAreas,
  getAreaByName
}
