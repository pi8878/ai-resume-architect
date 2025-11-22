import React, { useState, useRef } from 'react';
import { ResumeInputData } from '../types';

interface InputSectionProps {
  onAnalyze: (data: ResumeInputData) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [resumeContent, setResumeContent] = useState('');
  const [resumeType, setResumeType] = useState<'text' | 'application/pdf'>('text');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (file.type === 'application/pdf') {
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          // Extract Base64 data part
          const base64Data = result.split(',')[1];
          setResumeContent(base64Data);
          setResumeType('application/pdf');
        }
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setResumeContent(text);
          setResumeType('text');
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (resumeContent && jobDescription.trim()) {
      onAnalyze({ resumeContent, resumeType, jobDescription });
    }
  };

  const isDisabled = !resumeContent || !jobDescription.trim() || isAnalyzing;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Resume Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Your Resume
          </h2>
          {fileName && (
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-medium">
              {fileName}
            </span>
          )}
        </div>
        
        <div className="relative flex flex-col h-full">
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all group mb-4 bg-white dark:bg-slate-800"
          >
             <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
            />
            <div className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-medium">Upload Resume (PDF, TXT, MD)</p>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-slate-50 dark:bg-slate-900 text-sm text-gray-500 dark:text-slate-400">or paste text</span>
            </div>
          </div>

          <textarea
            value={resumeType === 'text' ? resumeContent : ''}
            onChange={(e) => {
              setResumeContent(e.target.value);
              setResumeType('text');
              setFileName(null);
            }}
            disabled={resumeType === 'application/pdf'}
            placeholder={resumeType === 'application/pdf' ? "PDF uploaded. Click 'X' or upload a new file to change." : "Paste your resume content here..."}
            className="w-full flex-grow p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm shadow-sm min-h-[200px] placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Job Description Section */}
      <div className="space-y-4 flex flex-col">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          Job Description
        </h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full flex-grow p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm shadow-sm min-h-[420px] placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Action Area */}
      <div className="lg:col-span-2 flex justify-center pt-6">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`
            px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1
            flex items-center gap-3
            ${isDisabled 
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none hover:translate-y-0' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200 dark:shadow-none'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing with Gemini AI...
            </>
          ) : (
            <>
              <span>Analyze Match</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};