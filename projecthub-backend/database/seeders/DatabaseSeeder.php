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
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);
        $memberRole = Role::create(['name' => 'team_member']);

        // Create admin user
        $adminUser = User::create([
            'name' => 'Alice Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);
        $adminUser->roles()->attach($adminRole->id);

        // Create manager user
        $managerUser = User::create([
            'name' => 'Bob Manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password123'),
        ]);
        $managerUser->roles()->attach($managerRole->id);

        // Create team member user
        $memberUser = User::create([
            'name' => 'Charlie Member',
            'email' => 'member@example.com',
            'password' => Hash::make('password123'),
        ]);
        $memberUser->roles()->attach($memberRole->id);

        // Create projects for admin
        $project1 = Project::create([
            'name' => 'Website Redesign',
            'description' => 'Complete redesign of company website',
            'owner_id' => $adminUser->id,
        ]);

        $project2 = Project::create([
            'name' => 'Mobile App',
            'description' => 'New mobile application',
            'owner_id' => $adminUser->id,
        ]);

        // Create project for manager
        $project3 = Project::create([
            'name' => 'API Development',
            'description' => 'Backend API for mobile app',
            'owner_id' => $managerUser->id,
        ]);

        // Add members to projects
        $project1->members()->attach([
            $managerUser->id => ['role' => 'manager'],
            $memberUser->id => ['role' => 'team_member'],
        ]);

        $project2->members()->attach([
            $managerUser->id => ['role' => 'manager'],
        ]);

        $project3->members()->attach([
            $memberUser->id => ['role' => 'team_member'],
        ]);

        // Create tasks for project 1
        Task::create([
            'project_id' => $project1->id,
            'title' => 'Design mockups',
            'description' => 'Create initial design mockups',
            'assigned_to' => $memberUser->id,
            'created_by' => $adminUser->id,
            'status' => 'in_progress',
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Setup frontend framework',
            'description' => 'Setup React and required dependencies',
            'assigned_to' => $managerUser->id,
            'created_by' => $adminUser->id,
            'status' => 'pending',
        ]);

        // Create tasks for project 2
        Task::create([
            'project_id' => $project2->id,
            'title' => 'Mobile app architecture',
            'description' => 'Plan mobile app architecture',
            'assigned_to' => $managerUser->id,
            'created_by' => $adminUser->id,
            'status' => 'pending',
        ]);

        // Create tasks for project 3
        Task::create([
            'project_id' => $project3->id,
            'title' => 'Setup database',
            'description' => 'Design and setup project database',
            'assigned_to' => $memberUser->id,
            'created_by' => $managerUser->id,
            'status' => 'in_progress',
        ]);

        Task::create([
            'project_id' => $project3->id,
            'title' => 'Write API documentation',
            'description' => 'Document all API endpoints',
            'assigned_to' => $memberUser->id,
            'created_by' => $managerUser->id,
            'status' => 'pending',
        ]);
    }
}
