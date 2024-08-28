const { getAllAreas } = require('@services/areaService');
const { logger } = require('@config/');

module.exports = (io) =>
    async function generateAreaData() {
        logger.info('Starting emit Area process...');
        try {
            const areas = await getAllAreas();
            const areaNamespace = io.of('/areas');
            areaNamespace.emit('areas',areas)
            logger.info('Areas data emit completed.');
        } catch (error) {
            logger.error('Error during emit area data process:', {
                error: error.message,
                stack: error.stack
            });
        }

        // Schedule the next execution of this function
        setTimeout(() => generateAreaData(io), 5000);
    }
