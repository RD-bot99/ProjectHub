# ProjectHub - Quick Start Guide

**TL;DR Version - Get Up and Running in 10 Minutes**

---

## What You Have

✅ **Complete React Frontend** (ready to use)
- All pages built
- Mock authentication enabled
- Just run it!

⏳ **Backend Specifications** (ready to build)
- Detailed architecture
- Database schema
- API endpoints
- Complete setup guide

---

## Frontend (Already Built)

### 1. Start the Frontend
```bash
npm install
npm run dev
```

**Frontend runs on:** http://localhost:3000

### 2. Test Login
- Email: `test@example.com`
- Password: `anything`
- Mock auth enabled (no backend needed to test UI)

### 3. Explore Pages
- Dashboard (home page after login)
- Projects
- Tasks
- Team

---

## Backend (You Build This)

### 1. Create Laravel Project (5 minutes)
```bash
composer create-project laravel/laravel projecthub-backend
cd projecthub-backend
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
php artisan jwt:secret
```

### 2. Configure Database (5 minutes)

Edit `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=projecthub
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
```

### 3. Create Migrations (10 minutes)

```bash
php artisan make:migration create_users_table --create=users
php artisan make:migration create_projects_table --create=projects
php artisan make:migration create_tasks_table --create=tasks
php artisan make:migration create_comments_table --create=comments
php artisan make:migration create_activity_logs_table --create=activity_logs
php artisan make:migration create_notifications_table --create=notifications
```

See `LARAVEL_BACKEND_SETUP.md` Phase 1.3 for migration code.

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. Create Models (10 minutes)
```bash
php artisan make:model User
php artisan make:model Project
php artisan make:model Task
php artisan make:model Comment
php artisan make:model ActivityLog
php artisan make:model Notification
```

Add relationships. See `LARAVEL_BACKEND_SETUP.md` Phase 2.

### 6. Create Auth Controller (10 minutes)
```bash
php artisan make:controller AuthController
```

Implement login, register, logout endpoints.
See `LARAVEL_BACKEND_SETUP.md` Phase 3.2.

### 7. Create Routes
```php
// routes/api.php
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});
```

### 8. Start Server
```bash
php artisan serve
```

**Backend runs on:** http://localhost:8000

---

## Connect Frontend to Backend

### 1. Create API Client
Create `lib/api.ts`:
```typescript
const API_URL = 'http://localhost:8000/api';

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
};
```

### 2. Update AuthContext
Replace mock auth with real API:
```typescript
// In context/AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  setToken(response.token);
  setUser(response.user);
  localStorage.setItem('auth_token', response.token);
};
```

### 3. Replace Mock Data
In each component, replace hardcoded mock data with API calls:

**Projects:**
```typescript
const response = await apiCall('/projects');
const projects = response;
```

**Tasks:**
```typescript
const response = await apiCall(`/projects/${projectId}/tasks`);
const tasks = response;
```

---

## Essential Files to Read

1. **[README.md](./README.md)** - Project overview (5 min read)
2. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Phase-by-phase plan (10 min read)
3. **[LARAVEL_BACKEND_SETUP.md](./LARAVEL_BACKEND_SETUP.md)** - Detailed backend guide (reference)
4. **[API_REFERENCE.md](./API_REFERENCE.md)** - All endpoints (reference)

---

## 48-Hour Timeline

**Hour 1-2:** Backend setup + first migration  
**Hour 3-6:** Implement auth endpoints + test  
**Hour 7-16:** Implement CRUD endpoints (projects, tasks)  
**Hour 17-20:** Frontend-backend integration  
**Hour 21-24:** Authorization + error handling  
**Hour 25-30:** Testing + bug fixes  
**Hour 31-48:** Buffer + polish + submission  

---

## Must-Have Features by Deadline

### ✅ Required
- [x] User registration & login
- [x] Create/view/update/delete projects
- [x] Create/view/update/delete tasks
- [x] Assign tasks to users
- [x] View project team members
- [x] Dashboard with stats
- [x] Activity logging
- [x] Role-based access

### 🌟 Nice-to-Have
- [ ] Comments on tasks
- [ ] Real-time notifications
- [ ] File uploads
- [ ] Search functionality

---

## Testing Your Work

### Test Auth Flow
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Use token from response
TOKEN="your_token_here"

# Get current user
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Frontend-Backend
1. Start both servers (frontend on 3000, backend on 8000)
2. Go to http://localhost:3000/login
3. Register with backend API
4. Login should work
5. Dashboard should show real data

---

## Common Mistakes (Avoid These!)

❌ Forget to run migrations  
✅ Run `php artisan migrate` after creating migrations

❌ JWT secret not generated  
✅ Run `php artisan jwt:secret` after install

❌ CORS not configured  
✅ Add CORS middleware to Laravel routes

❌ Token not passed to API  
✅ Add `Authorization: Bearer <token>` header to requests

❌ Hard-code API URL  
✅ Use environment variables `.env.local` in React

❌ Test only login page  
✅ Test complete flow: register → login → projects → tasks

---

## Quick Fixes

**"POST /api/auth/login 404"**
- Check routes in `routes/api.php`
- Verify AuthController exists and class name is correct

**"CORS error"**
- Add CORS middleware to Laravel
- Restart Laravel server after changes

**"Token invalid"**
- Regenerate JWT secret: `php artisan jwt:secret`
- Check token format in request header

**"Database connection refused"**
- Check `.env` DB credentials
- Ensure PostgreSQL/MySQL is running
- Create database: `createdb projecthub` (PostgreSQL)

---

## Deployment Checklist

Before submitting:

- [ ] Frontend runs without errors: `npm run dev`
- [ ] Backend runs without errors: `php artisan serve`
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can see dashboard after login
- [ ] Can create projects
- [ ] Can create tasks
- [ ] Can add team members
- [ ] Authorization working (non-admin can't delete)
- [ ] All documentation complete

---

## You Got This! 🚀

1. Follow the timeline above
2. One phase at a time
3. Test each phase before moving on
4. Refer to documentation when stuck
5. Don't overthink it - focus on must-haves

**Total Work:** ~24 hours of coding  
**Time Available:** 48 hours  
**Buffer:** 24 hours ✓

---

## Help! I'm Stuck

1. **Frontend issue?** → Check `SETUP_GUIDE.md` Part 1
2. **Backend setup?** → Check `LARAVEL_BACKEND_SETUP.md` Phase 1-2
3. **API endpoint?** → Check `API_REFERENCE.md`
4. **Architecture question?** → Check `ARCHITECTURE.md`
5. **What to do next?** → Check `IMPLEMENTATION_CHECKLIST.md`

---

**Start coding! 👉 `npm run dev` to start frontend and `php artisan serve` to start backend. See you at the finish line! 🎉**
