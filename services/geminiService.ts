import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResumeMatch = async (
  resumeContent: string,
  resumeType: 'text' | 'application/pdf',
  jobDescription: string
): Promise<AnalysisResult> => {
  try {
    const modelId = "gemini-2.5-flash";
    
    // Construct the prompt parts
    const systemPrompt = `
      Act as an expert Applicant Tracking System (ATS) and Senior Technical Recruiter.
      
      I will provide you with a candidate's RESUME and a JOB DESCRIPTION.
      
      Your task is to perform a deep gap analysis.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Analyze the following:
      1. Calculate a match score (0-100) based on skills, experience, and semantic relevance.
      2. Identify keywords present in both texts (Matched).
      3. Identify critical keywords/skills missing from the resume but present in the JD (Missing).
      4. List specific strengths of the candidate for this role.
      5. Provide actionable improvements (bullet points) to increase the match score.
      6. Assess cultural fit based on the tone of the JD vs Resume.
      
      Return the response in JSON format.
    `;

    const parts = [];
    
    // Add System Prompt & JD
    parts.push({ text: systemPrompt });

    // Add Resume (Text or PDF)
    if (resumeType === 'application/pdf') {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: resumeContent
        }
      });
    } else {
      parts.push({ text: `RESUME CONTENT:\n${resumeContent}` });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Match score from 0 to 100" },
            matchLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Perfect"] },
            summary: { type: Type.STRING, description: "A brief executive summary of the match analysis" },
            matchedKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of relevant hard and soft skills found in both"
            },
            missingKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of relevant skills found in JD but missing in Resume"
            },
            strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Key selling points of the candidate"
            },
            improvements: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable advice to improve the resume"
            },
            culturalFit: { type: Type.STRING, description: "Brief assessment of tone/culture alignment" }
          },
          required: ["score", "matchLevel", "summary", "matchedKeywords", "missingKeywords", "strengths", "improvements", "culturalFit"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response received from AI");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};