const machineSensorRepository = require('@persistence/mongoose/models/repositories/machineSensorRepository');
const { logWithSource } = require('@config/');
const logger = logWithSource('MachineSensorService');

const createMachineSensor = async (machineSensorData) => {
    try {
        const machineSensor = await machineSensorRepository.createMachineSensor(machineSensorData);
        logger.info(`Machine sensor created with id: ${machineSensor._id}`, { machineSensorId: machineSensor._id, serial: machineSensor.serial });
        return { success: true, data: machineSensor };
    } catch (error) {
        logger.error(`Unexpected error during machine sensor creation: ${error.message}`);
        return { success: false, error: 'Failed to create machine sensor' };
    }
};

const getMachineSensorById = async (id) => {
    try {
        const machineSensor = await machineSensorRepository.findMachineSensorById(id);
        if (!machineSensor) return { success: false, error: 'Machine sensor not found', status: 404 };
        logger.info(`Machine sensor retrieved with id: ${id}`);
        return { success: true, data: machineSensor };
    } catch (error) {
        logger.error(`Error retrieving machine sensor by id: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine sensor by id', status: 500 };
    }
};

const getMachineSensorBySerial = async (serial) => {
    try {
        const machineSensor = await machineSensorRepository.findMachineSensorBySerial(serial);
        if (!machineSensor) return { success: false, error: 'Machine sensor not found', status: 404 };
        logger.info(`Machine sensor retrieved with serial: ${serial}`);
        return { success: true, data: machineSensor };
    } catch (error) {
        logger.error(`Error retrieving machine sensor by serial: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine sensor by serial', status: 500 };
    }
};

const updateMachineSensorById = async (id, updateData) => {
    try {
        const updatedMachineSensor = await machineSensorRepository.updateMachineSensorById(id, updateData);
        if (!updatedMachineSensor) return { success: false, error: 'Machine sensor not found', status: 404 };
        logger.info(`Machine sensor updated with id: ${id}`);
        return { success: true, data: updatedMachineSensor };
    } catch (error) {
        logger.error(`Error updating machine sensor by id: ${error.message}`);
        return { success: false, error: 'Failed to update machine sensor', status: 500 };
    }
};

const deleteMachineSensorById = async (id) => {
    try {
        const deletedMachineSensor = await machineSensorRepository.deleteMachineSensorById(id);
        if (!deletedMachineSensor) return { success: false, error: 'Machine sensor not found', status: 404 };
        logger.info(`Machine sensor deleted with id: ${id}`);
        return { success: true, data: deletedMachineSensor };
    } catch (error) {
        logger.error(`Error deleting machine sensor by id: ${error.message}`);
        return { success: false, error: 'Failed to delete machine sensor', status: 500 };
    }
};

const getAllMachineSensors = async (limit, offset) => {
    try {
        const machineSensors = await machineSensorRepository.getAllMachineSensors(limit, offset);
        logger.info('All machine sensors retrieved');
        return { success: true, data: machineSensors };
    } catch (error) {
        logger.error(`Error retrieving all machine sensors: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine sensors', status: 500 };
    }
};

module.exports = {
    createMachineSensor,
    getMachineSensorById,
    getMachineSensorBySerial,
    updateMachineSensorById,
    deleteMachineSensorById,
    getAllMachineSensors,
};
