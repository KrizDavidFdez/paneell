
import React from 'react';
import { LanguageTemplate } from './types';

export const COLORS = {
  bg: '#000000',
  card: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.1)',
  accent: '#ffffff',
  success: '#00ff88',
  danger: '#ff3333',
  warning: '#ffcc00',
};

const IconNodeJS = () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM9.432 16.5c-.244 0-.44-.196-.44-.44V7.94c0-.244.196-.44.44-.44h5.136c.244 0 .44.196.44.44v.88c0 .244-.196.44-.44.44h-3.816v2.2h3.376c.244 0 .44.196.44.44v.88c0 .244-.196.44-.44.44h-3.376v2.86c0 .244-.196.44-.44.44h-.88z"/></svg>;
const IconPython = () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M14.25.3a2.47 2.47 0 0 0-2.43 2.14V4.5h-5.5a2.5 2.5 0 0 0-2.5 2.5v3a2.5 2.5 0 0 0 2.5 2.5h1.5v2.5a2.47 2.47 0 0 0 2.14 2.43h5.5v5.5a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-3a2.5 2.5 0 0 0-2.5-2.5h-1.5v-2.5a2.47 2.47 0 0 0-2.14-2.43H9.75v-5.5a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 1.75 7v3a2.5 2.5 0 0 0 2.5 2.5h1.5V15a2.5 2.5 0 0 0 2.5 2.5h5.5v5.5a2.47 2.47 0 0 0 2.43 2.14h3A2.5 2.5 0 0 0 22.25 22v-3a2.5 2.5 0 0 0-2.5-2.5h-1.5v-2.5a2.47 2.47 0 0 0-2.14-2.43h-5.5V6a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 4.25 6"/></svg>;
const IconGeneric = () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>;

export const LANGUAGES: LanguageTemplate[] = [
  { id: 'nodejs', name: 'Node.js', icon: 'JS', color: '#ffffff', description: 'V8 runtime.', category: 'Web', defaultDockerImage: 'ghcr.io/yolks/nodejs', availableVersions: ['16', '18', '20', '21', '22'] },
  { id: 'python', name: 'Python', icon: 'PY', color: '#ffffff', description: 'Scripting & AI.', category: 'Data', defaultDockerImage: 'ghcr.io/yolks/python', availableVersions: ['3.8', '3.9', '3.10', '3.11', '3.12'] },
  { id: 'java', name: 'Java', icon: 'JV', color: '#ffffff', description: 'Enterprise.', category: 'System', defaultDockerImage: 'ghcr.io/yolks/java', availableVersions: ['8', '11', '17', '21'] },
  { id: 'bun', name: 'Bun', icon: 'BN', color: '#ffffff', description: 'Fast JS.', category: 'Web', defaultDockerImage: 'ghcr.io/yolks/bun', availableVersions: ['1.0', '1.1'] },
  { id: 'go', name: 'Go', icon: 'GO', color: '#ffffff', description: 'Cloud native.', category: 'System', defaultDockerImage: 'ghcr.io/yolks/go', availableVersions: ['1.19', '1.20', '1.21', '1.22'] },
  { id: 'rust', name: 'Rust', icon: 'RS', color: '#ffffff', description: 'Safety.', category: 'System', defaultDockerImage: 'ghcr.io/yolks/rust', availableVersions: ['1.70', '1.75', '1.78'] },
  { id: 'php', name: 'PHP', icon: 'PH', color: '#ffffff', description: 'Backend.', category: 'Web', defaultDockerImage: 'ghcr.io/yolks/php', availableVersions: ['7.4', '8.0', '8.1', '8.2', '8.3'] },
  { id: 'ruby', name: 'Ruby', icon: 'RB', color: '#ffffff', description: 'Dynamic.', category: 'Web', defaultDockerImage: 'ghcr.io/yolks/ruby', availableVersions: ['2.7', '3.0', '3.1', '3.2'] },
  { id: 'deno', name: 'Deno', icon: 'DN', color: '#ffffff', description: 'Secure JS.', category: 'Web', defaultDockerImage: 'ghcr.io/yolks/deno', availableVersions: ['1.30', '1.40', '1.45'] },
  // ... more languages can be added here
];

export const ICONS = {
  Terminal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Servers: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
    </svg>
  ),
  Files: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Startup: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  ),
  NodeIcon: IconNodeJS,
  PythonIcon: IconPython,
  GenericIcon: IconGeneric,
};
