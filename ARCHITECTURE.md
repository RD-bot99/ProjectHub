# Project Management Platform - Architecture & Design Document

## 1. System Overview

A full-stack project management platform enabling teams to collaborate on projects and tasks with role-based access control and real-time collaboration features.

### Tech Stack
- **Backend**: Laravel 10 (RESTful API)
- **Frontend**: React 18 + Vite (SPA)
- **Database**: PostgreSQL/MySQL
- **Authentication**: JWT Tokens
- **Real-time**: WebSockets (Laravel Broadcast or Socket.io)
- **Deployment**: Docker containers recommended

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│              React SPA (Vite + TypeScript)               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP + WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│              API GATEWAY / LOAD BALANCER                 │
│                  (Optional: Nginx)                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│            LARAVEL REST API SERVER                       │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Controllers / Middleware / Services                 ││
│  │ Authentication (JWT) | Authorization (Roles)        ││
│  │ WebSocket Events / Broadcasting                     ││
│  └─────────────────────────────────────────────────────┘│
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──┐  ┌─────▼────┐  ┌──▼─────────┐
│ Database │  │   Cache  │  │ Job Queue  │
│PostgreSQL│  │  Redis   │  │  Redis     │
└──────────┘  └──────────┘  └────────────┘
```

---

## 3. Database Schema

### Core Tables

#### `users`
```
- id (PK)
- email (UNIQUE)
- password (hashed)
- name
- avatar_url
- created_at
- updated_at
```

#### `roles`
```
- id (PK)
- name (admin, manager, team_member)
- permissions (JSON array)
```

#### `user_roles`
```
- id (PK)
- user_id (FK)
- role_id (FK)
- organization_id (FK)
- created_at
```

#### `projects`
```
- id (PK)
- name
- description
- owner_id (FK -> users)
- status (active, archived, completed)
- start_date
- end_date
- created_at
- updated_at
```

#### `project_members`
```
- id (PK)
- project_id (FK)
- user_id (FK)
- role (admin, member, viewer)
- joined_at
- UNIQUE(project_id, user_id)
```

#### `tasks`
```
- id (PK)
- project_id (FK)
- title
- description
- assigned_to (FK -> users)
- status (todo, in_progress, in_review, completed)
- priority (low, medium, high)
- due_date
- created_by (FK -> users)
- created_at
- updated_at
```

#### `comments`
```
- id (PK)
- task_id (FK)
- user_id (FK)
- content
- created_at
- updated_at
```

#### `activity_logs`
```
- id (PK)
- project_id (FK)
- user_id (FK)
- action (created_task, updated_task, commented, etc)
- entity_type (task, project)
- entity_id
- changes (JSON)
- created_at
```

#### `notifications`
```
- id (PK)
- user_id (FK)
- type (task_assigned, task_updated, comment_added)
- related_entity_id
- is_read
- created_at
```

---

## 4. API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user
```

### Projects
```
GET    /api/projects               - List user's projects
POST   /api/projects               - Create new project
GET    /api/projects/{id}          - Get project details
PUT    /api/projects/{id}          - Update project
DELETE /api/projects/{id}          - Archive/delete project
GET    /api/projects/{id}/stats    - Get project statistics
```

### Project Members
```
GET    /api/projects/{id}/members  - List project members
POST   /api/projects/{id}/members  - Add member to project
PUT    /api/projects/{id}/members/{userId} - Update member role
DELETE /api/projects/{id}/members/{userId} - Remove member
```

### Tasks
```
GET    /api/projects/{id}/tasks    - List project tasks
POST   /api/projects/{id}/tasks    - Create task
GET    /api/tasks/{id}             - Get task details
PUT    /api/tasks/{id}             - Update task
DELETE /api/tasks/{id}             - Delete task
PATCH  /api/tasks/{id}/status      - Update task status
```

### Comments
```
GET    /api/tasks/{id}/comments    - List task comments
POST   /api/tasks/{id}/comments    - Add comment
DELETE /api/comments/{id}          - Delete comment
```

### Activity & Analytics
```
GET    /api/projects/{id}/activity - Get activity feed
GET    /api/dashboard/stats        - Get user dashboard stats
GET    /api/projects/{id}/analytics - Get project analytics
```

### Notifications
```
GET    /api/notifications          - Get user notifications
PATCH  /api/notifications/{id}/read - Mark as read
DELETE /api/notifications/{id}     - Delete notification
```

---

## 5. Frontend Architecture (React)

### Project Structure
```
src/
├── components/
│   ├── auth/              # Login, Register
│   ├── layout/            # Sidebar, Header, Navigation
│   ├── dashboard/         # Dashboard widgets
│   ├── projects/          # Project list, detail, form
│   ├── tasks/             # Task list, card, form, detail
│   ├── team/              # Team members, invite
│   └── common/            # Reusable UI components
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── TaskDetail.tsx
│   └── NotFound.tsx
├── services/
│   ├── api.ts             # Axios instance
│   ├── auth.ts            # Auth API calls
│   ├── projects.ts        # Projects API calls
│   ├── tasks.ts           # Tasks API calls
│   └── notifications.ts   # Notifications API
├── context/
│   ├── AuthContext.tsx    # User state
│   └── NotificationContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProject.ts
│   └── useTask.ts
├── utils/
│   ├── constants.ts
│   ├── date.ts
│   └── helpers.ts
└── App.tsx
```

### Key Pages/Routes
- `/login` - Authentication
- `/dashboard` - User dashboard (projects, recent activity, stats)
- `/projects` - Projects list
- `/projects/:id` - Project detail (tasks, members, activity)
- `/projects/:id/settings` - Project settings
- `/tasks/:id` - Task detail (comments, activity)

### State Management
- **Auth State**: React Context + localStorage for token
- **Project/Task State**: Context + custom hooks
- **Real-time Updates**: WebSocket listener in context

---

## 6. Authentication & Authorization

### JWT Authentication Flow
1. User sends credentials → Backend validates → Returns JWT token
2. Frontend stores token in localStorage
3. All API requests include `Authorization: Bearer <token>`
4. Backend validates token, extracts user ID, enforces permissions

### Role-Based Access Control (RBAC)
```
Admin (Project Owner):
  - Create, update, delete projects
  - Manage project members
  - View all analytics
  - Delete any task/comment

Manager:
  - Create and manage tasks
  - Assign tasks to team members
  - View project analytics
  - Manage comments

Team Member:
  - Create and update own tasks
  - Comment on tasks
  - Update task status
  - View project information
```

---

## 7. Real-time Features

### WebSocket Events
```
project.created          - New project created
project.updated          - Project updated
task.created             - New task in project
task.updated             - Task details changed
task.status.changed      - Task status updated
comment.added            - New comment on task
member.joined            - User joined project
notification.new         - New notification
```

### Broadcasting Channels
- `project.{id}` - All project activities
- `user.{id}` - User-specific notifications
- `task.{id}` - Task-specific activities

---

## 8. Security Considerations

### Frontend
- ✓ HTTPS only
- ✓ Secure JWT storage (localStorage with httpOnly cookies option)
- ✓ CSRF protection
- ✓ Input validation and sanitization
- ✓ XSS prevention

### Backend
- ✓ Password hashing (bcrypt)
- ✓ JWT validation on all endpoints
- ✓ Role-based middleware
- ✓ SQL injection prevention (Laravel ORM)
- ✓ Rate limiting
- ✓ CORS configuration
- ✓ Environment variables for sensitive data

---

## 9. Implementation Timeline (48 Hours)

### Phase 1: Architecture & Setup (2 hours)
- Database schema design ✓
- API endpoint planning ✓
- Frontend structure ✓
- Project scaffolding

### Phase 2: Backend (Laravel) - 20 hours
- User model, authentication (JWT)
- Project, Task models
- RBAC middleware
- API endpoints (CRUD)
- WebSocket setup (optional)

### Phase 3: Frontend (React) - 20 hours
- Auth pages (login, register)
- Layout (sidebar, header)
- Dashboard with stats
- Projects list & detail
- Task management
- Comments & activity
- Real-time notifications

### Phase 4: Testing & Polish - 6 hours
- Bug fixes
- UI/UX refinement
- Performance optimization
- Deployment setup

---

## 10. Technology Rationale

| Component | Choice | Reason |
|-----------|--------|--------|
| Backend | Laravel 10 | Built-in auth, ORM, migrations, broadcasting |
| Frontend | React 18 | Fast rendering, component reusability, ecosystem |
| Database | PostgreSQL | ACID compliance, JSON support, scalability |
| Auth | JWT | Stateless, scalable, ideal for APIs |
| API Style | REST | Simple, well-understood, easy to implement |
| Real-time | WebSockets | Low latency, bidirectional communication |

---

## 11. Deployment Notes

### Development
```bash
# Backend
cd backend
composer install
php artisan migrate:fresh --seed
php artisan serve

# Frontend
cd frontend
npm install
npm run dev
```

### Production
- Docker containers for both services
- PostgreSQL hosted database
- Redis for caching/jobs
- Nginx reverse proxy
- SSL/TLS certificates (Let's Encrypt)

---

## 12. Next Steps

1. **Backend**: Set up Laravel project, database, JWT authentication
2. **Frontend**: Bootstrap React app, set up routing, authentication flow
3. **Integration**: Connect frontend to backend API
4. **Features**: Implement CRUD operations incrementally
5. **Polish**: Add UI refinements and real-time features

---

**Document Version**: 1.0
**Last Updated**: 2026-02-17
**Status**: Architecture Approved - Ready for Implementation
