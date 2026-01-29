
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSave = () => {
    onUpdate({ name, bio, avatar });
    alert("Perfil actualizado correctamente.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Tu Identidad</h2>
        <p className="text-gray-500 text-sm mt-2 font-mono">Personaliza cómo apareces en el nodo.</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative group">
          <img 
            src={avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"} 
            className="w-40 h-40 rounded-full border-4 border-white object-cover grayscale hover:grayscale-0 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            alt="Avatar"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Cambiar</span>
            <input type="file" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatar(URL.createObjectURL(file));
            }} />
          </label>
        </div>

        <div className="w-full space-y-6 bg-white/5 p-8 border border-white/10 rounded-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre de Usuario</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-white transition-all"
              placeholder="Ej: Administrator"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Biografía / Info</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-32 bg-black border border-white/10 p-4 rounded-xl text-white font-medium outline-none focus:border-white transition-all resize-none"
              placeholder="Descríbete..."
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
