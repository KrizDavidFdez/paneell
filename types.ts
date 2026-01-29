
export enum ViewType {
  OVERVIEW = 'overview',
  SERVERS = 'servers',
  CONSOLE = 'console',
  FILES = 'files',
  STARTUP = 'startup',
  SETTINGS = 'settings',
  STATISTICS = 'statistics',
  CREATE_PROJECT = 'create_project',
  PROFILE = 'profile'
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
}

export interface ServerStatus {
  id: string;
  name: string;
  status: 'running' | 'offline' | 'starting' | 'stopping';
  ip: string;
  port: number;
  cpu: number;
  ram: string;
  ramUsage: number; // in MB
  maxRam: number; // in MB
  disk: string;
  maxDisk: string;
  templateIcon?: string;
  templateColor?: string;
  dockerImage: string;
  dockerVersion: string;
  files: FileItem[];
  logs: LogEntry[];
  startupCommand: string;
}

export interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'warning' | 'input' | 'success' | 'raw' | 'termux' | 'docker';
  message: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  modified: string;
  isDirectory: boolean;
  content?: string;
  path: string; 
}

export interface LanguageTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: string;
  defaultDockerImage: string;
  availableVersions: string[];
}
