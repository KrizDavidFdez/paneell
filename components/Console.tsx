
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, ServerStatus } from '../types';

interface ConsoleProps {
  server: ServerStatus;
  onSendCommand: (command: string) => void;
}

const Console: React.FC<ConsoleProps> = ({ server, onSendCommand }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [server.logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendCommand(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black border border-white/10 rounded-lg overflow-hidden font-mono">
      <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-[#00ff88]' : 'bg-white/20'}`}></div>
          <span className="text-[10px] font-bold text-gray-500">~ {server.name.toLowerCase()}</span>
        </div>
        <div className="text-[10px] text-gray-500 font-bold uppercase">{server.ip}</div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 text-xs overflow-y-auto space-y-0.5 custom-scrollbar selection:bg-white selection:text-black"
      >
        {server.logs.length === 0 && (
          <div className="text-gray-700 italic">$ bash: esperando actividad...</div>
        )}
        {server.logs.map((log, i) => (
          <div key={i} className={`flex gap-3 ${log.type === 'termux' ? 'py-1' : ''}`}>
            {log.type !== 'raw' && log.type !== 'termux' && (
              <span className="text-gray-700 shrink-0 select-none">[{log.timestamp}]</span>
            )}
            <div className={`
              ${log.type === 'error' ? 'text-red-500' : ''}
              ${log.type === 'warning' ? 'text-yellow-500' : ''}
              ${log.type === 'success' ? 'text-[#00ff88]' : ''}
              ${log.type === 'input' ? 'text-white font-bold' : ''}
              ${log.type === 'termux' ? 'text-white' : 'text-gray-300'}
              leading-relaxed whitespace-pre-wrap
            `}>
              {log.type === 'input' && <span className="mr-2 text-white/50">$</span>}
              {log.message}
            </div>
          </div>
        ))}
        <div className="h-4"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-black border-t border-white/10 flex gap-2">
        <span className="text-white font-bold">$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder=""
          className="bg-transparent border-none outline-none flex-1 text-xs text-white placeholder-gray-800"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Console;
