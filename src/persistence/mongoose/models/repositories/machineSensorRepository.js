const { MachineSensor } = require('@persistence/mongoose/models/')
const { logWithSource } = require('@config/')
const logger = logWithSource('MachineSensorRepository')

const createMachineSensor = async (machineSensorData) => {
  try {
    const machineSensor = new MachineSensor(machineSensorData)
    await machineSensor.save()
    logger.info(`Machine sensor created with id: ${machineSensor._id}`)
    return machineSensor
  } catch (error) {
    logger.error(`Database operation failed: ${error.message}`, { error })
    throw new Error('Failed to process data')
  }
}

const findMachineSensorById = async (id) => {
  try {
    const machineSensor = await MachineSensor.findById(id)
    if (!machineSensor) {
      logger.warn(`Machine sensor with id: ${id} not found.`)
    }
    return machineSensor
  } catch (error) {
    logger.error(`Error finding machine sensor by id ${id}: ${error.message}`)
    throw error
  }
}

const findMachineSensorBySerial = async (serial) => {
  try {
    const machineSensor = await MachineSensor.findOne({ serial: serial })
    if (!machineSensor) {
      logger.warn(`Machine sensor with serial: ${serial} not found.`)
    }
    return machineSensor
  } catch (error) {
    logger.error(
      `Error finding machine sensor by serial ${serial}: ${error.message}`
    )
    throw error
  }
}

const getAllMachineSensors = async (limit, offset) => {
  try {
    const machineSensors = await MachineSensor.find().skip(offset).limit(limit)
    logger.info(`Retrieved ${machineSensors.length} machine sensors.`)
    return machineSensors
  } catch (error) {
    logger.error(`Error retrieving machine sensors: ${error.message}`)
    throw error
  }
}

module.exports = {
  createMachineSensor,
  findMachineSensorById,
  findMachineSensorBySerial,
  getAllMachineSensors
}
