<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Task;

class TaskPolicy
{
    public function update(User $user, Task $task)
    {
        return $task->project->owner_id === $user->id ||
               $task->project->members()
                   ->where('user_id', $user->id)
                   ->whereIn('role', ['admin', 'manager'])
                   ->exists() ||
               $task->assigned_to === $user->id;
    }

    public function delete(User $user, Task $task)
    {
        return $task->project->owner_id === $user->id ||
               $task->project->members()
                   ->where('user_id', $user->id)
                   ->where('role', 'admin')
                   ->exists() ||
               $task->created_by === $user->id;
    }
}
