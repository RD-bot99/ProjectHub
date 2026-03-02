<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;

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
