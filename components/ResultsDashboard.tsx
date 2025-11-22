import React from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset }) => {
  
  const scoreData = [{
    name: 'Score',
    value: result.score,
    fill: result.score >= 80 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444',
  }];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
         <button 
           onClick={onReset}
           className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
         >
           Start New Analysis
         </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2 text-sm uppercase tracking-wider">Match Score</h3>
          <div className="h-40 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={15} 
                data={scoreData} 
                startAngle={90} 
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-3xl font-bold fill-slate-800 dark:fill-white"
                >
                  {result.score}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold 
            ${result.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : result.score >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
            {result.matchLevel} Match
          </span>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Executive Summary
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
            {result.summary}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Cultural Fit Assessment</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{result.culturalFit}"</p>
          </div>
        </div>
      </div>

      {/* Keywords Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
          <h3 className="text-green-600 dark:text-green-400 font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Matched Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.length > 0 ? (
              result.matchedKeywords.map((kw, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm border border-green-100 dark:border-green-900/30">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-sm italic">No direct keyword matches found.</span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
          <h3 className="text-red-500 dark:text-red-400 font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.length > 0 ? (
              result.missingKeywords.map((kw, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-sm italic">No critical keywords missing!</span>
            )}
          </div>
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
         {/* Strengths */}
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-indigo-900 dark:text-indigo-200 font-bold mb-4 flex items-center gap-2">
              <span className="bg-indigo-100 dark:bg-indigo-900/30 p-1 rounded text-indigo-600 dark:text-indigo-400">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </span>
              Candidate Strengths
            </h3>
            <ul className="space-y-3">
              {result.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                   <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                   {item}
                </li>
              ))}
            </ul>
         </div>

         {/* Improvements */}
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-indigo-900 dark:text-indigo-200 font-bold mb-4 flex items-center gap-2">
              <span className="bg-amber-100 dark:bg-amber-900/30 p-1 rounded text-amber-600 dark:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Recommended Improvements
            </h3>
            <ul className="space-y-3">
              {result.improvements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                   {item}
                </li>
              ))}
            </ul>
         </div>
      </div>

    </div>
  );
};