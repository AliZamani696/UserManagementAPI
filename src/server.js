const express = require('express');
const app = express();
const appDb = require('./config/appDatabase');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerConfig/swaggerConfig');
const appConfig = require('./config/appConfig');
const swaggerDocument = require('./swagger.json');

// app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/userRoute');
app.use('/api/users', userRouter);

const authRouter = require('./routes/authRoute');
app.use('/api/auth', authRouter);

appDb.connectDB();
const port = appConfig.port;

app.listen(port, () => {
    console.log('server is running', port);
});
