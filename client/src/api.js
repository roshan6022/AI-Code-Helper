import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/code",
  timeout: 10000, // Optional: add timeout to avoid hanging
});

// Generic helper to handle errors
const handleResponse = async (promise) => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    console.error("❌ API Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "API request failed");
  }
};

export const explainCode = (code) =>
  handleResponse(api.post("/explain", { code })).then(
    (data) => data.explanation
  );

export const fixCode = (code, issueDescription) =>
  handleResponse(api.post("/fix", { code, issueDescription })).then(
    (data) => data.fixed
  );

export const completeCode = (snippet) =>
  handleResponse(api.post("/complete", { snippet })).then(
    (data) => data.completion
  );
