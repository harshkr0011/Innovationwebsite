const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Launch = require('../models/Launch');
const Project = require('../models/Project');
const User = require('../models/User');

// @route   GET api/launch
// @desc    Get all launches (feed)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const launches = await Launch.find()
            .populate('launcher', 'username avatar')
            .populate('project', 'title description')
            .sort({ createdAt: -1 });
        res.json(launches);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/launch
// @desc    Launch a project
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { projectId, title, tagline, description, tags, images, websiteUrl } = req.body;

        // Verify project ownership
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to launch this project' });
        }

        // Check if already launched
        const existingLaunch = await Launch.findOne({ project: projectId });
        if (existingLaunch) {
            return res.status(400).json({ msg: 'Project already launched' });
        }

        const newLaunch = new Launch({
            project: projectId,
            launcher: req.user.id,
            title: title || project.title,
            tagline,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            images: images || [],
            websiteUrl
        });

        const launch = await newLaunch.save();

        // Populate for immediate return
        await launch.populate('launcher', 'username avatar');

        res.json(launch);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/launch/:id/upvote
// @desc    Upvote/Unupvote a launch
// @access  Private
router.put('/:id/upvote', auth, async (req, res) => {
    try {
        const launch = await Launch.findById(req.params.id);
        if (!launch) {
            return res.status(404).json({ msg: 'Launch not found' });
        }

        // Check if already upvoted
        if (launch.upvotes.includes(req.user.id)) {
            // Remove upvote
            launch.upvotes = launch.upvotes.filter(id => id.toString() !== req.user.id);
        } else {
            // Add upvote
            launch.upvotes.push(req.user.id);
        }

        await launch.save();
        res.json(launch.upvotes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/launch/:id/comment
// @desc    Add a comment
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const launch = await Launch.findById(req.params.id);
        if (!launch) {
            return res.status(404).json({ msg: 'Launch not found' });
        }

        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        launch.comments.unshift(newComment);
        await launch.save();

        // Re-fetch to populate user details in comment
        const updatedLaunch = await Launch.findById(req.params.id)
            .populate('comments.user', 'username avatar');

        res.json(updatedLaunch.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
