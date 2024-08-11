const { getAllMachines, generateDataForMachine } = require('@services/machineService');
const { logger } = require('@config/');
const MachineSensor = require('@models/machineSensor');

/**
 * Generate and broadcast sensor data for all machines.
 * @param {Object} io - Socket.io instance.
 */
module.exports = (io) => async function generateSensorData() {
    logger.info('Starting the sensor data generation process...');
    try {
        const machines = await getAllMachines();
        const sensorNamespace = io.of('/sensors');
        for (const machine of machines) {
            try {
                logger.info(`Generating data for machine ID: ${machine.machineId}...`);

                // Generate sensor data for the machine
                const sensorData = await generateDataForMachine(machine);

                // Emit the generated sensor data to the specific room (machineId)
                sensorNamespace.emit('sensorData', sensorData);

                // Find the existing MachineSensor document or create a new one
                let machineSensor = await MachineSensor.findOne({ machineId: machine.machineId });
                if (!machineSensor) {
                    machineSensor = new MachineSensor({
                        machineId: machine.machineId,
                        sensorData: [sensorData],
                    });
                } else {
                    machineSensor.sensorData.push(sensorData);
                }

                // Save the MachineSensor document
                await machineSensor.save();

                logger.info(`Data generation for machine ID: ${machine.machineId} completed.`);
            } catch (error) {
                logger.error(`Failed to generate data for machine ID: ${machine.machineId}`, { error: error.message, stack: error.stack });
            }
        }

        logger.info('Sensor data generation process completed.');
    } catch (error) {
        logger.error('Error during the sensor data generation process:', { error: error.message, stack: error.stack });
    }

    // Schedule the next execution of this function
    setTimeout(() => generateSensorData(io), 2000);
};
