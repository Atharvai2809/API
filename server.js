const express = require('express');
const mongoose = require('mongoose');
const userPrefRoutes = require('./userprefroutes'); 

const app = express();
const port = process.env.PORT || 3000;

// Update the mongoose connection settings
mongoose.connect('mongodb://localhost/sample', {
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB', error);
});

app.use(express.json());
app.use(userPrefRoutes);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


