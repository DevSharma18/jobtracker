const {GoogleGenerativeAI} = require('@google/generative-ai');
require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(resumeText, jobDescription) {
    const model = genAI.getGenerativeModel({ model : 'gemini-3.6-flash'})
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
        "action_plan": "<a concrete 30-day learning plan to close the skill gaps, written as numbered steps>"
    }`
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim();
    //remove markdown code blocks if Gemini wraps response
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/,'');
    const parsed = JSON.parse(cleaned);
    return parsed;
}

module.exports = {analyzeResume}
