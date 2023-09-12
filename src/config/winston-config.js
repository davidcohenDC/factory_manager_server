const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Personalizzazione dei livelli di log
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
        trace: 'cyan'
    }
};

winston.addColors(customLevels.colors);

// Daily rotation transport configuration
const dailyRotateFileTransport = new DailyRotateFile({
    dirname: 'logs',
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});


// Console transport configuration
const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
});

const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [consoleTransport, dailyRotateFileTransport]
});

// Impostare il livello di log in base all'ambiente
if (process.env.NODE_ENV === 'development') {
    logger.level = 'trace';
} else {
    logger.level = 'info';
}

module.exports = logger;
