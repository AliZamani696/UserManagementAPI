const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'مستندات ای‌پی‌آی مدیریت کاربران',
        },
        servers: [
            {
                url: 'http://localhost:9090',
            },
        ],
    },
    apis: [`./../routes/*.js`, `./../server.js`],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
