const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoUri = process.env.DB_URI;
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true}).then((db) => {
    console.log('Connected to Database');
});

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));