
import React, { useState, useEffect, useRef } from 'react';
import { ViewType, ServerStatus, LogEntry, FileItem, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Console from './components/Console';
import FileManager from './components/FileManager';
import CreateProject from './components/CreateProject';
import ServersList from './components/ServersList';
import Startup from './components/Startup';
import Profile from './components/Profile';

const STORAGE_KEY = 'pteroengine_data_v1';

const INITIAL_PROFILE: UserProfile = {
  name: "RootUser",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  bio: "System Architect"
};

const INITIAL_SERVERS: ServerStatus[] = [
  {
    id: 'srv-001',
    name: 'Production-Alpha',
    status: 'offline',
    ip: '192.168.1.10',
    port: 3000,
    cpu: 0,
    ram: '2.0 GB',
    ramUsage: 0,
    maxRam: 2048,
    disk: '1.2 GB',
    maxDisk: '10 GB',
    templateIcon: 'JS',
    dockerImage: 'ghcr.io/yolks/nodejs',
    dockerVersion: '20',
    startupCommand: 'node index.js',
    logs: [],
    files: [
      { id: '1', name: 'index.js', size: '120 B', modified: 'Hoy', isDirectory: false, path: '/', content: 'console.log("Servidor iniciado correctamente!");\nconsole.log("Escuchando en el puerto 3000");' }
    ]
  }
];

const App: React.FC = () => {
  // Inicialización desde LocalStorage
  const [servers, setServers] = useState<ServerStatus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.servers || INITIAL_SERVERS;
      } catch (e) { return INITIAL_SERVERS; }
    }
    return INITIAL_SERVERS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.profile || INITIAL_PROFILE;
      } catch (e) { return INITIAL_PROFILE; }
    }
    return INITIAL_PROFILE;
  });

  const [activeView, setActiveView] = useState<ViewType>(ViewType.SERVERS);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedServer = servers.find(s => s.id === selectedServerId) || null;
  const isServerSpecificView = [ViewType.OVERVIEW, ViewType.FILES, ViewType.STARTUP, ViewType.SETTINGS].includes(activeView);

  // Persistencia automática
  useEffect(() => {
    const dataToSave = { servers, profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [servers, profile]);

  const addLog = (serverId: string, entry: LogEntry) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, logs: [...s.logs, entry] } : s));
  };

  const simulateDockerInstall = async (serverId: string, image: string, version: string) => {
    const ts = () => new Date().toLocaleTimeString();
    addLog(serverId, { timestamp: ts(), type: 'docker', message: `Initializing deployment for ${image}:${version}...` });
    
    const layers = ["layer-a1b2", "layer-c3d4", "layer-e5f6"];
    for (const layer of layers) {
      addLog(serverId, { timestamp: ts(), type: 'docker', message: `${layer}: Pulling fs layer...` });
      let progress = 0;
      while (progress <= 100) {
        const barSize = 20;
        const filled = Math.floor((progress / 100) * barSize);
        const bar = '█'.repeat(filled) + '░'.repeat(barSize - filled);
        addLog(serverId, { timestamp: '', type: 'raw', message: `${layer}: [${bar}] ${progress}%` });
        progress += 25;
        await new Promise(r => setTimeout(r, 200));
        // Remove last line to simulate update? Simple terminal doesn't support overwrite yet, so we just append.
      }
      addLog(serverId, { timestamp: ts(), type: 'success', message: `${layer}: Pull complete` });
    }
    addLog(serverId, { timestamp: ts(), type: 'success', message: `Successfully deployed container.` });
  };

  const simulateDependencyInstall = async (serverId: string, manager: string, pkgName?: string) => {
    const ts = () => new Date().toLocaleTimeString();
    const folderName = manager === 'npm' ? 'node_modules' : manager === 'pip' ? 'venv' : manager === 'composer' ? 'vendor' : 'target';
    
    addLog(serverId, { timestamp: ts(), type: 'info', message: `Running ${manager} install...` });
    
    let progress = 0;
    while (progress <= 100) {
      const barSize = 40;
      const filled = Math.floor((progress / 100) * barSize);
      const bar = '█'.repeat(filled) + '░'.repeat(barSize - filled);
      addLog(serverId, { timestamp: '', type: 'raw', message: `[${bar}] ${progress}% Installing dependencies...` });
      progress += 10;
      await new Promise(r => setTimeout(r, 300));
    }

    addLog(serverId, { timestamp: ts(), type: 'success', message: `Done. ${folderName} created.` });

    // Crear carpeta automáticamente
    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: folderName,
      isDirectory: true,
      path: '/',
      size: '--',
      modified: 'Justo ahora'
    };
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, files: [...s.files, newFolder] } : s));
  };

  const handlePowerAction = async (action: 'start' | 'stop' | 'restart') => {
    if (!selectedServer) return;
    const ts = () => new Date().toLocaleTimeString();

    if (action === 'start') {
      setServers(prev => prev.map(s => s.id === selectedServer.id ? {...s, status: 'starting'} : s));
      addLog(selectedServer.id, { timestamp: ts(), type: 'info', message: 'Iniciando proceso del contenedor...' });
      
      setTimeout(() => {
        setServers(prev => prev.map(s => s.id === selectedServer.id ? {...s, status: 'running', cpu: Math.floor(Math.random()*15 + 5), ramUsage: 120} : s));
        addLog(selectedServer.id, { timestamp: ts(), type: 'success', message: 'Container is online.' });
      }, 1000);
    } else if (action === 'stop') {
      setServers(prev => prev.map(s => s.id === selectedServer.id ? {...s, status: 'stopping'} : s));
      setTimeout(() => {
        setServers(prev => prev.map(s => s.id === selectedServer.id ? {...s, status: 'offline', cpu: 0, ramUsage: 0} : s));
        addLog(selectedServer.id, { timestamp: ts(), type: 'error', message: 'Server stopped.' });
      }, 800);
    } else if (action === 'restart') {
      await handlePowerAction('stop');
      setTimeout(() => handlePowerAction('start'), 1500);
    }
  };

  const handleCreateProject = (config: any) => {
    const newId = `srv-${Math.random().toString(36).substr(2, 5)}`;
    const randomPort = Math.floor(Math.random() * (65535 - 1024) + 1024);
    
    const newServer: ServerStatus = {
      id: newId,
      name: config.name,
      status: 'offline',
      ip: '192.168.1.10',
      port: randomPort,
      cpu: 0,
      ram: `${(config.ramLimit / 1024).toFixed(1)} GB`,
      ramUsage: 0,
      maxRam: config.ramLimit,
      disk: '0 GB',
      maxDisk: config.diskLimit,
      templateIcon: config.template.icon,
      dockerImage: config.template.defaultDockerImage,
      dockerVersion: config.template.availableVersions[0],
      startupCommand: config.template.id === 'nodejs' ? 'node index.js' : 'python main.py',
      logs: [],
      files: [
        { id: 'init-1', name: config.template.id === 'nodejs' ? 'index.js' : 'main.py', isDirectory: false, path: '/', size: '50 B', modified: 'Hoy', content: config.template.id === 'nodejs' ? 'console.log("Servidor Node iniciado!");' : 'print("Servidor Python iniciado!")' }
      ]
    };
    
    setServers([...servers, newServer]);
    setSelectedServerId(newId);
    setActiveView(ViewType.OVERVIEW);

    // Trigger Docker install
    setTimeout(() => simulateDockerInstall(newId, config.template.defaultDockerImage, config.template.availableVersions[0]), 500);
  };

  const handleSendCommand = (cmd: string) => {
    if (!selectedServer) return;
    const ts = () => new Date().toLocaleTimeString();
    addLog(selectedServer.id, { timestamp: ts(), type: 'input', message: cmd });

    const lower = cmd.toLowerCase().trim();
    if (lower === 'npm install' || lower === 'npm i' || lower === 'bun install' || lower === 'yarn') {
      simulateDependencyInstall(selectedServer.id, 'npm');
    } else if (lower.startsWith('pip install')) {
      simulateDependencyInstall(selectedServer.id, 'pip');
    } else if (lower === 'composer install') {
      simulateDependencyInstall(selectedServer.id, 'composer');
    } else if (lower === 'cargo build') {
      simulateDependencyInstall(selectedServer.id, 'cargo');
    } else if (lower === 'clear') {
      setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, logs: [] } : s));
    } else {
      setTimeout(() => addLog(selectedServer.id, { timestamp: '', type: 'raw', message: `bash: ${cmd}: command executed` }), 100);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header Principal */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 lg:px-10 bg-black/80 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/60 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm lg:text-lg font-black uppercase tracking-tighter italic">
                {selectedServer && isServerSpecificView ? selectedServer.name : 'Panel de Control'}
              </h1>
              {selectedServer && isServerSpecificView && (
                <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">
                  ID: {selectedServer.id} • PORT: {selectedServer.port}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-black uppercase">{profile.name}</span>
                <span className="text-[8px] font-bold text-gray-600 uppercase">Administrator</span>
             </div>
             <img src={profile.avatar} className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl border border-white/10 grayscale" alt="Profile" />
          </div>
        </header>

        {/* Sub-Barra de Navegación del Servidor */}
        {selectedServer && isServerSpecificView && (
          <nav className="bg-white/[0.02] border-b border-white/10 px-6 lg:px-10 flex gap-6 shrink-0 z-20 overflow-x-auto no-scrollbar">
            {[
              { id: ViewType.OVERVIEW, label: 'Consola' },
              { id: ViewType.FILES, label: 'Archivos' },
              { id: ViewType.STARTUP, label: 'Inicio' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                  activeView === tab.id ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        <div className={`flex-1 overflow-hidden bg-black relative flex flex-col ${activeView !== ViewType.OVERVIEW ? 'overflow-y-auto p-4 lg:p-10' : ''}`}>
          {(() => {
            if (activeView === ViewType.PROFILE) return <Profile profile={profile} onUpdate={setProfile} />;
            if (activeView === ViewType.CREATE_PROJECT) return <CreateProject onCancel={() => setActiveView(ViewType.SERVERS)} onCreate={handleCreateProject} />;
            if (activeView === ViewType.SERVERS) return <ServersList servers={servers} onSelect={(s) => { setSelectedServerId(s.id); setActiveView(ViewType.OVERVIEW); }} />;
            
            if (!selectedServer) return (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                <p className="font-black uppercase tracking-[0.3em]">Selecciona un servidor para gestionar</p>
              </div>
            );

            switch (activeView) {
              case ViewType.OVERVIEW:
                return (
                  <div className="flex flex-col h-full overflow-hidden p-4 lg:p-10 space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Estado</p>
                        <p className={`text-xl font-black uppercase italic ${selectedServer.status === 'running' ? 'text-[#00ff88]' : 'text-white'}`}>{selectedServer.status}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">CPU</p>
                        <p className="text-xl font-black text-white">{selectedServer.status === 'running' ? selectedServer.cpu : 0}%</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Memoria</p>
                        <p className="text-xl font-black text-white">{selectedServer.status === 'running' ? `${selectedServer.ramUsage} MB` : '0 MB'}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => handlePowerAction('start')} disabled={selectedServer.status === 'running' || selectedServer.status === 'starting'} className="flex-1 bg-white text-black rounded-xl text-[9px] font-black uppercase hover:bg-gray-200 transition-all disabled:opacity-20 active:scale-95">Start</button>
                        <div className="flex gap-1 flex-1">
                          <button onClick={() => handlePowerAction('restart')} className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Restart</button>
                          <button onClick={() => handlePowerAction('stop')} disabled={selectedServer.status === 'offline' || selectedServer.status === 'stopping'} className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all disabled:opacity-20">Stop</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-h-0 relative">
                      <Console server={selectedServer} onSendCommand={handleSendCommand} />
                    </div>
                  </div>
                );
              case ViewType.FILES: 
                return <FileManager 
                  server={selectedServer} 
                  onUpdateFile={(id, content) => {
                    setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: s.files.map(f => f.id === id ? {...f, content, size: `${content.length} B`} : f) } : s));
                  }} 
                  onCreateItem={(path, name, isDir, content) => {
                    const newItem: FileItem = { id: Math.random().toString(36).substr(2, 9), name, isDirectory: isDir, path, size: isDir ? '--' : '0 B', modified: 'Hoy', content };
                    setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: [...s.files, newItem] } : s));
                  }} 
                  onUploadFile={(path, list) => {
                    const uploads = Array.from(list).map((f: File) => ({ id: Math.random().toString(36).substr(2, 9), name: f.name, isDirectory: false, path, size: `${(f.size/1024).toFixed(1)} KB`, modified: 'Hoy' }));
                    setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: [...s.files, ...uploads] } : s));
                  }} 
                  onUnzip={(f) => {
                    const folder = { id: Math.random().toString(36).substr(2,9), name: f.name.replace('.zip',''), isDirectory: true, path: f.path, size: '--', modified: 'Hoy' };
                    setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: [...s.files, folder] } : s));
                  }} 
                  onDelete={(id) => {
                    if(confirm("Eliminar?")) setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: s.files.filter(f => f.id !== id) } : s));
                  }} 
                />;
              case ViewType.STARTUP: 
                return <Startup server={selectedServer} onUpdateStartup={(cmd, img, ver) => {
                  setServers(prev => prev.map(s => s.id === selectedServer.id ? {...s, startupCommand: cmd, dockerImage: img, dockerVersion: ver} : s));
                }} />;
              default: 
                return <div className="text-center py-40">Modulo no encontrado</div>;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

export default App;
