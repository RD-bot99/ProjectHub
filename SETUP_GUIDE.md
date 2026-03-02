# ProjectHub - Setup & Implementation Guide

## Overview

This is a **full-stack project management platform** with a React frontend (built in v0) and a Laravel backend API that you need to implement.

This document guides you through:
1. **Running the React frontend** (already built)
2. **Building the Laravel backend** (your task)
3. **Integrating them together**

---

## Part 1: React Frontend (Already Built)

### Prerequisites
- Node.js 18+ or Bun
- npm, pnpm, or yarn package manager

### Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Frontend Architecture

**Key Directories:**
```
app/
├── login/           # Login page
├── register/        # Registration page
├── dashboard/       # Dashboard (main page)
├── projects/        # Projects list
├── tasks/          # Tasks list
└── team/           # Team management

components/
├── auth/           # Login/Register components
├── layout/         # Dashboard layout wrapper
├── dashboard/      # Dashboard statistics & widgets
├── projects/       # Projects list component
├── tasks/          # Tasks list component
└── team/           # Team list component

context/
├── AuthContext.tsx # Authentication state management
```

### Frontend Features Implemented

✓ **Authentication Pages**
  - Login with email/password
  - Registration with name, email, password
  - Mock JWT token storage
  - Persistent login (localStorage)

✓ **Protected Routes**
  - Automatic redirect to login if not authenticated
  - Role-based access control (template ready)

✓ **Dashboard**
  - Project statistics
  - Task overview
  - Team member count
  - Completion rate
  - Recent activity feed
  - Quick action buttons

✓ **Projects Management**
  - View all projects
  - Filter by status
  - Create new project (UI ready)
  - Project cards with progress tracking

✓ **Task Management**
  - View all tasks
  - Filter by assigned/completed
  - Task priority indicators
  - Status tracking (todo, in_progress, in_review, completed)

✓ **Team Management**
  - View team members
  - Team member roles (admin, manager, member)
  - Activity status
  - Invite new members (UI ready)

✓ **Responsive Design**
  - Dark mode enabled
  - Mobile-friendly sidebar
  - Modern gradient backgrounds
  - Professional color scheme

### Current Mock Data

The frontend uses mock data for development. When you connect the backend API, replace the mock data with actual API calls. Look for `// TODO: Replace with actual API call` comments in the code.

**Mock Services Needed:**
- `context/AuthContext.tsx` - Login/Register API calls
- `components/dashboard/DashboardContent.tsx` - Stats API calls
- `components/projects/ProjectsList.tsx` - Projects API calls
- `components/tasks/TasksList.tsx` - Tasks API calls
- `components/team/TeamList.tsx` - Team members API calls

---

## Part 2: Laravel Backend (Your Implementation)

### Prerequisites
- PHP 8.1+
- Composer
- PostgreSQL or MySQL
- Laravel 10

### Step 1: Project Setup

```bash
# Create new Laravel project
composer create-project laravel/laravel projecthub-backend --prefer-dist

cd projecthub-backend

# Install required packages
composer require tymon/jwt-auth
composer require laravel/sanctum
```

### Step 2: Database Setup

Update `.env` with your database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=projecthub
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Run migrations using the schema provided in `ARCHITECTURE.md`:

```bash
php artisan migrate:fresh --seed
```

### Step 3: Authentication (JWT)

Follow the `ARCHITECTURE.md` section 6 for JWT setup:

1. **Install JWT Auth:**
   ```bash
   php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
   ```

2. **Generate JWT Secret:**
   ```bash
   php artisan jwt:secret
   ```

3. **Create User Model & Controller**
   ```bash
   php artisan make:model User -m
   php artisan make:controller AuthController
   ```

4. **Create Authentication Endpoints:**
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login user
   - `POST /api/auth/refresh` - Refresh JWT token
   - `POST /api/auth/logout` - Logout user
   - `GET /api/auth/me` - Get current user

### Step 4: API Endpoints

Implement all 25+ endpoints specified in `ARCHITECTURE.md` Section 4:

**Authentication (DONE in Step 3)**

**Projects**
```bash
php artisan make:model Project -mcr
php artisan make:model ProjectMember -m
```

Endpoints:
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/stats` - Get statistics

**Tasks**
```bash
php artisan make:model Task -mcr
php artisan make:model Comment -m
```

Endpoints:
- `GET /api/projects/{id}/tasks` - List tasks
- `POST /api/projects/{id}/tasks` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/status` - Update status

**Comments & Activity**
```bash
php artisan make:model ActivityLog -m
php artisan make:model Notification -m
```

Endpoints:
- `GET /api/tasks/{id}/comments` - List comments
- `POST /api/tasks/{id}/comments` - Add comment
- `GET /api/projects/{id}/activity` - Activity feed
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/notifications` - User notifications

### Step 5: CORS Configuration

Update `config/cors.php` to allow frontend origin:

```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:3001',
],
```

### Step 6: Testing Endpoints

Use Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Part 3: Frontend & Backend Integration

### 1. Update API Configuration

Create `lib/api.ts` in the React frontend:

```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};
```

### 2. Replace Mock Auth Calls

In `context/AuthContext.tsx`, replace:

```typescript
// OLD: Mock response
// const mockUser: User = { ... };

// NEW: Actual API call
const response = await apiCall('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

const { user, token } = response.data;
setUser(user);
setToken(token);
```

### 3. Replace Mock Data Calls

In each component (Projects, Tasks, Dashboard), replace mock data:

```typescript
// OLD: hardcoded mock data
// const projects = [{ id: '1', name: '...' }, ...];

// NEW: API call
const response = await apiCall('/projects');
const projects = response.data;
```

### 4. Environment Setup

Create `.env.local` in the React frontend:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### 5. Run Both Services

**Terminal 1 - React Frontend:**
```bash
npm run dev
```

**Terminal 2 - Laravel Backend:**
```bash
php artisan serve
```

Access the app at `http://localhost:3000`

---

## Part 4: Advanced Features (Phase 7)

Once basic CRUD is working, implement:

### WebSocket Real-time Features

```php
// In Laravel, use Laravel Broadcast
php artisan make:channel ProjectChannel
php artisan make:channel TaskChannel

// Emit events when tasks/projects are updated
event(new TaskUpdated($task));
event(new ProjectUpdated($project));
```

### Database Transactions

Ensure data consistency with transactions:

```php
DB::transaction(function () {
    // Create project
    // Assign owner as project member
    // Create activity log
});
```

### File Uploads

Add avatar/document uploads using Laravel Storage:

```php
$path = $request->file('avatar')->store('avatars');
```

---

## Troubleshooting

### Frontend Issues

**"useAuth must be used within AuthProvider"**
- Ensure `AuthProvider` wraps all pages in `app/layout.tsx` ✓

**CORS errors**
- Configure Laravel CORS config
- Ensure API URL is correct in `.env.local`

**Mock data not showing**
- Components load mock data on mount
- Replace with actual API calls

### Backend Issues

**JWT token not working**
- Run `php artisan jwt:secret`
- Check `.env` for `JWT_SECRET`
- Verify header: `Authorization: Bearer <token>`

**Migration errors**
- Drop database: `php artisan migrate:fresh`
- Check table relationships in schema
- Review foreign key constraints

**CORS errors**
- Update `config/cors.php`
- Restart Laravel server after changes

---

## Timeline & Milestones

With 48 hours remaining:

**Next 6 hours:**
- [ ] Set up Laravel project
- [ ] Implement User & Auth models
- [ ] Create auth endpoints (login, register, refresh)
- [ ] Test with Postman

**Next 12 hours:**
- [ ] Implement Project & Task models
- [ ] Create CRUD endpoints
- [ ] Add activity logging
- [ ] Implement notifications

**Next 8 hours:**
- [ ] Update frontend API integration
- [ ] Test all endpoints
- [ ] Add role-based middleware
- [ ] Implement WebSockets (optional)

**Final 6 hours:**
- [ ] Fix bugs & edge cases
- [ ] Polish UI/UX
- [ ] Prepare for submission
- [ ] Create documentation

---

## Documentation Resources

- **Laravel Docs:** https://laravel.com/docs/10.x
- **JWT Auth:** https://github.com/tymondesigns/jwt-auth
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

---

## Submission Checklist

- [ ] Frontend runs without errors
- [ ] Backend API responds to requests
- [ ] Authentication works end-to-end
- [ ] Projects CRUD implemented
- [ ] Tasks CRUD implemented
- [ ] Team management working
- [ ] Dashboard displays data from API
- [ ] Role-based access control implemented
- [ ] Error handling for edge cases
- [ ] Documentation complete

---

**Good luck! You've got this!** 🚀
