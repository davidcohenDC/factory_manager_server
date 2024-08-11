const Machine = require('@models/machine');
const MachineSensor = require('@models/machineSensor');
const { handleAnomaly } = require('@services/anomalyHandler');
const { generateRandomSensorData } = require('@services/sensorDataGenerator');
const { handleOffState } = require('@services/stateHandler');
const { logger } = require('@config/');

/**
 * Fetch all machines from the database.
 * @returns {Promise<Array>} List of machines.
 */
async function getAllMachines() {
    logger.info('Fetching all machines from the database...');
    try {
        const machines = await Machine.find();
        logger.info(`Successfully fetched ${machines.length} machines.`);
        return machines;
    } catch (error) {
        logger.error('Error fetching machines:', { error });
        throw error;
    }
}

/**
 * Generate sensor data for a specific machine.
 * @param {Object} machine - Machine object.
 * @returns {Promise<Object>} Generated sensor data.
 */
async function generateDataForMachine(machine) {
    logger.info(`Generating sensor data for machine ID: ${machine.machineId}...`);
    try {
        let currentValues;

        if (machine.machineState.currentState === 'anomaly') {
            currentValues = generateRandomSensorData(machine.specifications);
            currentValues = handleAnomaly(currentValues, machine);
        } else if (machine.machineState.currentState === 'off') {
            logger.info(`Machine ID: ${machine.machineId} is currently off.`);
            currentValues = handleOffState();
        } else {
            currentValues = generateRandomSensorData(machine.specifications);
        }

        let machineSensor = await MachineSensor.findOne({ machineId: machine.machineId });
        if (!machineSensor) {
            machineSensor = new MachineSensor({
                machineId: machine.machineId,
                sensorData: [currentValues],
            });
        } else {
            machineSensor.sensorData.push(currentValues);
        }

        await machineSensor.save();
        logger.info(`Sensor data for machine ID: ${machine.machineId} saved successfully.`);

        return {
            machineId: machine.machineId,
            machineName: machine.name,
            ...currentValues,
            currentState: machine.machineState.currentState,
            anomalyDetails: machine.machineState.anomalyDetails,
        };
    } catch (error) {
        logger.error(`Error generating sensor data for machine ID: ${machine.machineId}`, { error });
        throw error;
    }
}

module.exports = {
    getAllMachines,
    generateDataForMachine,
};
