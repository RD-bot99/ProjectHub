'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '@/lib/api-client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assignedTo?: string;
  status: 'todo' | 'in_progress' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  dueDate?: string;
  projectName?: string;
  project_id?: string;
  created_by?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'team_member' | 'member';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  members?: number;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  tasks?: Task[];
  teamMembers?: TeamMember[];
  owner_id?: string;
}

interface ProjectsContextType {
  projects: Project[];
  globalTasks: Task[];
  isLoading: boolean;
  getProject: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  updateProjectTasks: (projectId: string, tasks: Task[]) => void;
  updateProjectMembers: (projectId: string, members: TeamMember[]) => void;
  addProject: (project: Project) => void;
  addTaskToGlobal: (task: Task) => void;
  updateGlobalTask: (taskId: string, task: Partial<Task>) => void;
  deleteGlobalTask: (taskId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [globalTasks, setGlobalTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch projects from API
  const refreshProjects = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const data = await apiClient.getProjects(token);
      const projectsData = Array.isArray(data) ? data : data.data || [];
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch tasks from API
  const refreshTasks = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const data = await apiClient.getTasks(token);
      const tasksData = Array.isArray(data) ? data : data.data || [];
      setGlobalTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch data on mount and when token changes
  useEffect(() => {
    if (token) {
      refreshProjects();
      refreshTasks();
    }
  }, [token, refreshProjects, refreshTasks]);

  const getProject = (id: string): Project | undefined => {
    return projects.find(p => p.id === id || p.id === String(id));
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

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const addTaskToGlobal = (task: Task) => {
    setGlobalTasks([...globalTasks, task]);
  };

  const updateGlobalTask = (taskId: string, taskUpdates: Partial<Task>) => {
    setGlobalTasks(globalTasks.map(task =>
      task.id === taskId ? { ...task, ...taskUpdates } : task
    ));
  };

  const deleteGlobalTask = (taskId: string) => {
    setGlobalTasks(globalTasks.filter(task => task.id !== taskId));
  };

  const value: ProjectsContextType = {
    projects,
    globalTasks,
    isLoading,
    getProject,
    refreshProjects,
    refreshTasks,
    updateProjectTasks,
    updateProjectMembers,
    addProject,
    addTaskToGlobal,
    updateGlobalTask,
    deleteGlobalTask,
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
