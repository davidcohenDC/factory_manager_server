const mongoose = require('mongoose');
const { Schema } = mongoose;
const { logger } = require('@config/');

const logSource = { source: 'MachineSchema' };

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
  machineState: {
    currentState: {
      type: String,
      enum: ['operational', 'stand-by', 'maintenance', 'anomaly', 'off'],
      default: 'off',
      required: true
    },
    anomalyDetails: [
      {
        type: String
      }
    ],
  },
  specifications: {
    powerConsumption: {
      normalRange: {
        min: {
          type: mongoose.Types.Decimal128,
        },
        max: {
          type: mongoose.Types.Decimal128,
        }
      }
    },
    emissions: {
      normalRange: {
        min: {
          type: mongoose.Types.Decimal128,
        },
        max: {
          type: mongoose.Types.Decimal128,
        }
      }
    },
    operatingTemperature: {
      normalRange: {
        min: {
          type: mongoose.Types.Decimal128,
        },
        max: {
          type: mongoose.Types.Decimal128,
        }
      }
    },
    humidity: {
      normalRange: {
        min: {
          type: mongoose.Types.Decimal128,
        },
        max: {
          type: mongoose.Types.Decimal128,
        }
      }
    }
  },
  turns: [
    {
      turn: {
        type: String,
        enum: ['morning', 'evening', 'night'],
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        first: String,
        last: String
      },
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
    sessions: [
      {
        powerOn: Date,
        powerOff: Date,
        duration: String // As above
      }
    ]
  },
  test: { type: Boolean }
});

machineSchema.pre('save', async function (next) {
  logger.info('Pre save hook called', logSource);

  if (this.log.sessions && this.log.sessions.length > 0) {
    const lastSession = this.log.sessions[this.log.sessions.length - 1];
    const currentSessionDuration =
        new Date(lastSession.powerOff).getTime() - new Date(lastSession.powerOn).getTime();

    if (!this.log.totalRunningTime) {
      this.log.totalRunningTime = 0;
    }

    this.log.totalRunningTime += currentSessionDuration;
  }

  logger.info('Total running time updated', logSource);
  next();
});

machineSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(`Error saving machine (MongoServerError): ${err.message}`, logSource);
      next(new Error('machine is already taken.'));
    } else {
      next(err);
    }
  } else {
    next();
  }
});

const Machine = mongoose.model('Machine', machineSchema);
module.exports = Machine;
