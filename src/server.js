const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(9090, () => {
    console.log('server is running');
});
