import axios from "axios";

// Vite proxies /api to FastAPI on port 8000.
// Using a relative URL avoids localhost:5173/5174/5175 CORS problems.
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 180000
});

export const getCareers = () => API.get("/careers");
export const createUser = (data) => API.post("/users", data);
export const runAnalysis = (data) => API.post("/analysis", data, { timeout: 180000 });

export const resumeAnalyze = (file) => {
  const form = new FormData();
  form.append("file", file);
  return API.post("/resume/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 180000
  });
};

export const getHistory = (userId) => API.get(`/analysis/history/${userId}`);
export const whatIf = (data) => API.post("/what-if", data);
