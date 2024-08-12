const machineRepository = require('@repositories/machineRepository');
const { logger } = require('@config/');

const createMachine = async (machineData) => {
    try {
        const machine = await machineRepository.createMachine(machineData);
        logger.info(`Machine created with id: ${machine._id}`);
        return { success: true, data: machine };
    } catch (error) {
        logger.error(`Error creating machine: ${error.message}`);
        return { success: false, error: 'Failed to create machine' };
    }
}

const getMachineById = async (id) => {
    try {
        const machine = await machineRepository.findMachineById(id);
        logger.info(`Machine retrieved with id: ${id}`);
        return machine ? { success: true, data: machine } : { success: false, error: 'Machine not found' };
    } catch (error) {
        logger.error(`Error retrieving machine by id: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine by id' };
    }
}

const updateMachineById = async (id, updateData) => {
    try {
        const updatedMachine = await machineRepository.updateMachineById(id, updateData);
        logger.info(`Machine updated with id: ${id}`);
        return { success: true, data: updatedMachine };
    } catch (error) {
        logger.error(`Error updating machine by id: ${error.message}`);
        return { success: false, error: 'Failed to update machine' };
    }
}

const deleteMachineById = async (id) => {
    try {
        const deletedMachine = await machineRepository.deleteMachineById(id);
        logger.info(`Machine deleted with id: ${id}`);
        return { success: true, data: deletedMachine };
    } catch (error) {
        logger.error(`Error deleting machine by id: ${error.message}`);
        return { success: false, error: 'Failed to delete machine' };
    }
}

const getAllMachines = async (limit, offset) => {
    try {
        const machines = await machineRepository.getAllMachines(limit, offset);
        logger.info(`Retrieved all machines`);
        return { success: true, data: machines };
    } catch (error) {
        logger.error(`Error retrieving all machines: ${error.message}`);
        return { success: false, error: 'Failed to retrieve all machines' };
    }
}

const getMachineBySerial = async (serial) => {
    try {
        const machine = await machineRepository.findMachineBySerial(serial);
        logger.info(`Machine retrieved with serial: ${serial}`);
        return machine ? { success: true, data: machine } : { success: false, error: 'Machine not found' };
    } catch (error) {
        logger.error(`Error retrieving machine by serial: ${error.message}`);
        return { success: false, error: 'Failed to retrieve machine by serial' };
    }
}

module.exports = {
    createMachine,
    getMachineById,
    updateMachineById,
    deleteMachineById,
    getAllMachines,
    getMachineBySerial
}