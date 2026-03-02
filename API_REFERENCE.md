# ProjectHub API Reference

Base URL: `http://localhost:8000/api`

All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register
**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Response (201):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-02-17T10:00:00Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["admin"]
  }
}
```

---

### Logout
**POST** `/auth/logout`

Requires: Authentication

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/auth/me`

Requires: Authentication

Response (200):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "roles": ["admin"],
  "created_at": "2026-01-15T00:00:00Z"
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Requires: Authentication

Response (200):
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Projects Endpoints

### List All Projects
**GET** `/projects`

Requires: Authentication

Query Parameters:
- `status` - Filter by status (active, archived, completed)
- `page` - Pagination page (default: 1)
- `per_page` - Items per page (default: 15)

Response (200):
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of main website",
    "owner_id": 1,
    "status": "active",
    "start_date": "2026-01-15",
    "end_date": "2026-04-30",
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-02-17T10:00:00Z"
  }
]
```

---

### Create Project
**POST** `/projects`

Requires: Authentication

Request:
```json
{
  "name": "New Project",
  "description": "Project description",
  "start_date": "2026-03-01",
  "end_date": "2026-06-30"
}
```

Response (201):
```json
{
  "id": 2,
  "name": "New Project",
  "description": "Project description",
  "owner_id": 1,
  "status": "active",
  "start_date": "2026-03-01",
  "end_date": "2026-06-30",
  "created_at": "2026-02-17T10:00:00Z"
}
```

---

### Get Project Details
**GET** `/projects/{id}`

Requires: Authentication

Response (200):
```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Complete redesign",
  "owner_id": 1,
  "status": "active",
  "start_date": "2026-01-15",
  "end_date": "2026-04-30",
  "members": [
    {
      "id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "role": "admin"
    }
  ],
  "tasks": [
    {
      "id": 1,
      "title": "Design homepage",
      "status": "in_progress",
      "priority": "high"
    }
  ]
}
```

---

### Update Project
**PUT** `/projects/{id}`

Requires: Authentication + Authorization (owner or admin)

Request:
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "in_progress"
}
```

Response (200): Updated project object

---

### Delete Project
**DELETE** `/projects/{id}`

Requires: Authentication + Authorization (owner only)

Response (200):
```json
{
  "message": "Project deleted"
}
```

---

### Get Project Statistics
**GET** `/projects/{id}/stats`

Requires: Authentication + Authorization

Response (200):
```json
{
  "total_tasks": 15,
  "completed_tasks": 10,
  "in_progress_tasks": 3,
  "overdue_tasks": 2,
  "completion_percentage": 66.7,
  "team_members": 5,
  "total_comments": 24
}
```

---

## Project Members Endpoints

### List Project Members
**GET** `/projects/{id}/members`

Requires: Authentication + Authorization

Response (200):
```json
[
  {
    "id": 1,
    "project_id": 1,
    "user_id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "role": "admin",
    "joined_at": "2026-01-15T10:00:00Z"
  }
]
```

---

### Add Project Member
**POST** `/projects/{id}/members`

Requires: Authentication + Authorization (admin)

Request:
```json
{
  "user_id": 2,
  "role": "member"
}
```

Response (201): Member object

---

### Update Member Role
**PUT** `/projects/{id}/members/{userId}`

Requires: Authentication + Authorization (admin)

Request:
```json
{
  "role": "manager"
}
```

Response (200): Updated member object

---

### Remove Member
**DELETE** `/projects/{id}/members/{userId}`

Requires: Authentication + Authorization (admin)

Response (200):
```json
{
  "message": "Member removed"
}
```

---

## Tasks Endpoints

### List Project Tasks
**GET** `/projects/{id}/tasks`

Requires: Authentication + Authorization

Query Parameters:
- `status` - Filter by status
- `assigned_to` - Filter by assignee
- `priority` - Filter by priority
- `sort` - Sort by field (default: created_at)

Response (200):
```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "Design database schema",
    "description": "Create comprehensive schema",
    "assigned_to": 2,
    "status": "in_progress",
    "priority": "high",
    "due_date": "2026-03-15",
    "created_by": 1,
    "created_at": "2026-02-10T10:00:00Z"
  }
]
```

---

### Create Task
**POST** `/projects/{id}/tasks`

Requires: Authentication + Authorization

Request:
```json
{
  "title": "New Task",
  "description": "Task description",
  "assigned_to": 2,
  "priority": "high",
  "due_date": "2026-03-20"
}
```

Response (201): Task object

---

### Get Task Details
**GET** `/tasks/{id}`

Requires: Authentication + Authorization

Response (200):
```json
{
  "id": 1,
  "project_id": 1,
  "title": "Design database",
  "description": "Create schema",
  "assigned_to": 2,
  "assigned_user": {
    "id": 2,
    "name": "Sarah",
    "email": "sarah@example.com"
  },
  "status": "in_progress",
  "priority": "high",
  "due_date": "2026-03-15",
  "created_by": 1,
  "comments": [
    {
      "id": 1,
      "content": "Started working on this",
      "user": { "id": 2, "name": "Sarah" },
      "created_at": "2026-02-16T10:00:00Z"
    }
  ],
  "activities": []
}
```

---

### Update Task
**PUT** `/tasks/{id}`

Requires: Authentication + Authorization

Request:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "assigned_to": 3,
  "priority": "medium",
  "due_date": "2026-03-25"
}
```

Response (200): Updated task object

---

### Update Task Status
**PATCH** `/tasks/{id}/status`

Requires: Authentication + Authorization

Request:
```json
{
  "status": "completed"
}
```

Response (200):
```json
{
  "id": 1,
  "status": "completed",
  "updated_at": "2026-02-17T10:00:00Z"
}
```

---

### Delete Task
**DELETE** `/tasks/{id}`

Requires: Authentication + Authorization

Response (200):
```json
{
  "message": "Task deleted"
}
```

---

## Comments Endpoints

### List Task Comments
**GET** `/tasks/{id}/comments`

Requires: Authentication + Authorization

Response (200):
```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 2,
    "user": {
      "id": 2,
      "name": "Sarah",
      "avatar_url": "https://..."
    },
    "content": "This looks good, let's proceed",
    "created_at": "2026-02-16T10:00:00Z"
  }
]
```

---

### Add Comment
**POST** `/tasks/{id}/comments`

Requires: Authentication + Authorization

Request:
```json
{
  "content": "Great progress! Keep it up."
}
```

Response (201): Comment object

---

### Delete Comment
**DELETE** `/comments/{id}`

Requires: Authentication + Authorization (author or admin)

Response (200):
```json
{
  "message": "Comment deleted"
}
```

---

## Activity & Analytics Endpoints

### Get Project Activity Feed
**GET** `/projects/{id}/activity`

Requires: Authentication + Authorization

Query Parameters:
- `limit` - Number of activities (default: 20)
- `offset` - Pagination offset

Response (200):
```json
[
  {
    "id": 1,
    "project_id": 1,
    "user_id": 1,
    "user": { "id": 1, "name": "John" },
    "action": "created_task",
    "entity_type": "task",
    "entity_id": 5,
    "changes": {
      "title": "Design database schema"
    },
    "created_at": "2026-02-17T10:00:00Z"
  }
]
```

---

### Get Dashboard Statistics
**GET** `/dashboard/stats`

Requires: Authentication

Response (200):
```json
{
  "active_projects": 3,
  "total_tasks": 25,
  "tasks_due_today": 3,
  "overdue_tasks": 1,
  "completed_tasks": 15,
  "completion_rate": 60,
  "team_members": 8,
  "pending_invites": 2
}
```

---

## Notifications Endpoints

### List User Notifications
**GET** `/notifications`

Requires: Authentication

Query Parameters:
- `is_read` - Filter by read status
- `limit` - Number of notifications

Response (200):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "task_assigned",
    "related_entity_id": 5,
    "is_read": false,
    "created_at": "2026-02-17T10:00:00Z"
  }
]
```

---

### Mark Notification as Read
**PATCH** `/notifications/{id}/read`

Requires: Authentication

Response (200):
```json
{
  "id": 1,
  "is_read": true
}
```

---

### Delete Notification
**DELETE** `/notifications/{id}`

Requires: Authentication

Response (200):
```json
{
  "message": "Notification deleted"
}
```

---

## Error Responses

All errors follow this format:

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details (development only)"
}
```

---

## Rate Limiting

All endpoints are rate limited to prevent abuse:
- 60 requests per minute per IP
- 1000 requests per hour per authenticated user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1645101600
```

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Get projects
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer $TOKEN"

# Create project
curl -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Test project"
  }'
```

---

## WebSocket Events (Real-time)

Listen on channels:
- `project.{id}` - Project updates
- `task.{id}` - Task updates
- `user.{id}` - User notifications

Events:
- `project.created`
- `project.updated`
- `task.created`
- `task.updated`
- `task.status.changed`
- `comment.added`
- `notification.new`

---

For more details, see `ARCHITECTURE.md` and `LARAVEL_BACKEND_SETUP.md`.
