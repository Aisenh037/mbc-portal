# MBC Department Portal (MERN + FastAPI)

A production-ready, institute-grade portal for academic administration, finance, notices, exams, assignments, research tracking, and analytics. Designed for the MBC Department but adaptable for other institutes or sectors.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer, Multer/S3, Helmet, CORS, XSS Clean, Mongo Sanitize, Swagger
- Frontend: React (Vite), TypeScript, MUI, React Router v6, Redux Toolkit, Axios, Zustand (optional)
- Analytics Service: FastAPI, Pandas, NumPy, scikit-learn (stubs provided)

## Monorepo Structure
```
mbc-portal/
  backend/
  frontend/
  services/
    analytics/
```

## Quick Start

1) Prerequisites
- Node 18+
- MongoDB running locally
- Python 3.10+

2) Configure environment
```
cp .env.example .env
# Edit values as needed
```

3) Install dependencies
```
cd backend && npm i && cd ../frontend && npm i
```

4) Run backend
```
cd backend
npm run dev
# Swagger: http://localhost:5000/api/docs
```

5) Run frontend
```
cd frontend
npm run dev
# App: http://localhost:5173
```

6) Run analytics service (FastAPI)
```
cd services/analytics
# If venv is available
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Scripts
- Backend
  - dev: nodemon src/index.js
  - start: node src/index.js
- Frontend
  - dev: vite
  - build: tsc -b && vite build
  - preview: vite preview

## Security
- Helmet, CORS, XSS Clean, Express Rate Limit, Mongo Sanitize
- JWT access/refresh tokens in HttpOnly cookies
- Role-based authorization for Developer, Admin, Professor, Student
- OTP email verification and password reset (Nodemailer)

## API Docs
Open `http://localhost:5000/api/docs`

## Notes
- File uploads are stored locally under `backend/uploads` by default. Set S3 envs to upload to AWS S3.
- Analytics endpoints are proxied under `/api/analytics/*` and call the FastAPI service at `PY_SERVICE_URL`.