const pdfParse = require("pdf-parse");
const fs = require("fs");
const { callHFModel } = require("./hfClient");

// 1) PDF file -> plain text
async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || "";
}

// 2) Prompt for resume analysis
function buildPrompt(text) {
  return `
You are an expert resume reviewer for Indian Computer Science / IT students applying for internships and placements.

Given the following resume text, analyse it and output a JSON object with EXACTLY these keys:

- score: number from 0 to 100 (overall resume quality)
- skills: array of up to 10 key technical skills (strings)
- strengths: array of bullet-point strengths (strings)
- improvements: array of bullet-point suggestions (strings)
- summary: short 2–3 line summary in simple English

Important:
- Respond with ONLY valid JSON.
- Do NOT include any explanation or extra text outside JSON.
- If information is missing, still give useful generic suggestions.

RESUME TEXT:
${text.slice(0, 6000)}
`;
}

// 3) Ask HuggingFace LLM
async function analyzeWithLLM(text) {
  const prompt = buildPrompt(text);
  const raw = await callHFModel(prompt);

  // try to find JSON in response
  let jsonString = raw.trim();

  // Sometimes model may prepend text, try basic cleanup:
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("JSON parse error from HF:", err, "\nRaw:", raw);
    // fallback simple structure
    return {
      score: 50,
      skills: [],
      strengths: ["Model response was not fully structured. Please try refining the prompt."],
      improvements: ["Improve resume formatting and content clarity."],
      summary:
        "Automatic analysis failed to parse perfectly, but the system suggests reviewing skills, projects and achievements carefully.",
    };
  }
}

// 4) MAIN: file path -> structured analysis
async function analyzeResumeFromFile(filePath) {
  const text = await extractTextFromPdf(filePath);

  if (!text || text.trim().length < 50) {
    return {
      score: 30,
      skills: [],
      strengths: ["Resume text is too short or unreadable."],
      improvements: [
        "Export your resume as a proper text-based PDF (not just an image).",
        "Add clear sections for Education, Skills, Projects, and Experience.",
      ],
      summary:
        "The resume could not be fully analysed because the text is very limited.",
    };
  }

  return await analyzeWithLLM(text);
}

module.exports = { analyzeResumeFromFile };
