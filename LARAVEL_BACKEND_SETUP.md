# Laravel Backend - Complete Setup & Implementation

## Quick Start (5 minutes)

```bash
# 1. Create Laravel project
composer create-project laravel/laravel projecthub-backend
cd projecthub-backend

# 2. Install dependencies
composer require tymon/jwt-auth laravel/sanctum

# 3. Publish configuration
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"

# 4. Generate JWT secret
php artisan jwt:secret

# 5. Update .env with database credentials
# Edit .env and set your DB_* variables

# 6. Run migrations
php artisan migrate

# 7. Start server
php artisan serve
```

---

## Phase 1: Database Setup (30 minutes)

### 1.1 Update Database Credentials

Edit `.env`:

```env
DB_CONNECTION=pgsql  # or mysql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=projecthub
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
```

### 1.2 Create Migrations

```bash
# Users (already exists, modify as needed)
php artisan make:migration create_users_table --create=users

# Roles
php artisan make:migration create_roles_table --create=roles

# User Roles (pivot table)
php artisan make:migration create_role_user_table --create=role_user

# Projects
php artisan make:migration create_projects_table --create=projects

# Project Members
php artisan make:migration create_project_members_table --create=project_members

# Tasks
php artisan make:migration create_tasks_table --create=tasks

# Comments
php artisan make:migration create_comments_table --create=comments

# Activity Logs
php artisan make:migration create_activity_logs_table --create=activity_logs

# Notifications
php artisan make:migration create_notifications_table --create=notifications
```

### 1.3 Migration Code Examples

**Users Migration:**

```php
// database/migrations/[timestamp]_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('name');
    $table->string('password');
    $table->string('avatar_url')->nullable();
    $table->timestamps();
});
```

**Projects Migration:**

```php
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
    $table->enum('status', ['active', 'archived', 'completed'])->default('active');
    $table->date('start_date')->nullable();
    $table->date('end_date')->nullable();
    $table->timestamps();
});
```

**Tasks Migration:**

```php
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
    $table->string('title');
    $table->text('description')->nullable();
    $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
    $table->enum('status', ['todo', 'in_progress', 'in_review', 'completed'])->default('todo');
    $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
    $table->date('due_date')->nullable();
    $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
    $table->timestamps();
});
```

**Comments Migration:**

```php
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->text('content');
    $table->timestamps();
});
```

**Activity Logs Migration:**

```php
Schema::create('activity_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('cascade');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->string('action');
    $table->string('entity_type');
    $table->unsignedBigInteger('entity_id');
    $table->json('changes')->nullable();
    $table->timestamps();
});
```

**Notifications Migration:**

```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->string('type');
    $table->unsignedBigInteger('related_entity_id');
    $table->boolean('is_read')->default(false);
    $table->timestamps();
});
```

### 1.4 Run Migrations

```bash
php artisan migrate
```

---

## Phase 2: Models & Relationships (45 minutes)

### 2.1 Create Models

```bash
php artisan make:model User
php artisan make:model Role
php artisan make:model Project
php artisan make:model ProjectMember
php artisan make:model Task
php artisan make:model Comment
php artisan make:model ActivityLog
php artisan make:model Notification
```

### 2.2 Model Code Examples

**User Model:**

```php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = ['name', 'email', 'password', 'avatar_url'];
    protected $hidden = ['password'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    public function projectMembers()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }
}
```

**Project Model:**

```php
class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'owner_id', 'status', 'start_date', 'end_date'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function activities()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
```

**Task Model:**

```php
class Task extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'title', 'description', 'assigned_to', 'status', 'priority', 'due_date', 'created_by'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

---

## Phase 3: Authentication API (1 hour)

### 3.1 Create Auth Controller

```bash
php artisan make:controller AuthController
```

### 3.2 AuthController Implementation

```php
// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Default role assignment
        $user->roles()->attach(3); // Assuming role_id 3 is 'team_member'

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => JWTAuth::user(),
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function refresh()
    {
        $token = JWTAuth::refresh();
        return response()->json(['token' => $token]);
    }
}
```

### 3.3 Create Routes

```php
// routes/api.php
Route::middleware('api')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    });
});
```

### 3.4 Configure JWT Auth

```php
// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

---

## Phase 4: CRUD Endpoints (2 hours)

### 4.1 Create Controllers

```bash
php artisan make:controller ProjectController --resource
php artisan make:controller TaskController --resource
php artisan make:controller CommentController --resource
php artisan make:controller ActivityLogController
php artisan make:controller NotificationController
```

### 4.2 ProjectController Example

```php
// app/Http/Controllers/ProjectController.php
class ProjectController extends Controller
{
    public function index()
    {
        $projects = auth()->user()->projects()->with('members')->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $project = auth()->user()->projects()->create($validated);
        
        // Add creator as project admin
        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'role' => 'admin',
        ]);

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return response()->json($project->load('members', 'tasks'));
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'string',
            'description' => 'nullable|string',
            'status' => 'in:active,archived,completed',
        ]);

        $project->update($validated);
        
        // Log activity
        ActivityLog::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'action' => 'updated_project',
            'entity_type' => 'project',
            'entity_id' => $project->id,
        ]);

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
```

### 4.3 Register All Routes

```php
// routes/api.php
Route::middleware('auth:api')->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('tasks.comments', CommentController::class);
    
    Route::get('/projects/{project}/activity', [ActivityLogController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/notifications', [NotificationController::class, 'index']);
});
```

---

## Phase 5: Middleware & Authorization (45 minutes)

### 5.1 Create Authorization Policies

```bash
php artisan make:policy ProjectPolicy
php artisan make:policy TaskPolicy
```

### 5.2 ProjectPolicy Implementation

```php
// app/Policies/ProjectPolicy.php
class ProjectPolicy
{
    public function view(User $user, Project $project)
    {
        return $project->members()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function update(User $user, Project $project)
    {
        return $project->owner_id === $user->id ||
               $project->members()
                   ->where('user_id', $user->id)
                   ->where('role', 'admin')
                   ->exists();
    }

    public function delete(User $user, Project $project)
    {
        return $project->owner_id === $user->id;
    }
}
```

### 5.3 Create CORS Middleware

```bash
php artisan make:middleware CorsMiddleware
```

```php
// app/Http/Middleware/CorsMiddleware.php
class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->header('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return $response;
    }
}
```

Register in `app/Http/Kernel.php`:

```php
protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\CorsMiddleware::class,
];
```

---

## Phase 6: Seeding & Testing (30 minutes)

### 6.1 Create Seeder

```bash
php artisan make:seeder DatabaseSeeder
```

```php
// database/seeders/DatabaseSeeder.php
public function run()
{
    // Create roles
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'manager']);
    Role::create(['name' => 'team_member']);

    // Create test user
    $user = User::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
    ]);
    $user->roles()->attach(1); // admin role

    // Create projects
    $project = Project::create([
        'name' => 'Test Project',
        'description' => 'Test project for development',
        'owner_id' => $user->id,
    ]);

    // Create tasks
    Task::create([
        'project_id' => $project->id,
        'title' => 'Test Task',
        'assigned_to' => $user->id,
        'created_by' => $user->id,
    ]);
}
```

Run seeder:

```bash
php artisan migrate:fresh --seed
```

### 6.2 Test Endpoints

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get projects (with token from login)
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Complete File Checklist

- [ ] Database migrations created and run
- [ ] Models created with relationships
- [ ] AuthController implemented
- [ ] JWT configured
- [ ] CORS configured
- [ ] All route endpoints defined
- [ ] Authorization policies created
- [ ] Error handling middleware added
- [ ] Seeder created
- [ ] .env configured with DB credentials

---

## Common Issues & Solutions

**JWT Token Invalid**
```bash
# Regenerate secret
php artisan jwt:secret
```

**Database Connection Failed**
```bash
# Verify .env DB credentials
php artisan migrate --verbose
```

**CORS Errors**
```bash
# Update CORS middleware to match frontend origin
# Then restart: php artisan serve
```

**404 on API Routes**
```bash
# Verify routes in routes/api.php
php artisan route:list
```

---

## Next: Connect Frontend & Backend

Once all endpoints are working, update the React frontend's API calls to point to your Laravel backend. See `SETUP_GUIDE.md` Part 3 for integration steps.

Happy coding!
