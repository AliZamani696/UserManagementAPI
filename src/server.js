const express = require('express');
const app = express();
const appDb = require('./config/appDatabase');
const appConfig = require('./config/appConfig');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/userRoute');
app.use('/api/users', userRouter);

const authRouter = require('./routes/authRoute');
app.use('/api/auth/', authRouter);

appDb.connectDB();
const port = appConfig.port;

app.listen(port, () => {
    console.log('server is running', port);
});
