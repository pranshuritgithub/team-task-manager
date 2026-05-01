# TaskFlow — Team Task Manager

A full-stack Team Task Manager built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Live Demo
- Frontend: [Your Vercel URL here]
- Backend API: [Your Railway URL here]

## ✨ Features
- **Authentication** — JWT-based Signup & Login with role selection (Admin / Member)
- **Role-Based Access Control** — Admins create/edit/delete projects & tasks; Members update their task status
- **Projects** — Create projects, assign team members
- **Tasks** — Full CRUD with title, description, priority, status, due date, assignee
- **Dashboard** — Stats (total projects, tasks, members, overdue), recent task feed
- **Team Page** — View all team members (admin only)
- **Overdue Detection** — Tasks past due date highlighted

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Deployment | Railway (backend), Vercel (frontend) |

## 📁 Project Structure
```
team-task-manager/
├── backend/
│   ├── models/        # User, Project, Task
│   ├── routes/        # auth, projects, tasks, dashboard, users
│   ├── middleware/    # JWT auth middleware
│   └── server.js
└── frontend/
    └── src/
        ├── pages/     # Login, Signup, Dashboard, Projects, Tasks, Team
        ├── components/# Sidebar
        ├── context/   # AuthContext
        └── utils/     # Axios API instance
```

## ⚙️ Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env    # Fill in MONGO_URI and JWT_SECRET
npm run dev             # Runs on port 5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # Set VITE_API_URL if not using proxy
npm run dev             # Runs on port 5173
```

## 🚂 Deployment (Railway)

### Backend on Railway
1. New project → Deploy from GitHub repo
2. Set root directory to `backend`
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`
4. Start command: `node server.js`

### Frontend on Vercel
1. Import GitHub repo
2. Set root to `frontend`
3. Add env: `VITE_API_URL=https://your-railway-backend.up.railway.app/api`

## 🔐 API Endpoints
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/auth/signup | ❌ | - |
| POST | /api/auth/login | ❌ | - |
| GET | /api/auth/me | ✅ | Any |
| GET | /api/projects | ✅ | Any |
| POST | /api/projects | ✅ | Admin |
| DELETE | /api/projects/:id | ✅ | Admin |
| GET | /api/tasks | ✅ | Any |
| POST | /api/tasks | ✅ | Admin |
| PUT | /api/tasks/:id | ✅ | Admin/Assignee |
| DELETE | /api/tasks/:id | ✅ | Admin |
| GET | /api/dashboard | ✅ | Any |
| GET | /api/users | ✅ | Any |

## 👤 Author
Built by [Your Name] — B.Tech CSE, Galgotias University (2026 batch)
