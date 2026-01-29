
import React from 'react';
import { ViewType } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
  const globalItems = [
    { id: ViewType.SERVERS, label: 'Servidores', icon: ICONS.Servers },
    { id: ViewType.PROFILE, label: 'Perfil', icon: ICONS.Settings },
  ];

  const serverItems = [
    { id: ViewType.OVERVIEW, label: 'Consola', icon: ICONS.Terminal },
    { id: ViewType.FILES, label: 'Archivos', icon: ICONS.Files },
    { id: ViewType.STARTUP, label: 'Inicio', icon: ICONS.Startup },
  ];

  const isServerView = ![ViewType.SERVERS, ViewType.PROFILE, ViewType.CREATE_PROJECT].includes(activeView);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/90 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-black border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-10">
           <h2 className="text-2xl font-black tracking-tighter italic uppercase text-white">Ptero<span className="text-gray-600">.io</span></h2>
        </div>

        <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar">
           <div>
              <p className="px-4 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-4">Administración</p>
              {globalItems.map(item => (
                <button key={item.id} onClick={() => { setActiveView(item.id); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${activeView === item.id ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                  <item.icon /> {item.label}
                </button>
              ))}
           </div>

           {isServerView && (
             <div className="animate-in slide-in-from-left duration-300">
                <p className="px-4 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-4">Nodo Actual</p>
                {serverItems.map(item => (
                  <button key={item.id} onClick={() => { setActiveView(item.id); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${activeView === item.id ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                    <item.icon /> {item.label}
                  </button>
                ))}
             </div>
           )}
        </nav>

        <div className="p-6">
           <button onClick={() => { setActiveView(ViewType.CREATE_PROJECT); onClose(); }} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95">Desplegar Nuevo</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
