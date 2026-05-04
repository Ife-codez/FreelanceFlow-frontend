import api from "./axios";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.projects;
};

export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.project;
};

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data.project;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data.project;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};