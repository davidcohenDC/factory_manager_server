const mongoose = require('mongoose')
const { Schema } = mongoose
const { logger } = require('@config/')

const logSource = { source: 'MachineSchema' }

const machineSchema = new Schema({
  machineId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    area: {
      type: String,
      required: true
    }
  },
  status: {
    operational: {
      type: Boolean,
      default: true,
      required: true
    },
    currentAnomalies: [
      {
        type: String
      }
    ]
  },
  specifications: {
    powerConsumption: {
      normalRange: {
        min: mongoose.Types.Decimal128,
        max: mongoose.Types.Decimal128
      },
      current: mongoose.Types.Decimal128
    },
    emissions: {
      normalRange: {
        min: mongoose.Types.Decimal128,
        max: mongoose.Types.Decimal128
      },
      current: mongoose.Types.Decimal128
    },
    operatingTemperature: {
      normalRange: {
        min: mongoose.Types.Decimal128,
        max: mongoose.Types.Decimal128
      },
      current: mongoose.Types.Decimal128
    },
    humidity: {
      normalRange: {
        min: mongoose.Types.Decimal128,
        max: mongoose.Types.Decimal128
      },
      current: mongoose.Types.Decimal128
    },
    otherSpecification: Schema.Types.Mixed
  },
  turns: [
    {
      turn: String,
      userId: Schema.Types.ObjectId,
      userName: String
    }
  ],
  maintenance: {
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    maintenanceHistory: [
      {
        date: Date,
        description: String
      }
    ]
  },
  log: {
    lastPowerOn: Date,
    lastPowerOff: Date,
    totalRunningTime: String, // Assuming you store duration as a string, otherwise you may need a different type
    sessions: [
      {
        powerOn: Date,
        powerOff: Date,
        duration: String // As above
      }
    ]
  },
  test: { type: Boolean }
})

machineSchema.pre('save', async function (next) {
  logger.info('Pre save hook called', logSource);

  if (this.log.sessions && this.log.sessions.length > 0) {
    // Get the latest session
    const lastSession = this.log.sessions[this.log.sessions.length - 1];

    // Calculate duration of the current session
    // Assuming that powerOn and powerOff are Date objects
    const currentSessionDuration = new Date(lastSession.powerOff).getTime() - new Date(lastSession.powerOn).getTime();

    // Check if totalRunningTime exists, if not initialize it
    if (!this.log.totalRunningTime) {
      this.log.totalRunningTime = 0;
    }

    // Add the duration of the current session to the total running time
    // Note: You need to ensure that totalRunningTime is in the same unit as the duration (e.g., milliseconds)
    this.log.totalRunningTime += currentSessionDuration;
  }

  logger.info('Total running time updated', logSource);
  next();
});

machineSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(`Error saving machine (MongoServerError): ${err.message}`, logSource)
      next(new Error('machine is already taken.'))
    } else {
      next(err)
    }
  } else {
    next()
  }
})


const Machine = mongoose.model('Machine', machineSchema)

module.exports = Machine
