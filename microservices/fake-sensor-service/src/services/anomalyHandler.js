const {
  getMicroChangeValue,
  getFarOutsideValue
} = require('@utils/sensorUtils')
const { logger } = require('@config/')

let lastAnomalyValue = {} // To keep track of the last anomaly value per sensor

function handleAnomaly(currentValues, machine) {
  if (
    machine.machineState.anomalyDetails &&
    machine.machineState.anomalyDetails.length > 0
  ) {
    currentValues.anomaly = true
    logger.info(`Handling anomaly for machine ${machine.serial}`)

    machine.machineState.anomalyDetails.forEach((spec) => {
      const normalMax = parseFloat(
        machine.specifications[spec].normalRange.max.toString()
      )
      const currentValue = parseFloat(currentValues[spec])

      if (
        lastAnomalyValue[spec] &&
        currentValue === parseFloat(lastAnomalyValue[spec])
      ) {
        currentValues[spec] = getMicroChangeValue(currentValue)
      } else if (currentValue > normalMax) {
        currentValues[spec] = getMicroChangeValue(currentValues[spec])
      } else {
        const farOutsideValue = getFarOutsideValue(normalMax)
        currentValues[spec] = farOutsideValue
        lastAnomalyValue[spec] = farOutsideValue
      }
    })
  }
  return currentValues
}

module.exports = {
  handleAnomaly
}
