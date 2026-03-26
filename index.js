const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const supabase = require('./supabase');
const { startScheduler } = require('./jobs/scheduler');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./User/user'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/holdings', require('./routes/holdings'));
app.use('/api/cleaners', require('./routes/cleaners'));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Airly application." });
});

startScheduler();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});