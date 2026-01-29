
import React, { useState, useEffect } from 'react';
import { ViewType, ServerStatus, LogEntry, FileItem, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Console from './components/Console';
import FileManager from './components/FileManager';
import CreateProject from './components/CreateProject';
import ServersList from './components/ServersList';
import Startup from './components/Startup';
import Profile from './components/Profile';

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
  const [activeView, setActiveView] = useState<ViewType>(ViewType.SERVERS);
  const [servers, setServers] = useState<ServerStatus[]>(INITIAL_SERVERS);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedServer = servers.find(s => s.id === selectedServerId) || null;

  const addLog = (serverId: string, entry: LogEntry) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, logs: [...s.logs, entry] } : s));
  };

  const simulateDockerInstall = async (serverId: string, image: string, version: string) => {
    const ts = () => new Date().toLocaleTimeString();
    addLog(serverId, { timestamp: ts(), type: 'docker', message: `Initializing deployment for ${image}:${version}...` });
    
    const steps = [
      { msg: `Pulling from ${image}...`, delay: 500 },
      { msg: `Layer 1: [##########] 100% (Pull complete)`, delay: 300 },
      { msg: `Layer 2: [######----] 60% (Downloading...)`, delay: 800 },
      { msg: `Layer 2: [##########] 100% (Pull complete)`, delay: 300 },
      { msg: `Layer 3: [##########] 100% (Pull complete)`, delay: 100 },
      { msg: `Digest: sha256:72c42ed3583...`, delay: 200 },
      { msg: `Status: Downloaded newer image for ${image}:${version}`, delay: 400 },
      { msg: `Creating container...`, delay: 600 },
      { msg: `Configuring network interfaces...`, delay: 400 },
      { msg: `Volume binding: /home/container -> /root`, delay: 300 },
      { msg: `Container ID: docker_srv_${serverId}`, delay: 100 }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      addLog(serverId, { timestamp: ts(), type: 'docker', message: step.msg });
    }
    addLog(serverId, { timestamp: ts(), type: 'success', message: `Deployment Finished. Ready to start.` });
  };

  const simulateDependencyInstall = async (serverId: string, pkgName: string) => {
    const ts = () => new Date().toLocaleTimeString();
    addLog(serverId, { timestamp: ts(), type: 'termux', message: `[*] (1) Fetching package ${pkgName}...` });
    await new Promise(r => setTimeout(r, 400));
    
    // Simulación de barra de progreso
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      const barWidth = 40;
      const filled = Math.floor((progress / 100) * barWidth);
      const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
      
      addLog(serverId, { 
        timestamp: '', 
        type: 'raw', 
        message: `⸩ ${progress}% [${bar}] Installing ${pkgName}...` 
      });

      if (progress >= 100) {
        clearInterval(interval);
        addLog(serverId, { timestamp: ts(), type: 'success', message: `Successfully installed ${pkgName}.` });
      }
    }, 150);
  };

  const handlePowerAction = async (action: 'start' | 'stop' | 'restart') => {
    const currentSrv = servers.find(s => s.id === selectedServerId);
    if (!currentSrv) return;
    const ts = () => new Date().toLocaleTimeString();

    if (action === 'start') {
      setServers(prev => prev.map(s => s.id === currentSrv.id ? {...s, status: 'starting'} : s));
      addLog(currentSrv.id, { timestamp: ts(), type: 'info', message: 'Starting container process...' });
      addLog(currentSrv.id, { timestamp: ts(), type: 'input', message: currentSrv.startupCommand });
      
      setTimeout(() => {
        setServers(prev => prev.map(s => s.id === currentSrv.id ? {...s, status: 'running', cpu: Math.floor(Math.random()*15 + 5), ramUsage: 120} : s));
        addLog(currentSrv.id, { timestamp: ts(), type: 'success', message: 'Container is online.' });

        currentSrv.files.forEach(file => {
          if (!file.isDirectory && file.content) {
            const regex = /(?:console\.log|print)\s*\(\s*['"`](.*?)['"`]\s*\)/g;
            let match;
            while ((match = regex.exec(file.content)) !== null) {
              addLog(currentSrv.id, { timestamp: '', type: 'raw', message: match[1] });
            }
          }
        });
      }, 1500);
    } 
    else if (action === 'stop') {
      setServers(prev => prev.map(s => s.id === currentSrv.id ? {...s, status: 'stopping'} : s));
      addLog(currentSrv.id, { timestamp: ts(), type: 'warning', message: 'Shutting down gracefully...' });
      
      setTimeout(() => {
        setServers(prev => prev.map(s => s.id === currentSrv.id ? {...s, status: 'offline', cpu: 0, ramUsage: 0} : s));
        addLog(currentSrv.id, { timestamp: ts(), type: 'error', message: 'Process exited with code 0' });
      }, 1000);
    }
    else if (action === 'restart') {
      await handlePowerAction('stop');
      setTimeout(() => handlePowerAction('start'), 2000);
    }
  };

  const handleSendCommand = (cmd: string) => {
    if (!selectedServer) return;
    const ts = () => new Date().toLocaleTimeString();
    addLog(selectedServer.id, { timestamp: ts(), type: 'input', message: cmd });
    
    const lower = cmd.toLowerCase().trim();
    if (lower.startsWith('npm i') || lower.startsWith('npm install') || lower.startsWith('pkg i')) {
      const parts = cmd.split(' ');
      const pkg = parts[parts.length - 1];
      simulateDependencyInstall(selectedServer.id, pkg);
    } else if (lower === 'clear') {
      setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, logs: [] } : s));
    } else {
      setTimeout(() => addLog(selectedServer.id, { timestamp: '', type: 'raw', message: `bash: ${cmd}: command executed` }), 200);
    }
  };

  const handleCreateProject = (config: any) => {
    const newId = `srv-${Math.random().toString(36).substr(2, 5)}`;
    // Generar puerto aleatorio entre 1024 y 65535
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
        { 
          id: 'init-1', 
          name: config.template.id === 'nodejs' ? 'index.js' : 'main.py', 
          isDirectory: false, 
          path: '/', 
          size: '50 B', 
          modified: 'Hoy', 
          content: config.template.id === 'nodejs' ? 'console.log("Servidor Node iniciado!");' : 'print("Servidor Python iniciado!")' 
        }
      ]
    };
    
    setServers([...servers, newServer]);
    setSelectedServerId(newId);
    setActiveView(ViewType.OVERVIEW);

    setTimeout(() => simulateDockerInstall(newId, config.template.defaultDockerImage, config.template.availableVersions[0]), 500);
  };

  const handleCreateFileItem = (path: string, name: string, isDirectory: boolean, initialContent?: string) => {
    if (!selectedServer) return;
    const newItem: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isDirectory,
      path,
      size: isDirectory ? '--' : `${(initialContent?.length || 0)} B`,
      modified: 'Hoy',
      content: initialContent || ''
    };
    setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: [...s.files, newItem] } : s));
  };

  const handleUpdateFile = (fileId: string, newContent: string) => {
    setServers(prev => prev.map(s => s.id === selectedServerId ? { 
      ...s, 
      files: s.files.map(f => f.id === fileId ? { ...f, content: newContent, size: `${newContent.length} B` } : f) 
    } : s));
  };

  const handleUploadFile = (path: string, fileList: FileList) => {
    if (!selectedServer) return;
    const newItems: FileItem[] = Array.from(fileList).map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      isDirectory: false,
      path,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      modified: 'Hoy',
      content: '// Archivo subido'
    }));
    setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: [...s.files, ...newItems] } : s));
  };

  const handleUnzip = (file: FileItem) => {
    if (!selectedServer) return;
    const folderName = file.name.replace('.zip', '');
    const ts = () => new Date().toLocaleTimeString();
    addLog(selectedServer.id, { timestamp: ts(), type: 'info', message: `Extraer: ${file.name} -> ./${folderName}` });
    
    setTimeout(() => {
      const destDir: FileItem = { id: Math.random().toString(36).substr(2, 9), name: folderName, isDirectory: true, path: file.path, size: '--', modified: 'Hoy' };
      const dummyFile: FileItem = { id: Math.random().toString(36).substr(2, 9), name: 'app.js', isDirectory: false, path: `${file.path}${file.path === '/' ? '' : '/'}${folderName}`, size: '1 KB', modified: 'Hoy', content: 'console.log("Descomprimido con éxito");' };
      
      setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: [...s.files, destDir, dummyFile] } : s));
      addLog(selectedServer.id, { timestamp: ts(), type: 'success', message: `${file.name} extraído.` });
    }, 800);
  };

  const handleDeleteFile = (id: string) => {
    if (!selectedServer) return;
    if (confirm("¿Eliminar este elemento?")) {
      setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, files: s.files.filter(f => f.id !== id) } : s));
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sm:px-10 bg-black z-20">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-black uppercase tracking-tighter italic">{selectedServer ? selectedServer.name : 'PteroEngine'}</h1>
              {selectedServer && <span className="text-[8px] sm:text-[9px] font-black text-white/40 tracking-widest uppercase">{selectedServer.status} • Docker Engine</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-black text-white uppercase">{profile.name}</span>
                <span className="text-[8px] font-bold text-gray-600 uppercase">Administrator</span>
             </div>
             <img src={profile.avatar} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-white/10 grayscale" alt="Profile" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 custom-scrollbar bg-black">
          {(() => {
            if (activeView === ViewType.PROFILE) return <Profile profile={profile} onUpdate={setProfile} />;
            if (activeView === ViewType.CREATE_PROJECT) return <CreateProject onCancel={() => setActiveView(ViewType.SERVERS)} onCreate={handleCreateProject} />;
            if (activeView === ViewType.SERVERS) return <ServersList servers={servers} onSelect={(s) => { setSelectedServerId(s.id); setActiveView(ViewType.OVERVIEW); }} />;
            if (!selectedServer) return <div className="text-center py-40 font-black uppercase text-white/20">Selecciona un servidor</div>;

            switch (activeView) {
              case ViewType.OVERVIEW:
                return (
                  <div className="flex flex-col h-full space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl">
                        <p className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-widest">CPU</p>
                        <p className="text-xl sm:text-2xl font-black text-white">{selectedServer.status === 'running' ? selectedServer.cpu : 0}%</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl">
                        <p className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-widest">Memoria</p>
                        <p className="text-xl sm:text-2xl font-black text-white">{selectedServer.status === 'running' ? `${selectedServer.ramUsage} MB` : '0 MB'}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl">
                        <p className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-widest">Dirección</p>
                        <p className="text-[10px] sm:text-sm font-black text-white uppercase">{selectedServer.ip}:{selectedServer.port}</p>
                      </div>
                      <div className="flex flex-col gap-1 sm:gap-2">
                        <button onClick={() => handlePowerAction('start')} disabled={selectedServer.status === 'running' || selectedServer.status === 'starting'} className="flex-1 bg-white text-black rounded-xl text-[9px] font-black uppercase hover:bg-gray-200 transition-all disabled:opacity-20">Start</button>
                        <div className="flex gap-1 sm:gap-2 flex-1">
                          <button onClick={() => handlePowerAction('restart')} className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Restart</button>
                          <button onClick={() => handlePowerAction('stop')} disabled={selectedServer.status === 'offline' || selectedServer.status === 'stopping'} className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all disabled:opacity-20">Stop</button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[500px]">
                      <Console server={selectedServer} onSendCommand={handleSendCommand} />
                    </div>
                  </div>
                );
              case ViewType.FILES: return <FileManager 
                server={selectedServer} 
                onUpdateFile={handleUpdateFile} 
                onCreateItem={handleCreateFileItem} 
                onUploadFile={handleUploadFile} 
                onUnzip={handleUnzip} 
                onDelete={handleDeleteFile} 
              />;
              case ViewType.STARTUP: return <Startup server={selectedServer} onUpdateStartup={(cmd, img, ver) => {
                setServers(prev => prev.map(s => s.id === selectedServer.id ? {...s, startupCommand: cmd, dockerImage: img, dockerVersion: ver} : s));
              }} />;
              default: return <div className="text-center py-40">Modulo no encontrado</div>;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

export default App;
