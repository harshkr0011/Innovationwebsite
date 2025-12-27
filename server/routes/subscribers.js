const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// @route   POST api/subscribers/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Please provide a valid email address' });
        }

        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            return res.status(400).json({ msg: 'This email is already subscribed' });
        }

        subscriber = new Subscriber({ email });
        await subscriber.save();

        res.json({ msg: 'Successfully subscribed to newsletter!' });
    } catch (err) {
        console.error('Subscription error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
