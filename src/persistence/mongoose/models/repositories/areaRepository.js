const { Area } = require('@persistence/mongoose/models/')
const { logWithSource } = require('@config/')
const logger = logWithSource('AreaRepository')

const createArea = async (areaData) => {
  try {
    const area = new Area(areaData)
    await area.save()
    logger.info(`Area created with id: ${area.name}`)
    return area
  } catch (error) {
    logger.error(`Database operation failed: ${error.message}`, { error })
    throw new Error('Failed to process data')
  }
}

const findAreaById = async (id) => {
  try {
    const area = await Area.findById(id)
    if (!area) {
      logger.warn(`Area with id: ${id} not found.`)
    }
    return area
  } catch (error) {
    logger.error(`Error finding area by id ${id}: ${error.message}`)
    throw error
  }
}

const findAreaByName = async (name) => {
  try {
    const area = await Area.findOne({ name: name })
    if (!area) {
      logger.warn(`Area with name: ${name} not found.`)
    }
    return area
  } catch (error) {
    logger.error(`Error finding area by name ${name}: ${error.message}`)
    throw error
  }
}

const updateAreaById = async (id, updateData) => {
  try {
    const updatedArea = await Area.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
    if (!updatedArea) {
      logger.warn(`Area with id: ${id} not found for update.`)
    } else {
      logger.info(`Area with id: ${id} successfully updated.`)
    }
    return updatedArea
  } catch (error) {
    logger.error(`Error updating area by id ${id}: ${error.message}`)
    throw error
  }
}

const deleteAreaById = async (id) => {
  try {
    const deletedArea = await Area.findByIdAndDelete(id)
    if (!deletedArea) {
      logger.warn(`Area with id: ${id} not found for deletion.`)
    } else {
      logger.info(`Area with id: ${id} successfully deleted.`)
    }
    return deletedArea
  } catch (error) {
    logger.error(`Error deleting area by id ${id}: ${error.message}`)
    throw error
  }
}

const getAllAreas = async (limit, offset) => {
  try {
    const areas = await Area.find().skip(offset).limit(limit)
    logger.info(`Retrieved ${areas.length} areas.`)
    return areas
  } catch (error) {
    logger.error(`Error retrieving areas: ${error.message}`)
    throw error
  }
}

module.exports = {
  createArea,
  findAreaById,
  updateAreaById,
  deleteAreaById,
  getAllAreas,
  findAreaByName
}
