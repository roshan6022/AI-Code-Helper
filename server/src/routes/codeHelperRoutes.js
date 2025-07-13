import express from "express";
import openRouter from "../openRouterClient.js";

const router = express.Router();

async function proxyToOpenRouter(prompt) {
  const payload = {
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    stream: false,
  };

  const resp = await openRouter.post("/chat/completions", payload);
  return resp.data.choices[0].message.content;
}

router.post("/explain", async (req, res) => {
  try {
    const { code } = req.body;
    const prompt = `Explain the following code:\n\n${code}`;
    const explanation = await proxyToOpenRouter(prompt);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/fix", async (req, res) => {
  try {
    const { code, issueDescription } = req.body;
    const prompt = `Fix the following code. The issue: ${issueDescription}\n\nCode:\n${code}`;
    const fixed = await proxyToOpenRouter(prompt);
    res.json({ fixed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { snippet } = req.body;
    const prompt = `Complete the following code snippet:\n\n${snippet}`;
    const completion = await proxyToOpenRouter(prompt);
    res.json({ completion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
