const {
  getAllMachines,
  generateDataForMachine
} = require('@services/machineService');
const { logger } = require('@config/');
const MachineSensor = require('@models/machineSensor');

/**
 * Generate and broadcast sensor data for all machines.
 * @param {Object} io - Socket.io instance.
 */
module.exports = (io) =>
    async function generateSensorData() {
      logger.info('Starting the sensor data generation process...');
      try {
        const machines = await getAllMachines();
        const sensorNamespace = io.of('/sensors');
        for (const machine of machines) {
          try {
            logger.info(`Generating data for serial: ${machine.serial}...`);

            // Generate sensor data for the machine
            const sensorData = await generateDataForMachine(machine);

            // Emit the generated sensor data to the specific room (serial)
            sensorNamespace.emit('sensorData', sensorData);

            // Find the existing MachineSensor document or create a new one
            let machineSensor = await MachineSensor.findOne({
              serial: machine.serial
            });
            if (!machineSensor) {
              machineSensor = new MachineSensor({
                serial: machine.serial,
                sensorData: [sensorData]
              });
            } else {
              machineSensor.sensorData.push(sensorData);
            }

            // Save the MachineSensor document
            await machineSensor.save();

            logger.info(
                `Data generation for serial: ${machine.serial} completed.`
            );
          } catch (error) {
            logger.error(
                `Failed to generate data for serial: ${machine.serial}`,
                { error: error.message, stack: error.stack }
            );
          }
        }

        logger.info('Sensor data generation process completed.');
      } catch (error) {
        logger.error('Error during the sensor data generation process:', {
          error: error.message,
          stack: error.stack
        });
      }

      // Schedule the next execution of this function
      setTimeout(() => generateSensorData(io), 5000);
  }
