# Faculty Portal - Complete UI Documentation

## 🎯 Overview
A complete **Faculty Portal** built with **React + Tailwind CSS** featuring a **green/emerald theme**. This portal allows faculty members to manage questions, create tests, and analyze student performance.

---

## 📁 Project Structure

```
src/
├── components/faculty/
│   ├── Button.jsx           # Reusable button component (primary, secondary, outline, danger)
│   ├── Card.jsx             # Card container with optional title and icon
│   ├── InputField.jsx       # Form input with label, validation, icons
│   ├── Modal.jsx            # Modal dialog (sm, md, lg, xl sizes)
│   ├── Table.jsx            # Data table with custom column rendering
│   └── Navbar.jsx           # Top navigation bar with logout
│
├── layouts/
│   └── FacultyLayout.jsx    # Main layout with sidebar navigation
│
├── pages/faculty/
│   ├── FacultySignup.jsx    # Faculty registration page
│   ├── FacultyLogin.jsx     # Faculty authentication page
│   ├── FacultyDashboard.jsx # Main dashboard with stats and tables
│   ├── ManageQuestions.jsx  # Create and view questions
│   ├── ManageTests.jsx      # Create and schedule tests
│   └── TestAnalytics.jsx    # Comprehensive test analytics
│
└── services/
    └── api.js               # Axios instance with API methods
```

---

## 🚀 Features

### 1. **Authentication**
- **Signup**: Full Name, Email, Password, Faculty Code, College Faculty ID, Department
- **Login**: Email, Password, Faculty Code
- Token-based authentication stored in localStorage
- Automatic redirect to dashboard on success

### 2. **Faculty Dashboard**
- **Stats Cards**:
  - Total Tests Created
  - Average Test Score
  - Upcoming Tests Count
- **Recent Tests Table**: Shows test performance history
- **Upcoming Tests Table**: Displays scheduled tests

### 3. **Manage Questions**
- **Create Questions** via Modal:
  - Question Text (textarea)
  - 4 Multiple Choice Options
  - Correct Answer (dropdown)
  - Subject & Topic Tags
- **Questions Table**: View all created questions with filters

### 4. **Manage Tests**
- **Create Tests**:
  - Test Title & Duration
  - Multi-select Questions (checkbox list)
  - Schedule Start/End Time (datetime-local)
- **Tests Grid**: Card-based view with:
  - Test metadata (questions, duration, schedule)
  - Status badges (scheduled/draft)
  - Analytics navigation button

### 5. **Test Analytics**
- **Summary Cards** (6 metrics):
  - Total Attempts
  - Average Score & Percentage
  - Highest/Lowest Score
  - Pass Rate
- **Charts** (placeholder boxes):
  - Score Distribution
  - Question Difficulty Ranking
- **Tables**:
  - Question-wise Accuracy with progress bars
  - Top 5 Performers (ranked)
  - Bottom 5 Performers needing support

---

## 🎨 Design System

### Color Theme
```css
Primary:   emerald-600 (#059669)
Hover:     emerald-700 (#047857)
Light:     emerald-50  (#ECFDF5)
Secondary: green-600   (#16A34A)
```

### Component Variants
**Button**: `primary`, `secondary`, `outline`, `danger`
**Modal**: `sm`, `md`, `lg`, `xl`
**Card**: Rounded-xl with emerald border and shadow

---

## 🔌 API Integration

### Base Configuration
```javascript
Base URL: http://localhost:5000/api
Headers: Authorization: Bearer <token>
```

### API Endpoints

#### **Auth**
```
POST /api/faculty/signup
POST /api/faculty/login
```

#### **Dashboard**
```
GET /api/faculty/dashboard/stats
GET /api/faculty/dashboard/recent-tests
GET /api/faculty/dashboard/upcoming-tests
```

#### **Questions**
```
POST /api/faculty/questions
GET  /api/faculty/questions
GET  /api/faculty/questions/dropdown?facultyId=xxx
```

#### **Tests**
```
POST /api/faculty/tests/create
GET  /api/faculty/tests
GET  /api/faculty/tests/:id
```

#### **Analytics**
```
GET /api/faculty/tests/:id/summary
GET /api/faculty/tests/:id/questions
GET /api/faculty/tests/:id/students
```

---

## 🛣️ Routing

```jsx
/faculty/signup              → FacultySignup
/faculty/login               → FacultyLogin

/faculty/                    → FacultyLayout (Protected)
  ├── dashboard              → FacultyDashboard
  ├── questions              → ManageQuestions
  ├── tests                  → ManageTests
  └── tests/:id/analytics    → TestAnalytics
```

---

## 📦 Component API Reference

### **Button**
```jsx
<Button 
  variant="primary|secondary|outline|danger"
  fullWidth={boolean}
  disabled={boolean}
  onClick={function}
>
  Button Text
</Button>
```

### **InputField**
```jsx
<InputField
  label="Label Text"
  type="text|email|password|number|datetime-local"
  name="fieldName"
  value={value}
  onChange={handleChange}
  placeholder="Placeholder"
  required={boolean}
  error="Error message"
  icon={<svg>...</svg>}
/>
```

### **Modal**
```jsx
<Modal
  isOpen={boolean}
  onClose={function}
  title="Modal Title"
  size="sm|md|lg|xl"
>
  Modal Content
</Modal>
```

### **Table**
```jsx
<Table
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Score', render: (row) => `${row.score}%` }
  ]}
  data={arrayOfObjects}
/>
```

### **Card**
```jsx
<Card 
  title="Card Title"
  icon={<svg>...</svg>}
  className="additional-classes"
  onClick={function}
>
  Card Content
</Card>
```

---

## 🔐 Authentication Flow

1. **Signup** → POST `/api/faculty/signup` → Redirect to Login
2. **Login** → POST `/api/faculty/login` → Save token + facultyId + facultyName
3. **Dashboard Access** → Check token → Show content
4. **Logout** → Clear localStorage → Redirect to Login

### LocalStorage Keys
```
facultyToken    → JWT authentication token
facultyName     → Faculty display name
facultyId       → Faculty unique identifier
```

---

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: 
  - Hidden sidebar with FAB toggle button
  - Overlay backdrop when open
  - Grid adjusts to single column
  - Tables scroll horizontally

---

## 🧪 Mock Data (Fallback)

All pages include fallback mock data for development/testing when API calls fail:

- **Dashboard**: 12 tests, 78.5% avg score, 3 upcoming
- **Questions**: 3 sample questions across different subjects
- **Tests**: 2 mock tests (scheduled + draft)
- **Analytics**: Full dataset with 45 attempts, scores, rankings

---

## 🚦 Getting Started

### Prerequisites
```bash
Node.js 16+
npm or yarn
```

### Installation
```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

### Access URLs
```
Landing Page:     http://localhost:5173/
Faculty Signup:   http://localhost:5173/faculty/signup
Faculty Login:    http://localhost:5173/faculty/login
Faculty Dashboard: http://localhost:5173/faculty/dashboard
```

---

## 🎯 Navigation Flow

```
Landing Page → Faculty Login → Dashboard
                    ↓
        ┌───────────┴───────────┬──────────────┬──────────────┐
        │                       │              │              │
    Dashboard            Manage Questions  Manage Tests  Test Analytics
        │                       │              │              │
    View Stats          Create Questions  Create Tests  View Performance
    Recent Tests        View All Q's     Schedule Tests  Question Stats
    Upcoming Tests                       View Tests      Top/Bottom 5
```

---

## 🔧 Customization

### Change Theme Color
```jsx
// Replace all instances of:
emerald-600 → your-color-600
emerald-700 → your-color-700
emerald-50  → your-color-50
```

### Modify API Base URL
```javascript
// src/services/api.js
const API_BASE_URL = 'https://your-backend.com/api';
```

### Add New Navigation Item
```javascript
// src/layouts/FacultyLayout.jsx - menuItems array
{
  name: 'New Page',
  path: '/faculty/new-page',
  icon: <svg>...</svg>
}
```

---

## 📊 Data Flow

```
User Action → Component State → API Call (axios)
                                    ↓
                            Backend Response
                                    ↓
                      Update State → Re-render
                                    ↓
                          Show Success/Error
```

---

## ✅ Completion Checklist

- [x] 6 Reusable Components (Button, Card, Input, Modal, Table, Navbar)
- [x] FacultyLayout with Sidebar Navigation
- [x] FacultySignup & FacultyLogin Pages
- [x] FacultyDashboard with Stats
- [x] ManageQuestions with Modal Form
- [x] ManageTests with Creation Flow
- [x] TestAnalytics with Charts & Tables
- [x] API Integration via axios
- [x] React Router Configuration
- [x] Token Interceptor in api.js
- [x] Mobile Responsive Design
- [x] Green Theme Styling
- [x] Mock Data Fallbacks

---

## 🐛 Error Handling

All API calls include try-catch blocks:
- **Success**: Update state, show confirmation
- **Error**: Console log + alert + use mock data
- **Loading States**: Disabled buttons, loading text

---

## 🎓 Best Practices Implemented

✅ Functional Components with Hooks
✅ Controlled Form Inputs
✅ Protected Routes with Token Check
✅ Axios Interceptors for Auth
✅ Reusable Component Library
✅ Consistent Naming Conventions
✅ Proper Error Boundaries
✅ Loading States
✅ Mobile-First Responsive Design
✅ Accessible Forms with Labels

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Check localStorage for tokens
4. Review network tab for API responses

---

## 🔮 Future Enhancements

- [ ] Question Bank Filters (Subject/Topic)
- [ ] Bulk Question Upload (CSV/Excel)
- [ ] Advanced Charts (Chart.js integration)
- [ ] Export Analytics to PDF
- [ ] Email Notifications
- [ ] Real-time Test Monitoring
- [ ] Question Preview Mode
- [ ] Draft Autosave

---

**Built with ❤️ using React + Tailwind CSS**
