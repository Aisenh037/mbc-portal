### Overview

- Monorepo with `backend` (Express/Mongo), `frontend` (Vite/React), and `services/analytics` (FastAPI)
- JWT-based auth (access + refresh, HttpOnly cookies)
- RBAC: Developer, Admin, Professor, Student
- Secure middlewares: Helmet, CORS, XSS Clean, Rate Limit, Mongo Sanitize

### Backend Modules
- `auth`: registration, OTP email verification, login, refresh, logout, password reset
- `academic`: branches, courses, professors, students
- `finance`: fee records and receipts
- `notice`: department notices
- `exam`: timetable and results
- `assignment`: professor uploads and student submissions
- `research`: projects and publications
- `analytics`: proxy to FastAPI service

### Data Flow

User -> Frontend (Axios) -> Backend `/api/*` ->
- MongoDB via Mongoose (CRUD)
- Nodemailer (OTP/Reset)
- Storage (local or S3 via AWS SDK)
- FastAPI analytics via REST

### Environment & Config
- `.env` validated with Zod in `src/config/env.js`
- Swagger at `/api/docs`

### Folder Structure (backend/src)
```
config/
controllers/
docs/
middleware/
models/
routes/
services/
utils/
```

### Scalability
- Modular controllers/routes/services
- Stateless auth with refresh tokens
- Swap storage to S3 with `S3_ENABLE=true`
- Horizontal scale behind a reverse proxy