const express = require('express');
const userRouter = require('./routes/userRoute');
const app = express();
require('dotenv').config();
app.use(express.json());

app.use('/api/auth/', userRouter);

let port = process.env.PORT || 9090;
app.listen(port, () => {
    console.log('server is running', port);
});
