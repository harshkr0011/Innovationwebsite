# Startup Innovation & Mentorship Platform

A production-ready startup ecosystem platform built for ideation, validation, collaboration, mentorship, and launch planning. The project combines a React frontend, Express API, MongoDB persistence, and Google Gemini AI capabilities to help founders evaluate ideas, build momentum, and connect with the right people.

The application is designed for both demo use and real deployment workflows, with environment-based configuration for local development and cloud hosting.

## Overview

The platform includes:
- founder authentication and profile management
- project sharing and launch tracking
- AI-powered idea validation and roadmap generation
- mentor directory and startup discovery tools
- newsletter and community engagement flows
- modern responsive dashboard UI for product-focused teams

This repo is organized into two deployment targets:
- `client/` — React + Vite frontend
- `server/` — Express + MongoDB backend

## Features

### Founder workspace
- Secure JWT authentication
- User profile and role-based onboarding
- Project publishing and team visibility
- Launch feed for startup updates and traction tracking

### AI-powered startup support
- Idea validation and market-fit scoring
- Roadmap generation for MVP and launch stages
- AI-assisted business insight workflows
- Investor and founder readiness support

### Community and mentorship
- Startup opportunities and founder signals
- Mentor directory with expertise tagging
- Launch and feedback visibility
- Newsletter signup for product updates

### Product design
- Modern dark UI with advanced glassmorphism styling
- Responsive dashboard layout for desktop and mobile
- Clean navigation and investor-style startup metrics

## Tech Stack

Frontend
- React 19
- Vite
- React Router
- Modern CSS design system

Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT-based auth
- Google Gemini AI SDK

Deployment
- Render for backend hosting
- Vercel for frontend hosting
- MongoDB Atlas for database

## Repository Structure

```text
Innovationwebsite/
├── client/                  # Frontend app
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/                  # Backend API
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── index.js
│   └── package.json
├── .gitignore
├── README.md
├── package-lock.json
└── package.json
```

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas account or local MongoDB instance
- Google Gemini API key (optional, depending on AI feature usage)

### 1. Install frontend dependencies

```bash
cd client
npm install
```

### 2. Install backend dependencies

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/innovation-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

For Vite frontend development, create a `.env` file inside `client/` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the apps

Start the server:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Then open the local Vite app in the browser.

## Production Deployment Architecture

This project is meant to run with separate frontend and backend deployment targets:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Backend deployment (Render)
Use this configuration:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables to set in Render:

```env
PORT=10000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/innovation-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://innovationwebsite-wyqg.vercel.app
CLIENT_URL=https://innovationwebsite-wyqg.vercel.app
```

### Frontend deployment (Vercel)
Use this configuration:

- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Output Directory: `dist`

Environment variables to set in Vercel:

```env
VITE_API_URL=https://<your-render-app-name>.onrender.com/api
```

## Security Notes

- Never commit `.env` files to source control
- Use environment variables in deployment platforms
- Keep JWT secrets and API keys out of the repository
- Use explicit CORS allowlists instead of wildcard origins in production

## Current Status

The project currently includes:
- working authentication flow
- production-safe API URL handling
- responsive modern startup UI
- dashboard, projects, AI studio, mentors, launch, and profile modules
- backend CORS configuration for Vercel + Render deployment

## License

This project is intended for portfolio and startup experimentation use. License terms can be added according to your preferred distribution model.
