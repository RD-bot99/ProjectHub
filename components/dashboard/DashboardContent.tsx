'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/context/ProjectsContext';
import { useAuth } from '@/context/AuthContext';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent' | 'chart-1' | 'chart-2';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    'chart-1': 'text-[#4DA6FF]',
    'chart-2': 'text-[#FFB84D]',
  };

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-3 bg-${color}/10 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export const DashboardContent: React.FC = () => {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const { projects, globalTasks, addTaskToGlobal } = useProjects();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newInviteEmail, setNewInviteEmail] = useState('');

  // Calculate stats based on role
  const getStats = () => {
    const isAdmin = hasRole('admin');
    const isManager = hasRole('manager');
    const isMember = hasRole('team_member');

    if (isAdmin) {
      return {
        activeProjects: projects.filter(p => p.status === 'active').length,
        tasksToday: globalTasks.filter(t => t.status !== 'completed').length,
        teamMembers: projects.reduce((acc, p) => acc + (p.members || 0), 0),
        completionRate: `${Math.round((globalTasks.filter(t => t.status === 'completed').length / globalTasks.length) * 100)}%`,
      };
    } else if (isManager) {
      return {
        activeProjects: projects.filter(p => p.status === 'active').length,
        tasksToday: globalTasks.filter(t => t.status !== 'completed' && (t.assigned_to === user?.id || t.assignedTo === user?.id)).length,
        teamMembers: projects.reduce((acc, p) => acc + (p.members || 0), 0),
        completionRate: `${Math.round((globalTasks.filter(t => t.status === 'completed').length / globalTasks.length) * 100)}%`,
      };
    } else {
      return {
        activeProjects: projects.filter(p => p.status === 'active').length,
        tasksToday: globalTasks.filter(t => t.status !== 'completed' && (t.assigned_to === user?.id || t.assignedTo === user?.id)).length,
        teamMembers: 0,
        completionRate: `${Math.round((globalTasks.filter(t => t.status === 'completed' && (t.assigned_to === user?.id || t.assignedTo === user?.id)).length / (globalTasks.filter(t => t.assigned_to === user?.id || t.assignedTo === user?.id).length || 1)) * 100)}%`,
      };
    }
  };

  const stats = getStats();

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      setShowNewProjectModal(false);
      setNewProjectName('');
      router.push('/projects');
    }
  };

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      addTaskToGlobal({
        id: String(Date.now()),
        title: newTaskTitle,
        description: 'Task description',
        status: 'todo' as const,
        priority: newTaskPriority,
        assignedTo: 'You',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setShowNewTaskModal(false);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      router.push('/tasks');
    }
  };

  const handleInviteTeam = () => {
    if (newInviteEmail.trim()) {
      setShowInviteModal(false);
      setNewInviteEmail('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Active Projects"
          value={stats.activeProjects}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="primary"
        />
        <StatCard
          label="Tasks Today"
          value={stats.tasksToday}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          color="secondary"
        />
        <StatCard
          label="Team Members"
          value={stats.teamMembers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20H1v-2a3 3 0 015.856-1.487M13 16a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          color="accent"
        />
        <StatCard
          label="Completion Rate"
          value={stats.completionRate}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="chart-1"
        />
      </div>

      {/* Recent Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="p-6 border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
            <Link href="/projects" className="text-primary hover:underline text-sm">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Website Redesign', progress: 65, status: 'In Progress' },
              { name: 'Mobile App Development', progress: 40, status: 'In Progress' },
              { name: 'API Integration', progress: 90, status: 'Almost Done' },
            ].map((project, idx) => (
              <div key={idx} className="pb-4 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{project.name}</p>
                  <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full">
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{project.progress}% Complete</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>

          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => setShowNewProjectModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Project
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => setShowNewTaskModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Task
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => setShowInviteModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20H1v-2a3 3 0 015.856-1.487M13 16a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Invite Team Members
            </Button>
          </div>

          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm text-foreground font-medium mb-2">Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              Use keyboard shortcuts to navigate faster. Press '?' for help.
            </p>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>

        <div className="space-y-4">
          {[
            { action: 'created task', entity: 'Setup database', time: '2 hours ago', user: 'You' },
            { action: 'updated project', entity: 'Website Redesign', time: '4 hours ago', user: 'Sarah' },
            { action: 'commented on task', entity: 'API endpoint design', time: '6 hours ago', user: 'John' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-sm font-bold">
                  {activity.user.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium text-primary">{activity.entity}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Project Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewProjectModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateProject}>Create</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Create Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Add New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTaskModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateTask}>Create</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Invite Team Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleInviteTeam}>Send Invite</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
