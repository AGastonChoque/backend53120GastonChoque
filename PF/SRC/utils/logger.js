import winston from 'winston';

import __dirname from './utils.js';
import config from '../config.js';


const customErrLevels = {
    levels: { debug: 5, http: 4, info: 3, warning: 2, error: 1, fatal: 0}
}

const devLogger = new winston.createLogger({
    levels: customErrLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug" })
    ]
})

const prodLogger = new winston.createLogger({
    levels: customErrLevels.levels,
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ level: "info", filename: `${__dirname}/../logs/errors.log` })
    ]
})

const testLogger = new winston.createLogger({
    levels: customErrLevels.levels,
    transports: [
        new winston.transports.Console({ level: "debug" }),
        new winston.transports.File({ level: "debug", filename: `${__dirname}/../logs/errors.log` })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = devLogger
    /* req.logger = prodLogger */
    /* req.logger = testLogger */
    next()
}

