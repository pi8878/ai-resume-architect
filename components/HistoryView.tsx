
import React from 'react';
import { AnalysisResult } from '../types';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClose: () => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClose, onClear }) => {
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis History</h2>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
          <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No history found</h3>
          <p className="text-slate-500 dark:text-slate-400">Past analyses will appear here.</p>
          <button 
            onClick={onClose}
            className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Start a new analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <div 
              key={index}
              onClick={() => onSelect(item)}
              className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold 
                  ${item.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    item.score >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {item.matchLevel} Match
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {item.timestamp ? formatDate(item.timestamp) : 'Recent'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.jobTitle || "Resume Analysis"}
              </h3>
              
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{item.score}%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mb-1.5">Score</span>
              </div>
              
              <div className="flex gap-2 mb-4 overflow-hidden">
                {item.matchedKeywords.slice(0, 3).map((kw, i) => (
                  <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded truncate max-w-[80px]">
                    {kw}
                  </span>
                ))}
                {item.matchedKeywords.length > 3 && (
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    +{item.matchedKeywords.length - 3}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
