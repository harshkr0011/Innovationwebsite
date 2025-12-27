const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Project = require('../models/Project');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate('user', 'username email avatar coverImage');

        if (!profile) {
            // Create default profile if none exists
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            profile = new Profile({
                user: req.user.id,
                bio: 'Innovation enthusiast.',
                skills: ['Learner'],
                social: { github: '', linkedin: '' }
            });
            await profile.save();
            await profile.populate('user', 'username email avatar coverImage');
            return res.json(profile);
        }

        res.json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   GET api/profile/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get project count
        const projectCount = await Project.countDocuments({ user: userId });

        // Get total likes received across all projects
        const projects = await Project.find({ user: userId });
        const totalLikes = projects.reduce((sum, project) => sum + (project.likes?.length || 0), 0);

        // Get total comments received
        const totalComments = projects.reduce((sum, project) => sum + (project.comments?.length || 0), 0);

        // Calculate reputation (simple formula: projects * 10 + likes * 2 + comments)
        const reputation = projectCount * 10 + totalLikes * 2 + totalComments;

        res.json({
            projects: projectCount,
            contributions: totalComments,
            reputation: reputation,
            likes: totalLikes
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   GET api/profile/contributions
// @desc    Get user's contribution history across all projects
// @access  Private
router.get('/contributions', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all projects where user has contributions
        const projects = await Project.find({
            'contributions.user': userId
        }).select('title contributions');

        // Extract and flatten contributions
        const allContributions = [];
        projects.forEach(project => {
            if (project.contributions) {
                project.contributions.forEach(contribution => {
                    if (contribution.user && contribution.user.toString() === userId.toString()) {
                        allContributions.push({
                            ...contribution.toObject(),
                            projectTitle: project.title,
                            projectId: project._id
                        });
                    }
                });
            }
        });

        // Sort by timestamp (newest first)
        allContributions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(allContributions);
    } catch (err) {
        console.error('Error fetching contributions:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
        role,
        avatar,
        coverImage,
        username // Added username
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (role) profileFields.role = role;
    if (skills) {
        profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    }

    // Prepare User updates
    const userUpdates = {};
    if (avatar) userUpdates.avatar = avatar;
    if (coverImage) userUpdates.coverImage = coverImage;
    if (username) userUpdates.username = username;

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (githubusername) profileFields.social.github = githubusername;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            // Update User model if image fields are present
            if (Object.keys(userUpdates).length > 0) {
                await User.findByIdAndUpdate(req.user.id, { $set: userUpdates });
            }

            return res.json(profile);
        }

        // Create
        // Create
        profile = new Profile(profileFields);
        await profile.save();

        // Update User model if image fields are present
        if (Object.keys(userUpdates).length > 0) {
            await User.findByIdAndUpdate(req.user.id, { $set: userUpdates });
        }

        res.json(profile);
    } catch (err) {
        console.error('Error saving profile:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
