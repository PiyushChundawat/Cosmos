const pdfParse = require("pdf-parse");  // v1.1.1
const fs = require("fs");
// const { callHFModel } = require("./hfClient"); // not needed for now

// 1) PDF file -> plain text
async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || "";
}

// ------------ Simple rule-based analysis using real resume text ------------

// mapping of “skills” to search keywords
const SKILL_KEYWORDS = [
  { label: "JavaScript", keywords: ["javascript", "js "] },
  { label: "TypeScript", keywords: ["typescript", "ts "] },
  { label: "React", keywords: ["react", "next.js", "nextjs"] },
  { label: "Node.js", keywords: ["node.js", "nodejs", "node js"] },
  { label: "Express", keywords: ["express.js", "expressjs", "express js"] },
  { label: "MongoDB", keywords: ["mongodb", "mongo db"] },
  { label: "SQL", keywords: ["mysql", "postgres", "sql "] },
  { label: "HTML/CSS", keywords: ["html", "css"] },
  { label: "Python", keywords: ["python"] },
  { label: "Java", keywords: [" java "] },
  { label: "C++", keywords: ["c++", "cpp"] },
];

function ruleBasedAnalysis(text) {
  const lower = text.toLowerCase();

  // ---- skills detection ----
  const skills = [];
  for (const entry of SKILL_KEYWORDS) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      skills.push(entry.label);
    }
  }
  const uniqueSkills = [...new Set(skills)].slice(0, 10);

  // ---- scoring ----
  let score = 40;

  // more skills -> higher score
  score += Math.min(uniqueSkills.length * 5, 30); // +0..30

  // length of resume
  const len = text.length;
  if (len > 5000) score += 10;        // quite detailed
  else if (len > 2500) score += 5;
  else if (len < 800) score -= 10;    // too short

  // projects / internships presence
  if (lower.includes("project")) score += 5;
  if (lower.includes("internship") || lower.includes("intern")) score += 5;
  if (lower.includes("hackathon") || lower.includes("competition")) score += 3;

  score = Math.max(0, Math.min(100, score)); // clamp 0–100

  // ---- strengths ----
  const strengths = [];
  if (uniqueSkills.length >= 4) {
    strengths.push("Good spread of technical skills relevant to software roles.");
  }
  if (lower.includes("project")) {
    strengths.push("Has hands-on project experience; shows practical application of skills.");
  }
  if (lower.includes("internship") || lower.includes("intern")) {
    strengths.push("Includes internship or industry exposure, which adds credibility.");
  }
  if (lower.includes("cgpa") || lower.includes("gpa") || lower.includes("percentage")) {
    strengths.push("Academic performance is clearly mentioned.");
  }
  if (!strengths.length) {
    strengths.push("Basic structure is present; can be improved with clearer highlights.");
  }

  // ---- improvements ----
  const improvements = [];
  if (!lower.includes("summary") && !lower.includes("objective")) {
    improvements.push("Add a short 2–3 line profile summary at the top.");
  }
  if (!lower.includes("cgpa") && !lower.includes("gpa") && !lower.includes("percentage")) {
    improvements.push("Mention your CGPA / percentage clearly under Education.");
  }
  if (!lower.includes("github") && !lower.includes("git hub")) {
    improvements.push("Add your GitHub or portfolio link to showcase projects.");
  }
  if (!lower.includes("skills")) {
    improvements.push("Create a dedicated Skills section with tools, languages and frameworks.");
  }
  if (!lower.includes("internship") && !lower.includes("experience")) {
    improvements.push("If possible, include internships or relevant experience (even part-time / freelance).");
  }
  if (!improvements.length) {
    improvements.push("Polish formatting and add more measurable, quantified achievements.");
  }

  // ---- summary ----
  const summary = `This resume shows ${
    uniqueSkills.length ? "a decent mix of technical skills" : "basic information"
  } and has scope to improve by adding clearer achievements, structure and more project or internship details.`;

  return {
    score,
    skills: uniqueSkills,
    strengths,
    improvements,
    summary,
  };
}

// 3) MAIN: file path -> structured analysis
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
        "The resume could not be fully analysed because the extracted text was very limited.",
    };
  }

  // For now: purely rule-based (no HF)
  return ruleBasedAnalysis(text);
}

module.exports = { analyzeResumeFromFile };
