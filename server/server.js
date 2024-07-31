const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome! Backend is up and running.');
});

const employeeRoutes = require('./Routes/EmployeRoutes');
app.use('/employees', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed", error);
    });
