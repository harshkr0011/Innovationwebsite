# Startup Innovation & Mentorship Platform

A comprehensive full-stack platform designed to assist startup founders from ideation to launch. Powered by **Google Gemini AI**, this application bridges the gap between idea validation, team building, and market entry.

## 🚀 Key Features

### 🧠 AI-Powered Innovation Tools
Leveraging advanced AI models to provide real-time strategic assistance:
- **Idea Validator**: Analyzes startup concepts to provide viability scores, SWOT analysis, and actionable improvements.
- **Innovation Roadmap**: specific execution plans (MVP → Launch → Scale) tailored to your project type (SaaS, Mobile App, Hardware, etc.).
- **Lean Canvas Generator**: Automatically generates business model canvases from conversational descriptions.
- **Pitch Deck Creator**: Drafts investor-ready slide content including market sizing and value propositions.
- **AI Co-Founder**: Context-aware chat assistant for strategic advice.

### 🛠 Project Management Workspace
- **Kanban Boards**: Drag-and-drop task management (**Todo**, **In Progress**, **Done**).
- **Contribution Tracking**: GitHub-style activity heatmaps for team accountability.
- **Role Management**: Post open positions and recruit team members.

### 🤝 Community & Growth Ecosystem
- **Smart Team Builder**: Matching algorithm connecting founders with co-founders based on complementary skills and interests.
- **Mentor Connect**: Directory of industry experts with chat and formal mentorship request systems.
- **Grant & Funding Tracker**: Aggregated feed of scholarships, hackathons, and VC opportunities.
- **Launchpad**: Community feed to launch projects, get upvotes, and receive feedback (Product Hunt style).

## 💻 Tech Stack

**Frontend**
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS (Glassmorphism Design System)
- **Icons**: Lucide React
- **DnD**: @dnd-kit (Kanban board)

**Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Generative AI SDK (Gemini)
- **Authentication**: JWT (JSON Web Tokens)

**Robustness**
- **Smart Mock System**: Fallback mechanism ensuring demo functionality even without active AI API keys.

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Google Gemini API Key (Optional, for full AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Innovationwebsite
   ```

2. **Install Dependencies**
   ```bash
   # Install Server Dependencies
   cd server
   npm install

   # Install Client Dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
    Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Application**
   ```bash
   # Start Server (from server directory)
   npm run dev

   # Start Client (from client directory)
   npm run dev
   ```

## 📂 Project Structure
```
/client          # React Frontend
  /src/pages     # Application Routes (Dashboard, Profile, etc.)
  /src/components # Reusable UI Components
/server          # Node.js Backend
  /models        # Mongoose Schemas (User, Project, Grant, etc.)
  /routes        # API Endpoints (Auth, AI, Team, etc.)
```

## 🛡 License
This project is open source and available under the [MIT License](LICENSE).
