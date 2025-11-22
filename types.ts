export interface AnalysisResult {
  score: number;
  matchLevel: 'Low' | 'Moderate' | 'High' | 'Perfect';
  jobTitle: string;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  culturalFit: string;
  timestamp: number;
}

export interface ResumeInputData {
  resumeContent: string; // Text string OR Base64 string for PDF
  resumeType: 'text' | 'application/pdf';
  jobDescription: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}