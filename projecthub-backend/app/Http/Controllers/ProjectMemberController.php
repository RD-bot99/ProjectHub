<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;

class ProjectMemberController extends Controller
{
    public function index()
    {
        $members = ProjectMember::with(['user', 'project'])->get();
        return response()->json($members);
    }

    public function addMember(Request $request, Project $project)
    {
        // Check if user is admin of project
        $userRole = $project->members()
            ->where('user_id', auth()->id())
            ->first();

        if (!$userRole || $userRole->role !== 'admin') {
            return response()->json(['message' => 'Only project admins can add members'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,manager,team_member',
        ]);

        // Check if already a member
        if ($project->members()->where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['message' => 'User is already a member'], 409);
        }

        $member = ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
        ]);

        return response()->json($member->load('user'), 201);
    }

    public function removeMember(Request $request, Project $project, User $user)
    {
        // Check if user is admin of project
        $userRole = $project->members()
            ->where('user_id', auth()->id())
            ->first();

        if (!$userRole || $userRole->role !== 'admin') {
            return response()->json(['message' => 'Only project admins can remove members'], 403);
        }

        $project->members()
            ->where('user_id', $user->id)
            ->delete();

        return response()->json(['message' => 'Member removed']);
    }

    public function destroy(ProjectMember $projectMember)
    {
        // Check if user has permission to delete
        if ($projectMember->project->owner_id !== auth()->id() && 
            $projectMember->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $projectMember->delete();
        return response()->json(['message' => 'Member removed']);
    }
}
