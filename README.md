# 🧠 GhostSkill - Train Your Mind With History's Greatest Thinkers

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

> **Disclaimer:** This is a mockup and not a real product.

## 🎯 Overview

GhostSkill is an innovative AI platform that trains thinking, decision-making, leadership, and life strategy using AI personas of historical figures. We don't teach information - **we train thinking**.

### ✨ Key Features

- **AI-Powered Mentorship**: Learn from historical figures like Chanakya, Marcus Aurelius, Napoleon Bonaparte, and Subhas Chandra Bose
- **Multi-Perspective Training**: Compare different strategic approaches to your challenges
- **Reflection System**: Structured reflection to transform insights into actionable wisdom
- **Growth Tracking**: Monitor your progress with a comprehensive dashboard
- **Beautiful Dark UI**: Elite, futuristic design with smooth animations

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.x
- **Font**: Inter (Google Fonts)
- **Icons**: Custom CSS + Emojis

### Backend (Coming Soon)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI API**: Python FastAPI

## 📂 Project Structure

```
GhostSkill/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── persona-selection/    # Persona selection page
│   ├── training/             # Training room (chat interface)
│   ├── reflection/           # Reflection page
│   └── dashboard/            # Growth dashboard
├── public/                   # Static assets
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies

```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GhostSkill
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📱 Features Walkthrough

### 1. **Landing Page**
- Stunning hero section with gradient text
- Four persona cards with hover effects
- "How It Works" section with 3-step process
- Smooth fade-in animations on load

### 2. **Persona Selection**
- Detailed persona cards with expertise tags
- Multi-select functionality
- Visual selection indicators
- Signature quotes from each historical figure
- Dynamic "Enter Training Room" button

### 3. **Training Room**
- Split-screen layout:
  - **Left**: Chat interface with message history
  - **Right**: Mindset Perspectives panel
- Real-time AI responses (mock API)
- Key Insight summary section
- Smooth scrolling and animations

### 4. **Reflection Page**
- Three structured sections:
  - 💥 Your Mistake
  - 📜 Your New Rule
  - 🎯 Your Next Action
- Form validation
- Auto-save to localStorage
- Redirect to dashboard on completion

### 5. **Growth Dashboard**
- Four metric cards:
  - Sessions Completed
  - Mindsets Trained
  - Decision Clarity
  - Discipline Streak
- Recent reflections history
- Quick action buttons

## 🎨 Design System

### Color Palette
```css
--background: #0a0a0f       /* Deep dark background */
--card: #13131a             /* Card background */
--primary: #6366f1          /* Indigo */
--accent: #8b5cf6           /* Violet */
--border: #27272f           /* Subtle borders */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 56-96px, Bold
- **Body**: 16-20px, Regular
- **Small Text**: 14px, Regular

### Components
- **Buttons**: Gradient backgrounds with hover scale effects
- **Cards**: Glassmorphism with subtle borders
- **Animations**: Smooth transitions (300ms) and floating effects

## 🧪 Current Status

### ✅ Completed (Frontend)
- [x] Project setup with Next.js + TypeScript
- [x] Landing page with hero and persona cards
- [x] Persona selection with multi-select
- [x] Training room with chat interface
- [x] Mindset switch panel
- [x] Reflection page with form
- [x] Growth dashboard with metrics
- [x] Responsive design
- [x] Dark theme implementation
- [x] Smooth animations

### 🚧 In Progress (Backend)
- [ ] Backend API setup
- [ ] Database integration
- [ ] AI model integration
- [ ] User authentication
- [ ] Real-time chat functionality

## 🗺️ Roadmap

### Phase 1: Backend Foundation
- Set up Express.js server
- Create RESTful API endpoints
- Integrate database (MongoDB/PostgreSQL)
- User authentication system

### Phase 2: AI Integration
- Connect to AI API (OpenAI/Custom)
- Implement persona-specific prompts
- Chat history management
- Response streaming

### Phase 3: Enhanced Features
- User profiles
- Session analytics
- Export reflections
- Social sharing
- Mobile app (React Native)

## 🎯 Personas Available

### 1. **Chanakya** 🟧
**Strategy & Statecraft**
- Ancient Indian philosopher and strategist
- Expertise: Political Strategy, Diplomacy, Long-term Planning

### 2. **Subhas Chandra Bose** 🟩
**Courage & Revolution**
- Indian revolutionary and freedom fighter
- Expertise: Leadership, Revolutionary Thinking, Courage

### 3. **Marcus Aurelius** 🔵
**Discipline & Inner Strength**
- Roman emperor and Stoic philosopher
- Expertise: Stoicism, Self-Discipline, Emotional Control

### 4. **Napoleon Bonaparte** 🟣
**Execution & War Strategy**
- French military genius and emperor
- Expertise: Military Strategy, Decisive Action, Tactical Thinking

## 🤝 Contributing

This is currently a personal project. Contributions, issues, and feature requests are welcome once the backend is complete.

## 📄 License

ISC © 2025

## 👤 Author

Built with ❤️ by the GhostSkill Team

---

**Note**: This is a mockup demonstrating UI/UX design and frontend implementation. AI responses are currently mocked and not connected to a real AI model.
