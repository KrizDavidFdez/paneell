
import React, { useState } from 'react';
import { FileItem } from '../types';

interface FileEditorProps {
  file: FileItem;
  onSave: (newContent: string) => void;
  onClose: () => void;
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onSave, onClose }) => {
  const [content, setContent] = useState(file.content || '');

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs font-mono text-gray-300">Editando: <span className="text-white">{file.name}</span></span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onClose}
            className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white transition-colors"
          >
            CANCELAR
          </button>
          <button 
            onClick={() => onSave(content)}
            className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded transition-all"
          >
            GUARDAR
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-[#05070a] p-6 font-mono text-sm text-gray-300 outline-none resize-none custom-scrollbar"
        spellCheck={false}
      />
      <div className="px-4 py-1 bg-[#161b22] border-t border-[#30363d] text-[10px] text-gray-600 flex justify-between">
        <span>UTF-8</span>
        <span>Line: {content.split('\n').length}, Char: {content.length}</span>
      </div>
    </div>
  );
};

export default FileEditor;
