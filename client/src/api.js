import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000/api/code" });

export const explainCode = (code) =>
  api.post("/explain", { code }).then((res) => res.data.explanation);

export const fixCode = (code, issueDescription) =>
  api.post("/fix", { code, issueDescription }).then((res) => res.data.fixed);

export const completeCode = (snippet) =>
  api.post("/complete", { snippet }).then((res) => res.data.completion);
