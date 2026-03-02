'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  getProject: (id: string) => Project | undefined;
  updateProjectTasks: (projectId: string, tasks: Task[]) => void;
  updateProjectMembers: (projectId: string, members: TeamMember[]) => void;
  addProject: (project: Project) => void;
  addTaskToGlobal: (task: Task) => void;
  updateGlobalTask: (taskId: string, task: Partial<Task>) => void;
  deleteGlobalTask: (taskId: string) => void;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [globalTasks, setGlobalTasks] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects_data');
    const storedTasks = localStorage.getItem('global_tasks');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error('Failed to restore projects:', error);
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
    }
    if (storedTasks) {
      try {
        setGlobalTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Failed to restore tasks:', error);
        setGlobalTasks([]);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('projects_data', JSON.stringify(projects));
      localStorage.setItem('global_tasks', JSON.stringify(globalTasks));
    }
  }, [projects, globalTasks, isInitialized]);

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

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const addTaskToGlobal = (task: Task) => {
    setGlobalTasks([...globalTasks, task]);
    // If task has a project, also add it to that project
    if (task.projectName && task.projectName !== 'Unassigned') {
      setProjects(projects.map(p => 
        p.name === task.projectName 
          ? { ...p, tasks: [...(p.tasks || []), task] }
          : p
      ));
    }
  };

  const updateGlobalTask = (taskId: string, taskUpdates: Partial<Task>) => {
    setGlobalTasks(globalTasks.map(task =>
      task.id === taskId ? { ...task, ...taskUpdates } : task
    ));
    // Also update in projects
    setProjects(projects.map(p => ({
      ...p,
      tasks: p.tasks?.map(t => t.id === taskId ? { ...t, ...taskUpdates } : t)
    })));
  };

  const deleteGlobalTask = (taskId: string) => {
    setGlobalTasks(globalTasks.filter(task => task.id !== taskId));
    // Also remove from projects
    setProjects(projects.map(p => ({
      ...p,
      tasks: p.tasks?.filter(t => t.id !== taskId)
    })));
  };

  const value: ProjectsContextType = {
    projects,
    globalTasks,
    getProject,
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
