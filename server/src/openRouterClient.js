import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const client = axios.create({
  baseURL: process.env.OPENROUTER_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// console.log(process.env.OPENROUTER_API_KEY);

export default client;
