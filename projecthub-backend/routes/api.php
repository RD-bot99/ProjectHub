<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectMemberController;

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    
    // Project routes
    Route::apiResource('projects', ProjectController::class);
    
    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::get('/projects/{project}/tasks', [TaskController::class, 'indexByProject']);
    
    // Project member routes
    Route::apiResource('project-members', ProjectMemberController::class);
    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'addMember']);
    Route::delete('/projects/{project}/members/{user}', [ProjectMemberController::class, 'removeMember']);
});
