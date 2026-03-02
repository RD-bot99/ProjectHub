# ProjectHub Setup and Testing Guide

## Backend Setup

### Prerequisites
- PHP 8.1+
- Composer
- SQLite (comes with PHP)

### Installation Steps

1. Navigate to the backend directory:
```bash
cd projecthub-backend
```

2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Generate JWT secret:
```bash
php artisan jwt:secret
```

6. Run migrations:
```bash
php artisan migrate
```

7. Seed the database with test users:
```bash
php artisan db:seed
```

8. Start the development server:
```bash
php artisan serve
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation Steps

1. From the project root directory, install dependencies:
```bash
npm install
# or
pnpm install
```

2. Create `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Test Users

The database seeder creates three test users with different roles:

### Admin User
- **Email**: `admin@test.com`
- **Password**: `Admin123!`
- **Global Role**: admin
- **Project Role**: admin
- **Permissions**: Full access to all projects, tasks, and team management

### Manager User
- **Email**: `manager@test.com`
- **Password**: `Manager123!`
- **Global Role**: manager
- **Project Role**: admin
- **Permissions**: Can create/manage projects, tasks, and team members

### Team Member User
- **Email**: `member@test.com`
- **Password**: `Member123!`
- **Global Role**: team_member
- **Project Role**: member
- **Permissions**: Can view assigned tasks, limited project access

## Testing Role-Based Access Control

### Admin User Testing
1. Login with `admin@test.com` / `Admin123!`
2. Verify you can:
   - View dashboard with all stats
   - Create new projects
   - Invite team members
   - Create and manage tasks
   - Access team management page with full controls

### Manager User Testing
1. Login with `manager@test.com` / `Manager123!`
2. Verify you can:
   - View dashboard
   - Create new projects
   - Invite team members
   - Create and manage tasks
   - Access team management with edit capabilities

### Member User Testing
1. Login with `member@test.com` / `Member123!`
2. Verify you can:
   - View dashboard (limited actions available)
   - View assigned projects and tasks
   - Complete own tasks
   - Cannot create projects or invite members
   - Cannot edit other users' tasks

## Feature Testing Checklist

### Authentication
- [x] Login with valid credentials
- [x] Login with invalid credentials shows error
- [x] Register new user
- [x] Logout clears session

### Projects
- [x] Admin/Manager can create projects
- [x] Members see read-only project list
- [x] Projects persist after page refresh
- [x] Project details display correctly

### Tasks
- [x] Create tasks with priority and due dates
- [x] Toggle task completion status
- [x] Filter tasks by status and priority
- [x] Delete tasks (admin/manager only)
- [x] Tasks persist after page refresh

### Team Management
- [x] View team members
- [x] Admin/Manager can invite members
- [x] Members cannot access team management
- [x] Role-based UI rendering

### API Integration
- [x] All data fetched from backend API
- [x] Authentication token properly sent with requests
- [x] Data persists across browser sessions
- [x] Error handling displays appropriately

## Troubleshooting

### Backend Connection Issues
If the frontend cannot connect to the backend:
1. Ensure backend is running on `http://localhost:8000`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS is properly configured in the backend
4. Check browser console for network errors

### Database Issues
If migrations fail:
1. Delete `database/database.sqlite`
2. Re-run `php artisan migrate`
3. Re-run `php artisan db:seed`

### JWT Token Issues
If you get authentication errors:
1. Run `php artisan jwt:secret`
2. Clear browser localStorage
3. Login again

## API Endpoints

All endpoints require `Authorization: Bearer {token}` header (except login/register)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/update-password` - Change password

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Project Members
- `GET /api/projects/{id}/members` - List project members
- `POST /api/projects/{id}/members` - Add member to project
- `PUT /api/projects/{id}/members/{userId}` - Update member role
- `DELETE /api/projects/{id}/members/{userId}` - Remove member
