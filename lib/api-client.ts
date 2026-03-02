const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  roles?: string[];
  token?: string;
  user?: any;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<ApiResponse<any>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, passwordConfirmation: string) {
    return this.request<ApiResponse<any>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });
  }

  async logout(token: string) {
    return this.request<ApiResponse<any>>('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  async getMe(token: string) {
    return this.request<ApiResponse<any>>('/auth/me', {
      method: 'GET',
      token,
    });
  }

  async refreshToken(token: string) {
    return this.request<ApiResponse<any>>('/auth/refresh', {
      method: 'POST',
      token,
    });
  }

  // Project endpoints
  async getProjects(token: string) {
    return this.request<any>('/projects', {
      method: 'GET',
      token,
    });
  }

  async getProject(id: string, token: string) {
    return this.request<any>(`/projects/${id}`, {
      method: 'GET',
      token,
    });
  }

  async createProject(data: { name: string; description?: string; start_date?: string; end_date?: string }, token: string) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateProject(id: string, data: Partial<{ name: string; description: string; status: string }>, token: string) {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteProject(id: string, token: string) {
    return this.request<any>(`/projects/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Task endpoints
  async getTasks(token: string, projectId?: string) {
    const params = projectId ? `?project_id=${projectId}` : '';
    return this.request<any>(`/tasks${params}`, {
      method: 'GET',
      token,
    });
  }

  async getTask(id: string, token: string) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'GET',
      token,
    });
  }

  async createTask(data: {
    project_id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    priority?: string;
    due_date?: string;
  }, token: string) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateTask(id: string, data: Partial<{
    title: string;
    description: string;
    assigned_to: string;
    status: string;
    priority: string;
    due_date: string;
  }>, token: string) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteTask(id: string, token: string) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Project member endpoints
  async addProjectMember(projectId: string, data: { user_id: string; role: string }, token: string) {
    return this.request<any>(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async removeProjectMember(projectId: string, userId: string, token: string) {
    return this.request<any>(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
      token,
    });
  }
}

export const apiClient = new ApiClient();
