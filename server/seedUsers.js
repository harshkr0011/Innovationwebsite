const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
    {
        username: "Sarah Design",
        email: "sarah@example.com",
        password: "password123",
        role: "Student",
        skills: ["UI/UX", "Figma", "Adobe XD", "Branding"],
        bio: "Creative designer looking for a developer to build a mobile app.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        lookingFor: ["Developer"]
    },
    {
        username: "Mike Code",
        email: "mike@example.com",
        password: "password123",
        role: "Student",
        skills: ["React", "Node.js", "MongoDB", "Python"],
        bio: "Full stack developer interested in AI and fintech projects.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        lookingFor: ["Designer", "Product Manager"]
    },
    {
        username: "Alex Product",
        email: "alex@example.com",
        password: "password123",
        role: "Student",
        skills: ["Product Management", "Agile", "SEO", "Marketing"],
        bio: "Aspiring PM looking to lead a diverse team.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        lookingFor: ["Developer"]
    },
    {
        username: "Dr. Emily Omni",
        email: "emily@example.com",
        password: "password123",
        role: "Mentor",
        skills: ["Business Strategy", "Fundraising", "Leadership"],
        bio: "Experienced entrepreneur helping students launch startups.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        lookingFor: []
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/innovation-platform');
        console.log('MongoDB Connected');

        // Check if users already exist to avoid duplicates or clearing meaningful data
        const count = await User.countDocuments();
        if (count > 2) { // Assuming admin/current user might exist
            console.log('Database already has users. Skipping seed to prevent overwrite.');
            process.exit();
        }

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = await Promise.all(users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        await User.insertMany(hashedUsers);
        console.log('Test Users Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
