
import React from 'react';
import { ServerStatus } from '../types';
import MetricsChart from './MetricsChart';

interface GlobalDashboardProps {
  servers: ServerStatus[];
}

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ servers }) => {
  const totalRam = servers.reduce((acc, s) => acc + s.maxRam, 0);
  const usedRam = servers.reduce((acc, s) => acc + (s.status === 'running' ? s.ramUsage : 0), 0);
  // Fixed: changed .count() to .length for array size
  const onlineCount = servers.filter(s => s.status === 'running').length;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Panel Global</h2>
          <p className="text-gray-500 text-sm font-medium">Estado consolidado de la infraestructura.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase font-black">Node Status</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-white uppercase">Saludable</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-between h-48">
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">RAM del Nodo</h3>
            <p className="text-4xl font-black text-white">{(usedRam/1024).toFixed(1)} <span className="text-lg text-gray-500">/ {(totalRam/1024).toFixed(1)} GB</span></p>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: `${(usedRam/totalRam)*100}%` }}></div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-between h-48">
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Instancias Activas</h3>
            <p className="text-4xl font-black text-white">{onlineCount} <span className="text-lg text-gray-500">/ {servers.length}</span></p>
          </div>
          <div className="flex gap-1">
            {servers.map(s => (
              <div key={s.id} className={`w-3 h-3 rounded-sm ${s.status === 'running' ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-between h-48">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Carga Global</h3>
          <div className="h-32 -mb-4">
            <MetricsChart type="cpu" />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Actividad Reciente</h3>
          <button className="text-[10px] text-gray-500 hover:text-white uppercase font-bold transition-colors">Ver Logs Maestros</button>
        </div>
        <div className="divide-y divide-white/5">
          {servers.slice(0, 5).map(server => (
             <div key={server.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-xs text-white">{server.templateIcon}</div>
                   <div>
                      <p className="text-sm font-bold text-white">{server.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{server.ip}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">{server.status}</p>
                   <p className="text-xs text-gray-300 font-mono">{server.cpu}% CPU</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
