# 🚀 COSMOS  
### Internship Preparation & Placement Readiness SaaS Platform

COSMOS is a **full-stack MERN SaaS platform** designed for **colleges and universities** to track and improve **student placement readiness**.

The system provides **AI-powered resume analysis, adaptive assessments, performance analytics, and institutional dashboards**.

It includes **three role-based portals**:

- 🎓 Student Portal
- 👨‍🏫 Faculty Portal
- 🏫 TPO (Training & Placement Officer) Admin Portal

Institutions subscribe via **Razorpay payment**, after which they receive **unique access codes for students and faculty**.

---

# 🌐 Platform Overview

COSMOS provides a **single platform for institutions to manage placement preparation**.

Students improve through:

- Skill-based tests
- Resume analysis
- Performance tracking

Faculty monitor:

- Test creation
- Student progress
- Class performance

TPO admins view:

- Institution-wide analytics
- Placement readiness
- Student performance distribution

---

# ✨ Core Features

## 🎓 Student Portal

Students can track their **placement preparation progress**.

### Features

- Resume upload & AI analysis
- Resume scoring system
- Skill extraction from resume
- Resume improvement suggestions
- Attempt skill-based tests
- Track performance history
- View upcoming tests
- Personal dashboard

### Student Dashboard Metrics

- Tests Taken
- Average Score
- Resume Score
- Overall Placement Readiness

---

## 👨‍🏫 Faculty Portal

Faculty members manage tests and monitor students.

### Features

- Create placement preparation tests
- Add question sets
- View student attempts
- Monitor class performance
- View analytics of student scores
- Identify weak areas in student performance

---

## 🏫 TPO Admin Portal

The **Training & Placement Officer (TPO)** manages the entire institution.

### Features

- Monitor overall student readiness
- View institutional analytics
- Track faculty activity
- View student performance distribution
- Analyze placement readiness trends
- Manage faculty accounts

---

# 💳 SaaS Registration & Payment

Institutions must register through the platform.

### Registration Flow

1. TPO signs up for the institution
2. One-time subscription payment via **Razorpay**
3. Institution account activated
4. System generates:

- **Faculty Access Code**
- **Student Access Code**

These codes allow users to join the platform.

---

# 🧠 AI Resume Analysis

Students upload resumes which are analyzed using **AI models**.

### AI Analysis Includes

- Resume structure evaluation
- Skill extraction
- Resume scoring
- Improvement suggestions

### Example Output


Resume Score: 90 / 100
Excellent Resume


### Skills Detected

- Automated Testing
- API Testing
- Manual Testing
- SQL
- Bug Tracking Systems
- Agile Methodologies
- Critical Thinking

### Suggestions Generated

- Replace generic email with professional email
- Add projects section
- Improve experience bullet points
- Avoid repeating metrics

---

# 📊 Analytics & Dashboards

COSMOS provides **data-driven analytics dashboards**.

### Student Analytics

- Test score distribution
- Performance trends
- Top performers
- Skill gap insights

### Faculty Analytics

- Student progress
- Test performance
- Attempt analysis

### TPO Analytics

- Institutional readiness
- Pass rate
- Performance distribution
- Overall placement readiness score

---

# 🏗️ Tech Stack

## Frontend

- React.js
- Vite
- TailwindCSS
- Axios
- Chart.js / Recharts

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## AI Integration

- Gemini API (Resume Analysis)

## Payment Gateway

- Razorpay

## Authentication

- JWT Authentication

---

# 🧩 System Architecture


React Frontend (Vite)
│
│ REST APIs
▼
Node.js + Express Backend
│
▼
MongoDB Database
│
├── AI Services (Gemini API)
└── Payment Gateway (Razorpay)


---

# 📁 Project Structure


COSMOS
│
├── client
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ │ ├── student
│ │ │ ├── faculty
│ │ │ └── admin
│ │ ├── services
│ │ └── utils
│
├── server
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middleware
│ ├── services
│ └── config
│
├── README.md
└── package.json


---

# ⚙️ Installation

Clone the repository


git clone https://github.com/yourusername/cosmos.git


Navigate to project


cd cosmos


---

# Backend Setup


cd server
npm install


Create `.env`


PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret


Run backend


npm run dev


---

# Frontend Setup


cd client
npm install
npm run dev


Frontend runs on:


http://localhost:5173


---




---

# 🔑 Institution Code System

After successful registration, institutions receive:


Faculty Code
Student Code


These codes are required during signup to ensure **only authorized users join the institution**.

---

# 📈 Example Analytics Metrics


Total Students: 1
Average Score: 44.4
Pass Rate: 100%
Average Attempts: 3


---

# 🧪 Test System

Faculty can create tests with:

- Multiple questions
- Time limits
- Score evaluation

Students can:

- Attempt tests
- View results
- Track improvements

---

# 📊 Resume Readiness Score

Student readiness is calculated based on:


Resume Quality
Test Performance
Skill Coverage


Example:


Resume Score: 90 / 100
Placement Readiness Score: 4.4 / 10


---







