
import React from 'react';
import { ServerStatus } from '../types';

interface ServersListProps {
  servers: ServerStatus[];
  onSelect: (server: ServerStatus) => void;
}

const ServersList: React.FC<ServersListProps> = ({ servers, onSelect }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Mis Servidores</h2>
          <p className="text-gray-500 text-sm font-mono mt-2">Inventario de instancias desplegadas.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-1 rounded-full">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Activos: {servers.length}</span>
        </div>
      </div>

      {servers.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
          <p className="text-gray-600 font-black uppercase tracking-widest">No hay instancias creadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {servers.map((server) => (
            <div 
              key={server.id}
              onClick={() => onSelect(server)}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white transition-all cursor-pointer group relative overflow-hidden active:scale-95"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${server.status === 'running' ? 'bg-[#00ff88]' : 'bg-red-500'}`}></div>
                  <h3 className="text-xl font-black text-white group-hover:italic transition-all">{server.name}</h3>
                </div>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{server.templateIcon}</div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <span>CPU</span>
                  <span className="text-white font-mono">{server.cpu}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-1000" style={{ width: `${server.cpu}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <span>RAM</span>
                  <span className="text-white font-mono">{server.ram}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-1000" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-[9px] font-bold text-gray-600 font-mono">{server.ip}:{server.port}</span>
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServersList;
