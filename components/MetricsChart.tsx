
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const data = [
  { time: '14:00', cpu: 12, ram: 45 },
  { time: '14:05', cpu: 15, ram: 46 },
  { time: '14:10', cpu: 45, ram: 48 },
  { time: '14:15', cpu: 32, ram: 47 },
  { time: '14:20', cpu: 28, ram: 50 },
  { time: '14:25', cpu: 55, ram: 52 },
  { time: '14:30', cpu: 38, ram: 51 },
];

const MetricsChart: React.FC<{ type: 'cpu' | 'ram' }> = ({ type }) => {
  const color = type === 'cpu' ? '#00d4ff' : '#10b981';
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#484f58" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#484f58" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', fontSize: '12px' }}
            itemStyle={{ color: color }}
          />
          <Area 
            type="monotone" 
            dataKey={type} 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${type})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
