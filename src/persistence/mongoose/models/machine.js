const mongoose = require('mongoose');
const { Schema } = mongoose;
const { logWithSource } = require('@config/');
const logger = logWithSource('MachineSchema');

const machineSchema = new Schema({
  serial: {
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
      enum: ['operational', 'anomaly', 'off'],
      required: true
    },
    anomalyDetails: {
      type: [String],
      enum: ['powerConsumption', 'emissions', 'operatingTemperature', 'vibration', 'pressure']
    }
  },
  specifications: {
    powerConsumption: {
      measurementUnit: String,
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
      measurementUnit: String,
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
      measurementUnit: String,
      normalRange: {
        min: {
          type: mongoose.Types.Decimal128,
        },
        max: {
          type: mongoose.Types.Decimal128,
        }
      }
    },
    vibration: {
      measurementUnit: String,
      normalRange: {
        min: {
          type: mongoose.Types.Decimal128,
        },
        max: {
          type: mongoose.Types.Decimal128,
        }
      }
    },
    pressure: {
      measurementUnit: String,
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
        ref: 'User',
        required: true
      },
      name: {
        first: String,
        last: String
      }
    },
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


// Post-save hook for catching errors
machineSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(`Duplicate key error (MongoServerError): E11000 duplicate key error on serial: ${JSON.stringify(err.keyValue)}`);
      return next(new Error('Machine with this serial already exists.'));
    } else {
      logger.error(`Error saving machine: ${err.message}`);
      return next(err);
    }
  }
  next();
});

// Post-validate hook
machineSchema.post('validate', function (doc) {
  logger.info(`Machine with id: ${doc._id}, Serial: ${doc.serial} passed validation.`);
});

// Post-update hook
machineSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    logger.info(`Machine with id: ${doc._id}, Serial: ${doc.serial} was updated.`);
  } else {
    logger.warn('No machine was found to update.');
  }
});

// Post-delete hook
machineSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    logger.info(`Machine with id: ${doc._id}, Email: ${doc.serial} was deleted.`);
  } else {
    logger.warn('No machine was found to delete.');
  }
});

const Machine = mongoose.model('Machine', machineSchema);
module.exports = Machine;
