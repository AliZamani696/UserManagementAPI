const express = require('express');
const app = express();
const appDb = require('./config/appDatabase');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerConfig/swaggerConfig');
const appConfig = require('./config/appConfig');
const swaggerDocument = require('./swagger.json');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userRouter = require('./routes/userRoute');
app.use('/api/users', userRouter);

const authRouter = require('./routes/authRoute');
app.use('/api/auth', authRouter);

appDb.connectDB();
const port = appConfig.port;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
