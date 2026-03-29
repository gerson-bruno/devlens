import axios from "axios";

let token = "";

export const setToken = (newToken) => {
  token = newToken;
};

const api = axios.create({
  baseURL: "https://api.github.com"
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUser = (username) =>
  api.get(`/users/${username}`);

export const getRepos = (username) =>
  api.get(`/users/${username}/repos?per_page=100`);

export const getRepoLanguages = (url) =>
  api.get(url);