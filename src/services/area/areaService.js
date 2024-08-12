const areaRepository = require('@repositories/areaRepository');
const { logger } = require('@config/');

const createArea = async (areaData) => {
    try {
        const area = await areaRepository.createArea(areaData);
        logger.info(`Area created with id: ${area._id}`);
        return { success: true, data: area };
    } catch (error) {
        logger.error(`Error creating area: ${error.message}`);
        return { success: false, error: 'Failed to create area' };
    }
}

const getAreaById = async (id) => {
    try {
        const area = await areaRepository.findAreaById(id);
        logger.info(`Area retrieved with id: ${id}`);
        return area ? { success: true, data: area } : { success: false, error: 'Area not found' };
    } catch (error) {
        logger.error(`Error retrieving area by id: ${error.message}`);
        return { success: false, error: 'Failed to retrieve area by id' };
    }
}

const updateAreaById = async (id, updateData) => {
    try {
        const updatedArea = await areaRepository.updateAreaById(id, updateData);
        logger.info(`Area updated with id: ${id}`);
        return { success: true, data: updatedArea };
    } catch (error) {
        logger.error(`Error updating area by id: ${error.message}`);
        return { success: false, error: 'Failed to update area' };
    }
}

const deleteAreaById = async (id) => {
    try {
        const deletedArea = await areaRepository.deleteAreaById(id);
        logger.info(`Area deleted with id: ${id}`);
        return { success: true, data: deletedArea };
    } catch (error) {
        logger.error(`Error deleting area by id: ${error.message}`);
        return { success: false, error: 'Failed to delete area' };
    }
}

const getAllAreas = async (limit, offset) => {
    try {
        const areas = await areaRepository.getAllAreas(limit, offset);
        logger.info(`Retrieved all areas`);
        return { success: true, data: areas };
    } catch (error) {
        logger.error(`Error retrieving all areas: ${error.message}`);
        return { success: false, error: 'Failed to retrieve all areas' };
    }
}

const getAreaByName = async (name) => {
    try {
        const area = await areaRepository.findAreaByName(name);
        logger.info(`Area retrieved with name: ${name}`);
        return area ? { success: true, data: area } : { success: false, error: 'Area not found' };
    } catch (error) {
        logger.error(`Error retrieving area by name: ${error.message}`);
        return { success: false, error: 'Failed to retrieve area by name' };
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