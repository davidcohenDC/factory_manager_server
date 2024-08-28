const Area = require("@models/area")
const { logger } = require('@config/')

async function getAllAreas() {
    logger.info('Fetching all areas from the database...')
    try {
        const areas = await Area.find()
        logger.info(`Successfully fetched ${areas.length} machines.`)
        return areas
    } catch (error) {
        logger.error('Error fetching machines:', { error })
        throw error
    }
}

module.exports = {
    getAllAreas
}