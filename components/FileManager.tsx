
import React, { useState, useRef } from 'react';
import { FileItem, ServerStatus } from '../types';
import FileEditor from './FileEditor';

interface FileManagerProps {
  server: ServerStatus;
  onUpdateFile: (fileId: string, newContent: string) => void;
  onCreateItem: (path: string, name: string, isDirectory: boolean, initialContent?: string) => void;
  onUploadFile: (path: string, files: FileList) => void;
  onUnzip: (file: FileItem) => void;
  onDelete: (id: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ server, onUpdateFile, onCreateItem, onUploadFile, onUnzip, onDelete }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [creationModal, setCreationModal] = useState<{ isOpen: boolean; isDir: boolean }>({ isOpen: false, isDir: false });
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = server.files.filter(f => f.path === currentPath);
  
  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentPath(`${currentPath === '/' ? '' : currentPath}/${file.name}`);
    } else {
      setEditingFile(file);
    }
  };

  const handleCreationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateItem(currentPath, newName.trim(), creationModal.isDir, newContent);
    setCreationModal({ isOpen: false, isDir: false });
    setNewName('');
    setNewContent('');
  };

  if (editingFile) {
    return (
      <FileEditor 
        file={editingFile} 
        onClose={() => setEditingFile(null)} 
        onSave={(content) => {
          onUpdateFile(editingFile.id, content);
          setEditingFile(null);
        }}
      />
    );
  }

  return (
    <div className="bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full animate-in fade-in duration-300 relative">
      {/* Modal de Creación */}
      {creationModal.isOpen && (
        <div className="absolute inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
          <form onSubmit={handleCreationSubmit} className="bg-black border border-white/20 w-full max-w-xl rounded-3xl p-8 space-y-6 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Nuevo {creationModal.isDir ? 'Directorio' : 'Archivo'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre del elemento</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-white transition-all font-mono text-sm"
                  placeholder={creationModal.isDir ? "ej: mi-carpeta" : "ej: index.js"}
                  required
                />
              </div>
              {!creationModal.isDir && (
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Código / Contenido Inicial</label>
                  <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full h-48 bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-white transition-all font-mono text-xs resize-none"
                    placeholder="console.log('Hola Mundo');"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => { setCreationModal({ isOpen: false, isDir: false }); setNewName(''); setNewContent(''); }} className="flex-1 bg-white/5 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-white/10 transition-all">Cancelar</button>
              <button type="submit" className="flex-1 bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] hover:bg-gray-200 transition-all">Confirmar Creación</button>
            </div>
          </form>
        </div>
      )}

      {/* Header del FileManager */}
      <div className="p-6 border-b border-white/10 flex flex-wrap gap-4 justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 overflow-hidden">
          <button onClick={() => setCurrentPath('/')} className="hover:text-white shrink-0">~ /root</button>
          {currentPath !== '/' && currentPath.split('/').filter(Boolean).map((part, i) => (
            <React.Fragment key={i}>
              <span className="text-white/20 shrink-0">/</span>
              <span className="text-white truncate max-w-[100px]">{part}</span>
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex gap-2 relative">
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => e.target.files && onUploadFile(currentPath, e.target.files)} />
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Subir</button>
          
          <div className="relative">
            <button onClick={() => setShowNewMenu(!showNewMenu)} className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all flex items-center gap-2">
              Nuevo {showNewMenu ? '▲' : '▼'}
            </button>
            
            {showNewMenu && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-black border border-white/20 rounded-xl shadow-2xl z-[55] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button onClick={() => { setCreationModal({ isOpen: true, isDir: false }); setShowNewMenu(false); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase text-gray-400 hover:bg-white hover:text-black transition-colors border-b border-white/5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Archivo
                </button>
                <button onClick={() => { setCreationModal({ isOpen: true, isDir: true }); setShowNewMenu(false); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase text-gray-400 hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  Carpeta
                </button>
              </div>
            )}
          </div>
          
          {currentPath !== '/' && (
            <button onClick={() => {
              const parts = currentPath.split('/').filter(Boolean);
              parts.pop();
              setCurrentPath('/' + (parts.join('/') || '/'));
            }} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Atrás</button>
          )}
        </div>
      </div>
      
      {/* Lista de Archivos */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.01] text-[9px] uppercase tracking-[0.2em] text-gray-600 border-b border-white/10">
              <th className="px-6 py-4 font-black">Nombre</th>
              <th className="px-6 py-4 font-black">Tamaño</th>
              <th className="px-6 py-4 font-black hidden md:table-cell">Modificado</th>
              <th className="px-6 py-4 font-black text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {filteredFiles.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-24 text-center opacity-20 font-black uppercase tracking-widest text-sm italic">Directorio Vacío</td></tr>
            ) : (
              filteredFiles.map((file) => (
                <tr key={file.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                  <td onClick={() => handleFileClick(file)} className="px-6 py-4 flex items-center gap-4 cursor-pointer">
                    {file.isDirectory ? (
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                    )}
                    <span className="text-white font-bold group-hover:underline truncate max-w-[200px]">{file.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-[10px]">{file.size}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-[10px] hidden md:table-cell">{file.modified}</td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === file.id ? null : file.id)}
                      className="p-2 text-gray-600 hover:text-white transition-colors rounded-lg bg-transparent hover:bg-white/5 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                    
                    {activeMenuId === file.id && (
                      <div className="absolute right-6 top-12 w-48 bg-black border border-white/20 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[56] overflow-hidden animate-in zoom-in-95 duration-150">
                        {file.name.toLowerCase().endsWith('.zip') && (
                          <button onClick={() => { onUnzip(file); setActiveMenuId(null); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-colors border-b border-white/5 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Descomprimir
                          </button>
                        )}
                        <button onClick={() => { onDelete(file.id); setActiveMenuId(null); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Backdrop para cerrar menús */}
      {activeMenuId && <div className="fixed inset-0 z-[54]" onClick={() => setActiveMenuId(null)} />}
      {showNewMenu && <div className="fixed inset-0 z-[53]" onClick={() => setShowNewMenu(false)} />}
    </div>
  );
};

export default FileManager;
