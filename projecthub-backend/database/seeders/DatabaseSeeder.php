<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
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
}
