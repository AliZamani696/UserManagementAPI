const winston = require('winston');
const chalk = require('chalk');

const customFormat = winston.format.printf(
    ({ level, message, timestamp, stack }) => {
        let logMessage = `${chalk.gray(`[${timestamp}]`)} ${level}: ${message}`;

        if (stack) {
            logMessage += `\n${chalk.red(stack)}`;
        }
        return logMessage;
    }
);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                customFormat
            ),
        }),
        new winston.transports.File({
            filename: 'logs/database.log',
            level: 'error',
        }),
    ],
});

module.exports = logger;
