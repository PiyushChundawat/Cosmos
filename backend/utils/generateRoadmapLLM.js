const { callHFModel } = require("./hfClient");

// prompt banaane ka function
function buildRoadmapPrompt({ name, branch, year, score, skills, strengths, improvements, targetRole }) {
  return `
You are a senior software engineer mentor helping an Indian ${branch || "CSE"} student in year ${year || "2"} prepare for ${targetRole || "SDE internship / placements"}.

Based on the resume analysis below, create a clear WEEK-WISE STUDY ROADMAP.

RESUME ANALYSIS:
- Score: ${score || 0}/100
- Skills: ${skills && skills.length ? skills.join(", ") : "not clearly mentioned"}
- Strengths: ${strengths && strengths.length ? strengths.join(" | ") : "none"}
- Improvements: ${improvements && improvements.length ? improvements.join(" | ") : "none"}

RULES:
- Make a roadmap for 4 to 6 weeks (choose suitable length).
- For each week, include:
  - weekNumber (number)
  - title (string)
  - focusAreas (array of short strings)
  - topics (array of detailed topics to study)
  - tasks (array of concrete actions: e.g., "Solve 20 easy DSA problems on arrays")
  - resources (array of generic resource hints like "Neso Academy OS playlist" or "LeetCode easy array problems")

Return ONLY a JSON object with EXACTLY these keys:

{
  "durationWeeks": <number>,
  "weeks": [
    {
      "weekNumber": <number>,
      "title": "<string>",
      "focusAreas": ["..."],
      "topics": ["..."],
      "tasks": ["..."],
      "resources": ["..."]
    }
  ]
}

Do not include any explanation outside JSON.
`;
}

async function generateRoadmapWithLLM(context) {
  const prompt = buildRoadmapPrompt(context);
  const raw = await callHFModel(prompt);

  let jsonString = raw.trim();
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed.durationWeeks && parsed.weeks) {
      parsed.durationWeeks = parsed.weeks.length;
    }

    return parsed;
  } catch (err) {
    console.error("Roadmap JSON parse error:", err, "\nRaw:", raw);

    // fallback roadmap
    return {
      durationWeeks: 4,
      weeks: [
        {
          weekNumber: 1,
          title: "Fix resume basics & core CS",
          focusAreas: ["Resume cleanup", "DSA basics", "DBMS basics"],
          topics: ["Improve resume formatting", "Arrays & Strings", "ER model & SQL CRUD"],
          tasks: [
            "Rewrite resume with clear sections (Education, Skills, Projects, Experience)",
            "Solve 20 easy DSA problems on arrays and strings",
            "Revise basic SQL (SELECT, INSERT, UPDATE, DELETE)",
          ],
          resources: ["GFG DSA basics", "DBMS Neso Academy", "Striver A2Z sheet (easy level)"],
          status: "pending",
        },
      ],
    };
  }
}

module.exports = { generateRoadmapWithLLM };
