'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/context/ProjectsContext';
import type { Task, TeamMember } from '@/context/ProjectsContext';

interface ProjectDetailProps {
  projectId: string;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const router = useRouter();
  const { getProject, updateProjectTasks, updateProjectMembers, addTaskToGlobal } = useProjects();
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'manager' | 'member'>('member');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Task['status']>>({});
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Get project from context
  const contextProject = getProject(projectId);
  const [tasks, setTasks] = useState<Task[]>(contextProject?.tasks || []);
  const [projectMembers, setProjectMembers] = useState<TeamMember[]>(contextProject?.teamMembers || []);

  // Sync tasks and members when context changes
  useEffect(() => {
    const project = getProject(projectId);
    if (project) {
      setTasks(project.tasks || []);
      setProjectMembers(project.teamMembers || []);
    }
  }, [projectId, getProject]);

  // Fallback project data in case context is empty
  const project = contextProject || {
    id: projectId,
    name: 'Website Redesign',
    description: 'Complete redesign of the main website with modern UI/UX principles and improved user experience',
    status: 'active' as const,
    startDate: '2026-01-15',
    endDate: '2026-04-30',
  };

  // Calculate progress dynamically based on completed tasks
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const progress = calculateProgress();

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: String(Date.now()),
        title: newTaskTitle,
        description: 'New task',
        status: 'todo',
        priority: 'medium',
        assignedTo: 'Unassigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectName: project.name,
      };
      setTasks([...tasks, newTask]);
      addTaskToGlobal(newTask);
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setPendingChanges({ ...pendingChanges, [taskId]: newStatus });
  };

  const handleSaveChanges = () => {
    const updatedTasks = tasks.map(task => 
      pendingChanges[task.id] ? { ...task, status: pendingChanges[task.id] } : task
    );
    setTasks(updatedTasks);
    updateProjectTasks(projectId, updatedTasks);
    setPendingChanges({});
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleCancelChanges = () => {
    setPendingChanges({});
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim()) {
      const newMember: TeamMember = {
        id: String(projectMembers.length + 1),
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
      };
      const updatedMembers = [...projectMembers, newMember];
      setProjectMembers(updatedMembers);
      updateProjectMembers(projectId, updatedMembers);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberRole('member');
      setShowAddMember(false);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      const updatedMembers = projectMembers.filter(member => member.id !== memberId);
      setProjectMembers(updatedMembers);
      updateProjectMembers(projectId, updatedMembers);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setNewMemberName(member.name);
    setNewMemberEmail(member.email);
    setNewMemberRole(member.role);
    setShowEditMember(true);
  };

  const handleUpdateMember = () => {
    if (editingMemberId && newMemberName.trim() && newMemberEmail.trim()) {
      const updatedMembers = projectMembers.map(member =>
        member.id === editingMemberId
          ? { ...member, name: newMemberName, email: newMemberEmail, role: newMemberRole }
          : member
      );
      setProjectMembers(updatedMembers);
      updateProjectMembers(projectId, updatedMembers);
      setEditingMemberId(null);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberRole('member');
      setShowEditMember(false);
    }
  };

  const statusColors = {
    active: 'bg-secondary/20 text-secondary',
    archived: 'bg-muted/20 text-muted-foreground',
    completed: 'bg-accent/20 text-accent',
  };

  const priorityColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  const taskStatusColors = {
    todo: 'bg-muted/20 text-muted-foreground',
    'in-progress': 'bg-secondary/20 text-secondary',
    completed: 'bg-accent/20 text-accent',
  };

  return (
    <div className="space-y-6">
      {showSaveNotification && (
        <div className="p-4 bg-accent/20 border border-accent/50 rounded-md flex items-center gap-2">
          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <p className="text-sm font-medium text-accent">Changes saved successfully!</p>
        </div>
      )}

      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Status</p>
          <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Progress</p>
          <p className="text-2xl font-bold text-foreground">{progress}%</p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Due Date</p>
          <p className="text-lg font-semibold text-foreground">
            {new Date(project.endDate).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Budget</p>
          <p className="text-lg font-semibold text-foreground">{project.budget}</p>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Tasks</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowAddTask(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{task.assignedTo}</span>
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <select
                value={pendingChanges[task.id] || task.status}
                onChange={(e) => handleTaskStatusChange(task.id, e.target.value as Task['status'])}
                className={`px-3 py-1 text-xs rounded-full font-medium border-0 cursor-pointer transition-colors ${
                  pendingChanges[task.id] 
                    ? 'bg-secondary/40 text-secondary border-2 border-secondary' 
                    : taskStatusColors[task.status]
                }`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>

        {hasChanges && (
          <div className="mt-4 flex gap-2 p-3 bg-secondary/10 rounded-md border border-secondary/30">
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary">
                {Object.keys(pendingChanges).length} change{Object.keys(pendingChanges).length > 1 ? 's' : ''} pending
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelChanges}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveChanges}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Team Members Section */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Team Members ({projectMembers.length})</h2>
          <Button size="sm" onClick={() => setShowAddMember(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {projectMembers.map((member) => (
            <div key={member.id} className="p-4 bg-muted/30 rounded-md text-center relative group">
              <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground mb-3">{member.email}</p>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                {member.role}
              </span>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEditMember(member)}
                  className="flex-1 text-xs px-2 py-1 bg-secondary/20 text-secondary rounded hover:bg-secondary/30 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="flex-1 text-xs px-2 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Add Task to {project.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddTask(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddTask}>Add Task</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Add Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'admin' | 'manager' | 'member')}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddMember(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddMember}>Add Member</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {showEditMember && editingMemberId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Edit Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'admin' | 'manager' | 'member')}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => { setShowEditMember(false); setEditingMemberId(null); }} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleUpdateMember}>Update Member</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
