const {GoogleGenerativeAI} = require('@google/generative-ai');
require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(resumeText, jobDescription) {
    const prompt = `
    You are a career coach AI. Analyze this resume against the job description.
    RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}
    Respond ONLY with valid JSON in this exact format, no markdown, no explanation:
    {
        "match_score": <integer 0-100>,
        "missing_skills": "<comma-separated list of skills the candidate is missing>",
        "action_plan": "Provide EXACTLY 5 concise steps. Each step MUST be on its own line separated by \\n. No extra text outside the JSON. Format example: 'Step 1: Learn React fundamentals\\nStep 2: Build a portfolio project\\nStep 3: Study advanced patterns\\nStep 4: Practice system design\\nStep 5: Apply to 10 jobs weekly'"
    }`

    let result;
    try {
        const model = genAI.getGenerativeModel({ model : 'gemini-3.6-flash'})
        result = await model.generateContent(prompt)
    } catch (err) {
        if (err.status === 503) {
            console.log("gemini-3.6-flash unavailable, falling back to gemini-1.5-flash");
            const fallbackModel = genAI.getGenerativeModel({ model : 'gemini-1.5-flash'})
            result = await fallbackModel.generateContent(prompt)
        } else {
            throw err;
        }
    }

    const text = result.response.text().trim();
    //remove markdown code blocks if Gemini wraps response
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/,'');
    const parsed = JSON.parse(cleaned);
    return parsed;
}

module.exports = {analyzeResume}
