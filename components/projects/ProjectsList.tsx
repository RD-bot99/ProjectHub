'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectsContext';
import { useAuth } from '@/context/AuthContext';
import type { Project } from '@/context/ProjectsContext';

export const ProjectsList: React.FC = () => {
  const { role } = useAuth();
  const { projects, addProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const canCreateProject = role === 'admin' || role === 'manager';

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: String(parseInt(projects[projects.length - 1]?.id || '0') + 1),
        name: newProjectName,
        description: newProjectDesc,
        status: 'active',
        members: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        teamMembers: [],
      };
      addProject(newProject);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowCreateModal(false);
    }
  };

  const calculateProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedCount = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedCount / project.tasks.length) * 100);
  };

  const statusColors = {
    active: 'bg-secondary/20 text-secondary',
    archived: 'bg-muted/20 text-muted-foreground',
    completed: 'bg-accent/20 text-accent',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Projects</h2>
        {canCreateProject ? (
          <Button onClick={() => setShowCreateModal(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
            Only managers and admins can create projects
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="p-6 border-border/50 hover:border-primary/50 cursor-pointer transition-colors h-full">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex-1">{project.name}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium text-foreground">{calculateProgress(project)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(project)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20H1v-2a3 3 0 015.856-1.487M13 16a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{project.teamMembers?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Create Project Modal - Placeholder */}
      {showCreateModal && (
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
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
                <textarea
                  placeholder="Project description"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateProject}>Create</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
