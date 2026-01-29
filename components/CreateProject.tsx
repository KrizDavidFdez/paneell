
import React, { useState } from 'react';
import { LANGUAGES, ICONS } from '../constants';
import { LanguageTemplate } from '../types';

interface CreateProjectProps {
  onCancel: () => void;
  onCreate: (config: any) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onCancel, onCreate }) => {
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState<LanguageTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [search, setSearch] = useState('');
  
  // Nuevos estados para recursos
  const [cpuLimit, setCpuLimit] = useState(100);
  const [ramLimit, setRamLimit] = useState(2); // GB
  const [diskLimit, setDiskLimit] = useState(10); // GB

  const filteredLanguages = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1 && selectedLang) setStep(2);
    else if (step === 2 && projectName) {
      onCreate({ 
        name: projectName, 
        template: selectedLang,
        cpuLimit,
        ramLimit: ramLimit * 1024, // Convertir a MB
        diskLimit: `${diskLimit} GB`
      });
    }
  };

  const getLangIcon = (id: string) => {
    if (id === 'nodejs') return <ICONS.NodeIcon />;
    if (id === 'python') return <ICONS.PythonIcon />;
    return <ICONS.GenericIcon />;
  };

  return (
    <div className="max-w-7xl mx-auto py-4 animate-in fade-in duration-500">
      <div className="mb-12 flex items-center justify-between">
        <div className="border-l-4 border-white pl-6">
          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Nueva Instancia</h2>
          <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">Paso {step}/2: {step === 1 ? 'Selección de Engine' : 'Asignación de Recursos'}</p>
        </div>
        <button 
          onClick={onCancel}
          className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all"
        >
          Cancelar
        </button>
      </div>

      {step === 1 ? (
        <div className="space-y-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filtro de lenguajes (ej: Web, Node, Data...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-gray-800 font-bold outline-none focus:border-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredLanguages.map((lang) => (
              <div 
                key={lang.id}
                onClick={() => setSelectedLang(lang)}
                className={`cursor-pointer group p-8 rounded-3xl border transition-all flex flex-col items-center gap-6 ${
                  selectedLang?.id === lang.id 
                  ? 'border-white bg-white/5 scale-105' 
                  : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedLang?.id === lang.id ? 'bg-white text-black' : 'bg-black text-white/40 group-hover:text-white'}`}>
                  {getLangIcon(lang.id)}
                </div>
                <div className="text-center">
                  <h3 className="font-black text-[10px] uppercase tracking-widest">{lang.name}</h3>
                  <p className="text-[8px] text-gray-600 uppercase font-bold mt-1">{lang.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto space-y-10">
          <div className="flex items-center gap-6 p-6 bg-black border border-white/5 rounded-2xl">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center shrink-0">
              {getLangIcon(selectedLang?.id || '')}
            </div>
            <div>
              <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Configuración para</p>
              <h3 className="text-xl font-black text-white uppercase italic">{selectedLang?.name} v{selectedLang?.availableVersions[0]}</h3>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Identificador del Servidor</label>
              <input 
                autoFocus
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="PROD-SERVER-01"
                className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-white transition-all uppercase placeholder-gray-800"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* CPU SLIDER */}
              <div className="bg-black p-6 border border-white/5 rounded-2xl space-y-4">
                 <div className="flex justify-between items-center">
                   <p className="text-[10px] text-gray-600 font-black uppercase">Límite de CPU</p>
                   <p className="text-xs font-mono text-white">{cpuLimit}%</p>
                 </div>
                 <input 
                    type="range" min="10" max="400" step="10" 
                    value={cpuLimit} onChange={(e) => setCpuLimit(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                 />
              </div>

              {/* RAM SLIDER */}
              <div className="bg-black p-6 border border-white/5 rounded-2xl space-y-4">
                 <div className="flex justify-between items-center">
                   <p className="text-[10px] text-gray-600 font-black uppercase">Memoria RAM</p>
                   <p className="text-xs font-mono text-white">{ramLimit} GB</p>
                 </div>
                 <input 
                    type="range" min="0.5" max="32" step="0.5" 
                    value={ramLimit} onChange={(e) => setRamLimit(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                 />
              </div>

              {/* DISK SLIDER */}
              <div className="bg-black p-6 border border-white/5 rounded-2xl space-y-4">
                 <div className="flex justify-between items-center">
                   <p className="text-[10px] text-gray-600 font-black uppercase">Espacio en Disco</p>
                   <p className="text-xs font-mono text-white">{diskLimit} GB</p>
                 </div>
                 <input 
                    type="range" min="1" max="100" step="1" 
                    value={diskLimit} onChange={(e) => setDiskLimit(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                 />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 flex justify-center">
        <button
          onClick={handleNext}
          disabled={(step === 1 && !selectedLang) || (step === 2 && !projectName)}
          className={`px-20 py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all text-[11px] ${
            (step === 1 && selectedLang) || (step === 2 && projectName)
              ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
              : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
          }`}
        >
          {step === 1 ? 'Siguiente' : 'Desplegar Servidor'}
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
