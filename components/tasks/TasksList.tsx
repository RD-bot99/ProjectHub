'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/context/ProjectsContext';
import { useAuth } from '@/context/AuthContext';
import type { Task } from '@/context/ProjectsContext';

export const TasksList: React.FC = () => {
  const { user, role } = useAuth();
  const { globalTasks, projects, addTaskToGlobal, updateGlobalTask, deleteGlobalTask } = useProjects();
  const [filter, setFilter] = useState<'all' | 'assigned' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskProject, setNewTaskProject] = useState(projects[0]?.name || '');

  // Role-based access control
  const canCreateTask = role !== 'member' || true; // All roles can create tasks
  const canEditTask = (task: Task) => role === 'admin' || role === 'manager' || task.assignedTo === user?.id;
  const canDeleteTask = (task: Task) => role === 'admin' || role === 'manager';

  const handleCreateTask = () => {
    if (newTaskTitle.trim() && newTaskProject.trim()) {
      addTaskToGlobal({
        id: String(Date.now()),
        title: newTaskTitle,
        description: 'Task description',
        status: 'todo',
        priority: newTaskPriority,
        assignedTo: 'You',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectName: newTaskProject,
      });
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskProject(projects[0]?.name || '');
      setShowCreateModal(false);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const task = globalTasks.find(t => t.id === taskId);
    if (task) {
      updateGlobalTask(taskId, {
        status: task.status === 'completed' ? 'todo' : 'completed'
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteGlobalTask(taskId);
    }
  };

  const filteredTasks = globalTasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'assigned') return task.assignedTo === 'You';
    if (priorityFilter !== 'all') return task.priority === priorityFilter;
    return true;
  });

  const statusColors = {
    todo: 'bg-muted/20 text-muted-foreground',
    in_progress: 'bg-secondary/20 text-secondary',
    in_review: 'bg-accent/20 text-accent',
    completed: 'bg-primary/20 text-primary',
  };

  const priorityColors = {
    low: 'bg-muted/20 text-muted-foreground',
    medium: 'bg-secondary/20 text-secondary',
    high: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
        {canCreateTask && (
          <Button onClick={() => setShowCreateModal(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-border pb-4">
        <div className="flex gap-2">
          {['all', 'assigned', 'completed'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as 'all' | 'assigned' | 'completed')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                filter === filterOption
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4 border-border/50 hover:border-primary/50 cursor-pointer transition-colors">
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => handleTaskToggle(task.id)}
                className="w-5 h-5 rounded border-border text-primary mt-1 cursor-pointer"
              />

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${priorityColors[task.priority]}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {task.description}
                </p>

                <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground justify-between">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-2 py-1 rounded-full ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </span>
                    <span>{task.projectName}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                      {task.assignedTo.charAt(0)}
                    </div>
                  </div>
                  {canDeleteTask(task) && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      title="Delete task"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Project *</label>
                {projects.length > 0 ? (
                  <select
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-destructive">No projects available. Create a project first.</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleCreateTask}
                  disabled={!newTaskTitle.trim() || !newTaskProject.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
