const machineSensorRepository = require('@repositories/machineSensorRepository');
const { logger } = require('@config/');

const createMachineSensor = async (machineSensorData) => {
    try {
        const machineSensor = await machineSensorRepository.createMachineSensor(machineSensorData);
        logger.info(`Machine sensor created with id: ${machineSensor._id}`);
        return { success: true, data: machineSensor };
    } catch (error) {
        logger.error(`Error creating machine sensor: ${error.message}`);
        return { success: false, error: 'Failed to create machine sensor' };
    }
}

const getMachineSensorById = async (id) => {
    try {
        const machineSensor = await machineSensorRepository.findMachineSensorById(id);
        logger.info(`Machine sensor retrieved with id: ${id}`);
        return machineSensor ? { success: true, data: machineSensor } : { success: false, error: 'Machine sensor not found' };
    } catch (error) {
        logger.error(`Error retrieving machine sensor by id: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine sensor by id' };
    }
}

const getMachineSensorBySerial = async (serial) => {
    try {
        const machineSensor = await machineSensorRepository.findMachineSensorBySerial(serial);
        logger.info(`Machine sensor retrieved with serial: ${serial}`);
        return machineSensor ? { success: true, data: machineSensor } : { success: false, error: 'Machine sensor not found' };
    } catch (error) {
        logger.error(`Error retrieving machine sensor by serial: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine sensor by serial' };
    }
}

const getAllMachineSensors = async (limit, offset) => {
    try {
        const machineSensors = await machineSensorRepository.getAllMachineSensors(limit, offset);
        logger.info(`Retrieved all machine sensors`);
        return { success: true, data: machineSensors };
    } catch (error) {
        logger.error(`Error retrieving all machine sensors: ${error.message}`);
        return { success: false, error: 'Failed to retrieve all machine sensors' };
    }
}

module.exports = {
    createMachineSensor,
    getMachineSensorById,
    getMachineSensorBySerial,
    getAllMachineSensors
}