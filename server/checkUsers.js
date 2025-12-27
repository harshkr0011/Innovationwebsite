const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/innovation-platform');
        const count = await User.countDocuments();
        console.log(`Total Users: ${count}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
