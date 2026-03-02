'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectName?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  members: number;
  startDate: string;
  endDate: string;
  tasks?: Task[];
  teamMembers?: TeamMember[];
}

interface ProjectsContextType {
  projects: Project[];
  globalTasks: Task[];
  isLoading: boolean;
  error: string | null;
  getProject: (id: string) => Project | undefined;
  updateProjectTasks: (projectId: string, tasks: Task[]) => void;
  updateProjectMembers: (projectId: string, members: TeamMember[]) => void;
  addProject: (project: Project) => Promise<void>;
  addTaskToGlobal: (task: Task) => Promise<void>;
  updateGlobalTask: (taskId: string, task: Partial<Task>) => Promise<void>;
  deleteGlobalTask: (taskId: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the main website with modern UI/UX principles',
    status: 'active',
    members: 5,
    startDate: '2026-01-15',
    endDate: '2026-04-30',
    tasks: [
      {
        id: '1',
        title: 'Design wireframes',
        assignedTo: 'Sarah Designer',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-02-15',
      },
      {
        id: '2',
        title: 'Frontend development',
        assignedTo: 'John Developer',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-03-31',
      },
      {
        id: '3',
        title: 'Backend API setup',
        assignedTo: 'Mike Backend',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2026-03-15',
      },
      {
        id: '4',
        title: 'Testing and QA',
        assignedTo: 'Lisa QA',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-04-15',
      },
    ],
    teamMembers: [
      { id: '1', name: 'Sarah Designer', email: 'sarah@example.com', role: 'manager' },
      { id: '2', name: 'John Developer', email: 'john@example.com', role: 'member' },
      { id: '3', name: 'Mike Backend', email: 'mike@example.com', role: 'member' },
      { id: '4', name: 'Lisa QA', email: 'lisa@example.com', role: 'member' },
      { id: '5', name: 'Tom PM', email: 'tom@example.com', role: 'admin' },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for our platform',
    status: 'active',
    members: 4,
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    tasks: [
      {
        id: '5',
        title: 'Design mockups',
        assignedTo: 'Alex Designer',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-02-28',
      },
      {
        id: '6',
        title: 'iOS development',
        assignedTo: 'Chris iOS Dev',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-05-31',
      },
    ],
    teamMembers: [
      { id: '6', name: 'Alex Designer', email: 'alex@example.com', role: 'manager' },
      { id: '7', name: 'Chris iOS Dev', email: 'chris@example.com', role: 'member' },
    ],
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for enhanced functionality',
    status: 'completed',
    members: 3,
    startDate: '2025-12-01',
    endDate: '2026-01-31',
  },
];

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [globalTasks, setGlobalTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      const mappedProjects = data.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description || '',
        status: p.status || 'active',
        members: p.members?.length || 0,
        startDate: p.start_date || new Date().toISOString().split('T')[0],
        endDate: p.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: p.tasks?.map((t: any) => ({
          id: String(t.id),
          title: t.title,
          description: t.description,
          assignedTo: t.assigned_to ? String(t.assigned_to) : 'Unassigned',
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          dueDate: t.due_date || '',
          projectName: p.name,
        })) || [],
        teamMembers: p.members?.map((m: any) => ({
          id: String(m.user_id),
          name: m.user?.name || '',
          email: m.user?.email || '',
          role: m.role || 'member',
        })) || [],
      }));
      setProjects(mappedProjects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, API_URL]);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      const mappedTasks = data.map((t: any) => ({
        id: String(t.id),
        title: t.title,
        description: t.description,
        assignedTo: t.assigned_to ? String(t.assigned_to) : 'Unassigned',
        status: t.status || 'todo',
        priority: t.priority || 'medium',
        dueDate: t.due_date || '',
        projectName: t.project?.name || 'Unassigned',
      }));
      setGlobalTasks(mappedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, API_URL]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchTasks();
    }
  }, [isAuthenticated, token, fetchProjects, fetchTasks]);

  const getProject = (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  };

  const updateProjectTasks = (projectId: string, tasks: Task[]) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, tasks } : p
    ));
  };

  const updateProjectMembers = (projectId: string, members: TeamMember[]) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, teamMembers: members } : p
    ));
  };

  const addProject = async (project: Project) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          start_date: project.startDate,
          end_date: project.endDate,
        }),
      });

      if (!response.ok) throw new Error('Failed to create project');

      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  };

  const addTaskToGlobal = async (task: Task) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const project = projects.find(p => p.name === task.projectName);
      if (!project) throw new Error('Project not found');

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.dueDate,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      await fetchTasks();
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateGlobalTask = async (taskId: string, taskUpdates: Partial<Task>) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskUpdates.title,
          description: taskUpdates.description,
          status: taskUpdates.status,
          priority: taskUpdates.priority,
          due_date: taskUpdates.dueDate,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      await fetchTasks();
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteGlobalTask = async (taskId: string) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete task');

      await fetchTasks();
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  const value: ProjectsContextType = {
    projects,
    globalTasks,
    isLoading,
    error,
    getProject,
    updateProjectTasks,
    updateProjectMembers,
    addProject,
    addTaskToGlobal,
    updateGlobalTask,
    deleteGlobalTask,
    fetchProjects,
    fetchTasks,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
};
