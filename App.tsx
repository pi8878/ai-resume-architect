import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsDashboard } from './components/ResultsDashboard';
import { analyzeResumeMatch } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, ResumeInputData } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Dark mode state initialization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleAnalyze = useCallback(async (data: ResumeInputData) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    
    try {
      const analysis = await analyzeResumeMatch(data.resumeContent, data.resumeType, data.jobDescription);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze resume. Please try again.");
      setStatus(AnalysisStatus.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Optimize Your Resume for Any Job
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Use AI to compare your resume (PDF, Text) against a job description. Get an instant match score, 
            identify missing keywords, and receive actionable advice to get hired.
          </p>
        </div>

        {status === AnalysisStatus.ERROR && (
           <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm max-w-3xl mx-auto">
             <div className="flex">
               <div className="flex-shrink-0">
                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                 </svg>
               </div>
               <div className="ml-3">
                 <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
               </div>
             </div>
           </div>
        )}

        {status === AnalysisStatus.COMPLETE && result ? (
          <ResultsDashboard result={result} onReset={handleReset} />
        ) : (
          <InputSection 
            onAnalyze={handleAnalyze} 
            isAnalyzing={status === AnalysisStatus.ANALYZING} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} AI Resume Architect. Powered by Gemini 2.5 Flash.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;