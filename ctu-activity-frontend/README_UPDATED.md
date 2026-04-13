# CTU Activity Management System - Frontend

> Can Tho University Student Activity Management System (SAMS-CTU) - A comprehensive web platform for discovering, registering, and tracking student activities with automated "Student of 5 Merits" (SV5T) evaluation.

## 🎯 Quick Overview

This is the **frontend application** for the CTU Activity Management System. It provides:

- ✅ User registration and authentication with CTU email
- ✅ Activity discovery, search, and detailed exploration
- ✅ Activity registration and participation tracking
- ✅ Proof submission for verified participation
- ✅ SV5T progress tracking toward "Student of 5 Merits" status
- ✅ User profile management
- ✅ Responsive design for all devices

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js | 16.1.6 |
| **Library** | React | 18+ |
| **Language** | TypeScript | Latest |
| **API Client** | Axios | ^1.13.5 |
| **State Management** | Zustand | Latest |
| **UI Components** | Shadcn/ui | Latest |
| **Icons** | Lucide React | ^0.564.0 |
| **Styling** | Tailwind CSS | ^3.4.0 |
| **Forms** | React Hook Form | ^7.51.3 |
| **Validation** | Zod | ^3.22.4 |

## 📋 System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **Backend Server**: Running on `http://localhost:8080`
- **Browser**: Modern browser with ES6+ support

## 🚀 Getting Started

### 1. Clone & Navigate

```bash
cd ctu-activity-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

Create `.env.local` file (copy from `.env.local.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Start Development Server

```bash
npm run dev
```

Server will be available at: **http://localhost:3000**

### 5. Open in Browser

Navigate to `http://localhost:3000` and start using the system!

## 📚 Project Structure

```
ctu-activity-frontend/
├── app/                          # Next.js app directory (pages & layouts)
│   ├── activities/               # Activities listing & details pages
│   │   ├── page.tsx             # List all activities
│   │   └── [id]/page.tsx        # Activity detail view
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── profile/page.tsx         # User profile & history
│   ├── progress/page.tsx        # SV5T progress tracking
│   ├── layout.tsx               # Root layout (navbar, footer)
│   └── globals.css              # Global styles
│
├── components/                   # Reusable React components
│   ├── auth/                    # Authentication forms
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── ui/                      # Shadcn/ui component library
│   ├── navbar.tsx               # Top navigation
│   └── footer.tsx               # Footer
│
├── lib/                          # Utility functions & services
│   ├── api.ts                   # Axios instance with interceptors
│   ├── auth-store.ts            # Zustand auth state management
│   ├── activity-service.ts      # Activity API functions
│   ├── user-service.ts          # User API functions
│   ├── api-status-store.ts      # API status tracking store
│   └── utils.ts                 # Helper functions
│
├── public/                       # Static assets (images, icons)
├── package.json                  # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
│
├── FRONTEND_UPDATE.md           # Update summary & changelog
├── FEATURES_GUIDE.md            # Detailed feature documentation
└── README.md                    # This file
```

## 🔑 Key Services

### Activity Service (`lib/activity-service.ts`)

```typescript
import {
  getActivities,         // List activities with filters
  getActivityById,       // Get activity details
  registerActivity,      // Register for activity
  submitProof,          // Submit participation proof
  getStudentProgress,   // Get SV5T progress
  getCategories,        // Get activity categories
  // ... more functions
} from '@/lib/activity-service'
```

### User Service (`lib/user-service.ts`)

```typescript
import {
  getCurrentUser,       // Get current user profile
  updateUserProfile,    // Update user information
  getUserRegistrations, // Get user's activity registrations
} from '@/lib/user-service'
```

### Auth Store (`lib/auth-store.ts`)

```typescript
import { useAuthStore } from '@/lib/auth-store'

const { user, login, register, logout, isAuthenticated } = useAuthStore()
```

## 🌐 API Integration

**Base URL**: `http://localhost:8080`

### Key Endpoints Used

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh JWT token

#### Activities
- `GET /activities` - List activities
- `GET /activities/:id` - Activity details
- `POST /registrations` - Register for activity
- `PATCH /registrations/:id/proof` - Submit proof

#### Users
- `GET /users/me` - Get current user
- `PATCH /users/me` - Update profile

#### Progress
- `GET /students/progress` - Get SV5T progress

## 📖 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page (redirects to activities) |
| `/login` | User login |
| `/register` | User registration |
| `/activities` | List all activities |
| `/activities/:id` | Activity details |
| `/profile` | User profile & history |
| `/progress` | SV5T progress tracking |
| `/ai-recommendations` | AI activity recommendations (future) |

## 🔐 Authentication Flow

```
1. User registers with @ctu.edu.vn email
   ↓
2. Login with email & password
   ↓
3. Receive JWT access token + refresh token (cookie)
   ↓
4. Access token included in all API requests
   ↓
5. If expired, automatically refresh using refresh token
   ↓
6. On logout, tokens cleared
```

## 🎨 UI Features

### Responsive Design
- Mobile: Optimized for phones (< 640px)
- Tablet: 2-column layouts (640-1024px)
- Desktop: Full layouts with sidebars (> 1024px)

### Dark Mode Support
- Automatic dark mode detection
- Theme provider in root layout
- Tailwind dark mode classes

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

Build output in `.next/` directory.

## 🧪 Development

### Run Development Server

```bash
npm run dev
```

- Hot module reloading enabled
- Source maps for debugging
- Console warnings for best practices

### Code Linting

```bash
npm run lint
```

ESLint configured for code quality.

### TypeScript Checking

```bash
npx tsc --noEmit
```

## 🐛 Common Issues & Solutions

### Backend Connection Failed
**Problem**: "Failed to load activities. Backend connection error"

**Solution**:
1. Ensure backend is running: `npm run start` in backend directory
2. Check backend is on port 8080: `lsof -i :8080`
3. Verify API_BASE_URL in `lib/api.ts` is correct

### Authentication Errors
**Problem**: "Invalid email or password"

**Solution**:
1. Use @ctu.edu.vn email for registration
2. Password must be 8+ characters with mixed case
3. Check for typos in email

### Token Expiration
**Problem**: Redirected to login unexpectedly

**Solution**:
1. Automatic token refresh should handle this
2. If persists, clear browser storage: `localStorage.clear()`
3. Login again

### API 404 Errors
**Problem**: "/activities returns 404 Not Found"

**Solution**:
1. Check backend API documentation
2. Verify endpoint paths match documentation
3. Ensure database is seeded with data

## 📊 Monitoring & Debugging

### Browser DevTools

1. **Console (F12 → Console)**
   - API calls logged
   - Error messages displayed
   - Network requests visible

2. **Network Tab**
   - View all API requests
   - Check response status codes
   - Inspect request/response bodies

3. **Application Tab**
   - View localStorage tokens
   - Check cookies
   - Inspect state management

### API Status Indicator

Small icon in bottom-right corner shows:
- 🟢 Green: Connected to backend
- 🔴 Red: Backend offline
- 💾 Disk icon: Mock mode enabled

## 📈 Performance Tips

1. **Code Splitting**: Next.js automatically splits code
2. **Image Optimization**: Use next/image component
3. **Lazy Loading**: Components loaded on demand
4. **Browser Caching**: Static assets cached
5. **API Caching**: Consider adding response caching

## 🔄 Version Updates

### Current Version: 0.1.0

**Latest Updates (Feb 2026):**
- ✅ Full API integration with backend
- ✅ Activity registration & proof submission
- ✅ SV5T progress tracking
- ✅ User profile management
- ✅ Responsive design for all devices

## 📝 Documentation

- **[FRONTEND_UPDATE.md](./FRONTEND_UPDATE.md)** - Detailed update summary
- **[FEATURES_GUIDE.md](./FEATURES_GUIDE.md)** - Complete feature documentation
- **[API_DOCUMENTATION.md](../ctu-activity-backend/.cursorrules/API_DOCUMENTATION.md)** - Backend API docs

## 🤝 Contributing

When adding features:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Follow TypeScript best practices
3. Add proper error handling
4. Test on multiple devices
5. Commit with clear messages
6. Push and create pull request

## 📞 Support & Contact

For issues or questions:

1. Check documentation files
2. Review console errors
3. Check backend logs
4. Contact development team

## 📄 License

This project is part of the Can Tho University Student Activity Management System.

---

## 🎊 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Building
npm run build            # Create production build
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint

# Installation
npm install              # Install dependencies
npm install <package>    # Install specific package

# Debugging
npm run dev -- --debug   # Debug mode

# Cleaning
rm -rf .next node_modules  # Clean build artifacts
npm ci                   # Clean install dependencies
```

## 🚀 Next Steps

1. ✅ Ensure backend is running
2. ✅ Install dependencies: `npm install`
3. ✅ Start dev server: `npm run dev`
4. ✅ Open http://localhost:3000
5. ✅ Register with CTU email
6. ✅ Start exploring activities!

---

**Thank you for using SAMS-CTU! Happy learning! 🎓✨**
