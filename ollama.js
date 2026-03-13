const fetch = require("node-fetch");

async function askModel(prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama2", prompt })
  });

  if (!response.ok) throw new Error("Ollama request failed");
  const data = await response.json();
  return data.response;
}

module.exports = { askModel };
