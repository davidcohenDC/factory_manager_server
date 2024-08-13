const { Machine } = require('@persistence/mongoose/models/')
const { logWithSource } = require('@config/');
const logger = logWithSource('MachineRepository');

const createMachine = async (machineData) => {
    try {
        const machine = new Machine(machineData);
        await machine.save();
        logger.info(`Machine created with id: ${machine._id}`);
        return machine;
    } catch (error) {
        if (error.message === 'Machine with this serial already exists.') {
            // The error is already logged in the schema, just propagate it
            throw error;
        } else {
            logger.error(`Database operation failed: ${error.message}`, {error});
            throw new Error('Failed to process data');

        }
    }
}

const findMachineById = async (id) => {
    try {
        const machine = await Machine.findById(id);
        if (!machine) {
            logger.warn(`Machine with id: ${id} not found.`);
        }
        return machine;
    } catch (error) {
        logger.error(`Error finding machine by id ${id}: ${error.message}`);
        throw error;
    }
}

const updateMachineById = async (id ,updateData) => {
    try {
        const updatedMachine = await Machine.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
        if (!updatedMachine) {
            logger.warn(`Machine with id: ${id} not found for update.`);
        } else {
            logger.info(`Machine with id: ${id} successfully updated.`);
        }
        return updatedMachine;
    } catch (error) {
        logger.error(`Error updating machine by id ${id}: ${error.message}`);
        throw error;
    }
}

const updateMachineBySerial = async (id ,updateData) => {
    try {
        const updatedMachine = await Machine.findOneAndUpdate
        ({serial: id}, updateData, {new: true, runValidators: true});
        if (!updatedMachine) {
            logger.warn(`Machine with serial: ${id} not found for update.`);
        } else {
            logger.info(`Machine with serial: ${id} successfully updated.`);
        }
        return updatedMachine;
    } catch (error) {
        logger.error(`Error updating machine by serial ${id}: ${error.message}`);
        throw error;
    }
}

const deleteMachineById = async (id) => {
    try {
        const machine = await Machine.findByIdAndDelete(id);
        if (!machine) {
            logger.warn(`Machine with id: ${id} not found for deletion.`);
        } else {
            logger.info(`Machine with id: ${id} successfully deleted.`);
        }
        return machine;
    } catch (error) {
        logger.error(`Error deleting machine by id ${id}: ${error.message}`);
        throw error;
    }
}

const getAllMachines = async (limit, offset) => {
    try {
        const machines = await Machine.find().skip(offset).limit(limit);
        logger.info(`Retrieved ${machines.length} machines.`);
        return machines;
    } catch (error) {
        logger.error(`Error retrieving machines: ${error.message}`);
        throw error;
    }
}

const findMachineBySerial = async (serial) => {
    try {
        const machine = await Machine.findOne({ serial });
        if (!machine) {
            logger.warn(`Machine with serial: ${serial} not found.`);
        }
        return machine;
} catch (error) {
    logger.error(`Error finding machine by serial ${serial}: ${error.message}`);
    throw error;
    }
}

module.exports = {
    createMachine,
    findMachineById,
    updateMachineById,
    updateMachineBySerial,
    deleteMachineById,
    getAllMachines,
    findMachineBySerial
}