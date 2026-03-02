<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;
use App\Models\Project;
use App\Models\ActivityLog;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query()
            ->whereHas('project.members', function ($q) {
                $q->where('user_id', auth()->id());
            });

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        return response()->json($query->with(['assignedTo', 'creator'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $project = Project::findOrFail($validated['project_id']);
        
        // Ensure user is member of project
        if (!$project->members()->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated['created_by'] = auth()->id();
        $task = Task::create($validated);

        ActivityLog::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'action' => 'created_task',
            'entity_type' => 'task',
            'entity_id' => $task->id,
        ]);

        return response()->json($task->load(['assignedTo', 'creator']), 201);
    }

    public function show(Task $task)
    {
        // Simple auth check
        if (!$task->project->members()->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task->load(['assignedTo', 'creator', 'comments.user']));
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'in:todo,in_progress,in_review,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        ActivityLog::create([
            'project_id' => $task->project_id,
            'user_id' => auth()->id(),
            'action' => 'updated_task',
            'entity_type' => 'task',
            'entity_id' => $task->id,
        ]);

        return response()->json($task->fresh(['assignedTo', 'creator']));
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }
}
