import fetch from "node-fetch";
import readline from "readline";

export const streamOpenRouter = async (req, res) => {
  try {
    const { prompt, model = "mistralai/mistral-7b-instruct" } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Update this if deployed
          "X-Title": "AI Code Helper",
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      console.error("❌ OpenRouter error:", errorText);
      return res.status(500).send("Failed to connect to OpenRouter");
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    // Setup line reader for streamed response
    const rl = readline.createInterface({
      input: response.body,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      line = line.trim();

      if (!line.startsWith("data: ")) return;

      const jsonStr = line.replace("data: ", "");

      if (jsonStr === "[DONE]") {
        res.write("event: done\ndata: done\n\n");
        return res.end();
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
          res.flush?.();
        }
      } catch (err) {
        console.error("❌ Failed to parse chunk:", jsonStr);
      }
    });

    rl.on("close", () => {
      console.log("✅ Stream closed");
      res.end();
    });
  } catch (err) {
    console.error("🔥 Streaming Error:", err.message);
    res.status(500).send("Streaming error");
  }
};
