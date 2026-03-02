<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\ActivityLog;

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

    public function getMembers(Project $project)
    {
        return response()->json($project->members()->with('user')->get());
    }

    public function addMember(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,manager,member',
        ]);

        $existingMember = $project->members()->where('user_id', $validated['user_id'])->first();
        
        if ($existingMember) {
            return response()->json(['message' => 'User is already a member'], 400);
        }

        $member = ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
        ]);

        ActivityLog::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'action' => 'added_member',
            'entity_type' => 'member',
            'entity_id' => $member->id,
        ]);

        return response()->json($member->load('user'), 201);
    }

    public function updateMemberRole(Request $request, Project $project, $userId)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'role' => 'required|in:admin,manager,member',
        ]);

        $member = $project->members()->where('user_id', $userId)->firstOrFail();
        $member->update($validated);

        ActivityLog::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'action' => 'updated_member_role',
            'entity_type' => 'member',
            'entity_id' => $member->id,
        ]);

        return response()->json($member->load('user'));
    }

    public function removeMember(Project $project, $userId)
    {
        $this->authorize('update', $project);

        $member = $project->members()->where('user_id', $userId)->firstOrFail();
        $member->delete();

        ActivityLog::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'action' => 'removed_member',
            'entity_type' => 'member',
            'entity_id' => $member->id,
        ]);

        return response()->json(['message' => 'Member removed']);
    }
}
