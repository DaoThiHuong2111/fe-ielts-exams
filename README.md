# IELTS Exams Frontend

Next.js 15 frontend application for IELTS examination platform with modern authentication and UI components.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 4 + Radix UI components
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with httpOnly cookies
- **Testing**: Playwright E2E tests

## 💻 Development Commands

```bash
# Development (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🧪 Testing

```bash
# Run Playwright E2E tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# View test reports
npx playwright show-report

# Run specific test file
npx playwright test tests/auth/auth.e2e.spec.ts
```

## 🏠 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/         # Reusable UI components
│   └── ui/             # Radix UI components
├── contexts/           # React contexts (auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities (axios, token-utils)
└── services/           # API services
```

## 🔗 Backend Integration

This frontend connects to the NestJS backend API:

- **Backend URL**: Configurable via `BACKEND_API_URL` (default: `http://localhost:8228`)
- **API Routes**: All client requests go through Next.js API routes (`/api/*`) for security
- **Authentication**: httpOnly cookies with JWT tokens
- **CORS**: Configured via environment variables

**Make sure backend is running before starting frontend!**

## 🌐 Environment Variables

Create `.env.local` from `.env.example`:

```env
# API Configuration
BACKEND_API_URL=http://localhost:8228
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Development Configuration
NEXT_PUBLIC_NODE_ENV=development

# Test Configuration
NEXT_PUBLIC_TEST_BASE_URL=http://localhost:3001

# Playwright Configuration
PLAYWRIGHT_BASE_URL=http://localhost:3000
PLAYWRIGHT_TIMEOUT=30000

# Security Configuration
NEXT_PUBLIC_APP_NAME=IELTS Exams
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BACKEND_API_URL` | Backend API base URL | `http://localhost:8228` | No |
| `NEXT_PUBLIC_BASE_URL` | Frontend base URL | `http://localhost:3000` | No |
| `NEXT_PUBLIC_NODE_ENV` | Environment mode | `development` | No |
| `NEXT_PUBLIC_TEST_BASE_URL` | Test environment URL | `http://localhost:3001` | No |
| `PLAYWRIGHT_BASE_URL` | Playwright test URL | `http://localhost:3000` | No |
| `PLAYWRIGHT_TIMEOUT` | Playwright timeout (ms) | `30000` | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | `IELTS Exams` | No |
| `NEXT_PUBLIC_API_TIMEOUT` | API timeout (ms) | `10000` | No |

## 🐛 Troubleshooting

**Build failures:**
```bash
# Clear Next.js cache
npm run build -- --no-cache

# Clear all caches
rm -rf .next node_modules
npm install
```

**Authentication issues:**
- Clear browser cookies and localStorage
- Ensure backend is running on port 8228
- Check that backend has JWT keys generated

**CORS errors:**
- Verify backend FRONTEND_URL matches `http://localhost:3000`
- Ensure backend is running before frontend

## 📄 Documentation

For detailed development guidelines and project architecture, see `../WARP.md` in the root directory.
