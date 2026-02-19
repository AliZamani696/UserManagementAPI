const morgan = require('morgan');
const logger = require('./requestLogger');

app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);
