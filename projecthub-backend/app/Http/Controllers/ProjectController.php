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
}
