const fetch = require("node-fetch");

const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

async function callHFModel(prompt) {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HF API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  // flan-t5 returns array with generated_text
  const text =
    Array.isArray(data) && data[0] && data[0].generated_text
      ? data[0].generated_text
      : JSON.stringify(data);

  return text;
}

module.exports = { callHFModel };
