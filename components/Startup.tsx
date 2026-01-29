
import React, { useState } from 'react';
import { ServerStatus, LanguageTemplate } from '../types';
import { LANGUAGES } from '../constants';

interface StartupProps {
  server: ServerStatus;
  onUpdateStartup: (command: string, image: string, version: string) => void;
}

const Startup: React.FC<StartupProps> = ({ server, onUpdateStartup }) => {
  const [command, setCommand] = useState(server.startupCommand);
  const [version, setVersion] = useState(server.dockerVersion);

  const langTemplate = LANGUAGES.find(l => l.icon === server.templateIcon) || LANGUAGES[0];

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-white pl-6">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Startup Config</h2>
        <p className="text-gray-600 text-sm font-mono mt-2 uppercase tracking-widest">Ajustes críticos del contenedor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ejecución</h3>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase">Editable</span>
          </div>
          <textarea 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full h-40 bg-black border border-white/10 rounded-2xl p-6 font-mono text-xs text-white focus:border-white transition-all outline-none resize-none leading-relaxed"
          />
          <button 
            onClick={() => onUpdateStartup(command, server.dockerImage, version)} 
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            Sincronizar Cambios
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-8">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Stack Tecnológico</h3>
          
          <div className="space-y-6">
             <div className="space-y-3">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Imagen Base</p>
                <div className="bg-black p-5 border border-white/10 rounded-2xl font-mono text-xs text-white">
                   {server.dockerImage}
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Versión de Lenguaje</p>
                <div className="grid grid-cols-3 gap-2">
                   {langTemplate.availableVersions.map(v => (
                     <button 
                       key={v}
                       onClick={() => setVersion(v)}
                       className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${
                         version === v 
                         ? 'bg-white text-black border-white' 
                         : 'bg-transparent border-white/10 text-gray-500 hover:border-white/40'
                       }`}
                     >
                       v{v}
                     </button>
                   ))}
                </div>
             </div>

             <div className="p-6 border border-white/10 bg-white/[0.02] rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-black">
                   !
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Cambiar la versión del contenedor podría requerir un reinicio completo del nodo para reconstruir las capas de Docker.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Startup;
