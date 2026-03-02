<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use App\Models\ProjectMember;
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
        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $teamMemberRole = Role::firstOrCreate(['name' => 'team_member']);

        // Create test users
        // Admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Admin123!'),
            ]
        );
        if (!$adminUser->roles()->where('role_id', $adminRole->id)->exists()) {
            $adminUser->roles()->attach($adminRole->id);
        }

        // Manager user
        $managerUser = User::firstOrCreate(
            ['email' => 'manager@test.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('Manager123!'),
            ]
        );
        if (!$managerUser->roles()->where('role_id', $managerRole->id)->exists()) {
            $managerUser->roles()->attach($managerRole->id);
        }

        // Team member user
        $memberUser = User::firstOrCreate(
            ['email' => 'member@test.com'],
            [
                'name' => 'Team Member User',
                'password' => Hash::make('Member123!'),
            ]
        );
        if (!$memberUser->roles()->where('role_id', $teamMemberRole->id)->exists()) {
            $memberUser->roles()->attach($teamMemberRole->id);
        }

        // Create test project
        $project = Project::firstOrCreate(
            ['name' => 'Test Project'],
            [
                'description' => 'Test project for development',
                'owner_id' => $adminUser->id,
                'status' => 'active',
            ]
        );

        // Add project members with proper roles
        ProjectMember::firstOrCreate(
            ['project_id' => $project->id, 'user_id' => $adminUser->id],
            ['role' => 'admin']
        );

        ProjectMember::firstOrCreate(
            ['project_id' => $project->id, 'user_id' => $managerUser->id],
            ['role' => 'admin']
        );

        ProjectMember::firstOrCreate(
            ['project_id' => $project->id, 'user_id' => $memberUser->id],
            ['role' => 'member']
        );

        // Create sample tasks
        Task::firstOrCreate(
            ['title' => 'Setup database', 'project_id' => $project->id],
            [
                'description' => 'Initialize and configure the database schema',
                'assigned_to' => $adminUser->id,
                'created_by' => $adminUser->id,
                'status' => 'in_progress',
                'priority' => 'high',
            ]
        );

        Task::firstOrCreate(
            ['title' => 'Design API endpoints', 'project_id' => $project->id],
            [
                'description' => 'Design RESTful API endpoints for the application',
                'assigned_to' => $managerUser->id,
                'created_by' => $adminUser->id,
                'status' => 'todo',
                'priority' => 'medium',
            ]
        );

        Task::firstOrCreate(
            ['title' => 'Implement frontend components', 'project_id' => $project->id],
            [
                'description' => 'Build React components for the user interface',
                'assigned_to' => $memberUser->id,
                'created_by' => $adminUser->id,
                'status' => 'todo',
                'priority' => 'high',
            ]
        );
    }
}
