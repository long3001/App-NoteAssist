import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: { email: string; password: string; displayName: string }) =>
    api.post('/api/auth/register', data),
  login: (idToken: string) => api.post('/api/auth/login', { idToken }),
  getProfile: (uid: string) => api.get(`/api/auth/profile/${uid}`),
  updateProfile: (uid: string, data: { displayName?: string; email?: string }) =>
    api.put(`/api/auth/profile/${uid}`, data),
  deleteProfile: (uid: string) => api.delete(`/api/auth/profile/${uid}`),
};

export const notes = {
  getAll: (params?: {
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => api.get('/api/notes', { params }),
  getOne: (id: string) => api.get(`/api/notes/${id}`),
  create: (data: {
    title: string;
    content: string;
    category?: string;
    tags?: string[];
  }) => api.post('/api/notes', data),
  update: (
    id: string,
    data: {
      title?: string;
      content?: string;
      category?: string;
      tags?: string[];
    }
  ) => api.put(`/api/notes/${id}`, data),
  delete: (id: string) => api.delete(`/api/notes/${id}`),
  getCategories: () => api.get('/api/notes/categories'),
};

export const speech = {
  transcribe: (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    return api.post('/api/speech/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getStatus: (id: string) => api.get(`/api/speech/status/${id}`),
};

export default api; 