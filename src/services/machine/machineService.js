const machineRepository = require('@repositories/machineRepository')
const { logWithSource } = require('@config/')
const logger = logWithSource('MachineService')

const createMachine = async (machineData) => {
  try {
    const machine = await machineRepository.createMachine(machineData)
    logger.info(`Machine created with id: ${machine._id}`, {
      machineId: machine._id,
      serial: machine.serial
    })
    return { success: true, data: machine }
  } catch (error) {
    if (error.message === 'Machine with this serial already exists.') {
      logger.warn(`Machine creation failed: ${error.message}`)
      return {
        success: false,
        error: 'Machine with this serial already exists.'
      }
    } else {
      logger.error(`Unexpected error during machine creation: ${error.message}`)
      return { success: false, error: 'Failed to create machine' }
    }
  }
}

const getMachineById = async (id) => {
  try {
    const machine = await machineRepository.findMachineById(id)
    if (!machine)
      return { success: false, error: 'Machine not found', status: 404 }
    logger.info(`Machine retrieved with id: ${id}`)
    return { success: true, data: machine }
  } catch (error) {
    logger.error(`Error retrieving machine by id: ${error.message}`, {
      stack: error.stack
    })
    return {
      success: false,
      error: 'Failed to retrieve machine by id',
      status: 500
    }
  }
}

const getMachineBySerial = async (serial) => {
  try {
    const machine = await machineRepository.findMachineBySerial(serial)
    if (!machine)
      return { success: false, error: 'Machine not found', status: 404 }
    logger.info(`Machine retrieved with serial: ${serial}`)
    return { success: true, data: machine }
  } catch (error) {
    logger.error(`Error retrieving machine by serial: ${error.message}`, {
      stack: error.stack
    })
    return {
      success: false,
      error: 'Failed to retrieve machine by serial',
      status: 500
    }
  }
}

const updateMachineById = async (id, updateData) => {
  try {
    const updatedMachine = await machineRepository.updateMachineById(
      id,
      updateData
    )
    if (!updatedMachine)
      return { success: false, error: 'Machine not found', status: 404 }
    logger.info(`Machine updated with id: ${id}`)
    return { success: true, data: updatedMachine }
  } catch (error) {
    logger.error(`Error updating machine by id: ${error.message}`)
    return { success: false, error: 'Failed to update machine' }
  }
}

const updateMachineBySerial = async (serial, updateData) => {
  try {
    const updatedMachine = await machineRepository.updateMachineBySerial(
      serial,
      updateData
    )
    if (!updatedMachine)
      return { success: false, error: 'Machine not found', status: 404 }
    logger.info(`Machine updated with serial: ${serial}`)
    return { success: true, data: updatedMachine }
  } catch (error) {
    logger.error(`Error updating machine by serial: ${error.message}`)
    return { success: false, error: 'Failed to update machine', status: 500 }
  }
}

const deleteMachineById = async (id) => {
  try {
    const deletedMachine = await machineRepository.deleteMachineById(id)
    if (!deletedMachine)
      return { success: false, error: 'Machine not found', status: 404 }
    logger.info(`Machine deleted with id: ${id}`)
    return { success: true, data: deletedMachine }
  } catch (error) {
    logger.error(`Error deleting machine by id: ${error.message}`)
    return { success: false, error: 'Failed to delete machine', status: 500 }
  }
}

const getAllMachines = async (limit, offset) => {
  try {
    const machines = await machineRepository.getAllMachines(limit, offset)
    logger.info(`Retrieved all machines`)
    return { success: true, data: machines }
  } catch (error) {
    logger.error(`Error retrieving all machines: ${error.message}`, {
      stack: error.stack
    })
    return {
      success: false,
      error: 'Failed to retrieve all machines',
      status: 500
    }
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
