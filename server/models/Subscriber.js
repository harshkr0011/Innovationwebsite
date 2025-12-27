const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
