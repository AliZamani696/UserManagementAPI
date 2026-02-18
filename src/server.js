const express = require('express');
const app = express();
const appConfig = require('./config/appConf');
require('dotenv').config();

app.use(express.json());

const userRouter = require('./routes/userRoute');
app.use('/api/auth/', userRouter);

const port = appConfig.port;

app.listen(port, () => {
    console.log('server is running', port);
});
