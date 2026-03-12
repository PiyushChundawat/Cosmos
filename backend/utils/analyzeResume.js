// utils/analyzeResume.js
// Extracts text from PDF/DOCX and analyzes it using Google Gemini

const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// ---------------------------------------------
// TEXT EXTRACTION
// ---------------------------------------------
const pdfParse = require("pdf-parse");

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractTextFromDOCX(filePath) {
  const mammoth = require("mammoth");
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return await extractTextFromPDF(filePath);
  }

  if (ext === ".docx" || ext === ".doc") {
    return await extractTextFromDOCX(filePath);
  }

  throw new Error("Unsupported file type");
}

// ---------------------------------------------
// RESUME ANALYSIS WITH GEMINI
// ---------------------------------------------

async function analyzeResumeText(resumeText) {

  const prompt = `
You are an expert resume reviewer.

Analyze this resume and return ONLY valid JSON.

Resume:
${resumeText}

Return JSON in this exact structure:

{
"score": 0-100,
"summary": "short summary",
"skills": ["skill1","skill2"],
"strengths": ["strength1","strength2"],
"improvements": ["improvement1","improvement2"],
"atsKeywords": ["keyword1","keyword2"],
"sectionFeedback":{
"contact":"feedback",
"summary":"feedback",
"experience":"feedback",
"education":"feedback",
"skills":"feedback",
"projects":"feedback"
}
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  // Clean Gemini output
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini JSON parse error:", cleaned);

    throw new Error("AI returned invalid JSON");
  }
}

// ---------------------------------------------
// MAIN FUNCTION
// ---------------------------------------------

async function analyzeResumeFromFile(filePath) {

  const resumeText = await extractTextFromFile(filePath);

  if (!resumeText || resumeText.length < 50) {
    throw new Error("Could not extract text from resume");
  }

  const analysis = await analyzeResumeText(resumeText);

  return analysis;
}

module.exports = { analyzeResumeFromFile };