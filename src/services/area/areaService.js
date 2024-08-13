const areaRepository = require('@persistence/mongoose/models/repositories/areaRepository');
const { logWithSource } = require('@config/');
const logger = logWithSource('AreaService');

const createArea = async (areaData) => {
    try {
        const area = await areaRepository.createArea(areaData);
        logger.info(`Area created with id: ${area._id}`);
        return { success: true, data: area };
    } catch (error) {
        logger.error(`Error creating area: ${error.message}`);
        return { success: false, error: 'Failed to create area' };
    }
};

const getAreaById = async (id) => {
    try {
        const area = await areaRepository.findAreaById(id);
        if (!area) {
            return { success: false, error: 'Area not found', status: 404 };
        }
        logger.info(`Area retrieved with id: ${id}`);
        return { success: true, data: area };
    } catch (error) {
        logger.error(`Error retrieving area by id: ${error.message}`);
        return { success: false, error: 'Failed to retrieve area by id', status: 500 };
    }
};

const updateAreaById = async (id, updateData) => {
    try {
        const updatedArea = await areaRepository.updateAreaById(id, updateData);
        if (!updatedArea) {
            return { success: false, error: 'Area not found', status: 404 };
        }
        logger.info(`Area updated with id: ${id}`);
        return { success: true, data: updatedArea };
    } catch (error) {
        logger.error(`Error updating area by id: ${error.message}`);
        return { success: false, error: 'Failed to update area', status: 500 };
    }
};

const deleteAreaById = async (id) => {
    try {
        const deletedArea = await areaRepository.deleteAreaById(id);
        if (!deletedArea) {
            return { success: false, error: 'Area not found', status: 404 };
        }
        logger.info(`Area deleted with id: ${id}`);
        return { success: true, data: deletedArea };
    } catch (error) {
        logger.error(`Error deleting area by id: ${error.message}`);
        return { success: false, error: 'Failed to delete area', status: 500 };
    }
};

const getAllAreas = async (limit, offset) => {
    try {
        const areas = await areaRepository.getAllAreas(limit, offset);
        logger.info('All areas retrieved');
        return { success: true, data: areas };
    } catch (error) {
        logger.error(`Error retrieving all areas: ${error.message}`);
        return { success: false, error: 'Failed to retrieve all areas', status: 500 };
    }
};

const getAreaByName = async (name) => {
    try {
        const area = await areaRepository.findAreaByName(name);
        if (!area) {
            return { success: false, error: 'Area not found', status: 404 };
        }
        logger.info(`Area retrieved with name: ${name}`);
        return { success: true, data: area };
    } catch (error) {
        logger.error(`Error retrieving area by name: ${error.message}`);
        return { success: false, error: 'Failed to retrieve area by name', status: 500 };
    }
};

module.exports = {
    createArea,
    getAreaById,
    updateAreaById,
    deleteAreaById,
    getAllAreas,
    getAreaByName,
};
