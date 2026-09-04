import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TelemetryRecord } from '../types/index.js';

interface TelemetryChartProps {
  data: TelemetryRecord[];
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ data }) => {
  const formattedData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: d.temperature,
    humidity: d.humidity,
    weight: d.weight,
    activity: Math.round(d.activity * 100),
  }));

  return (
    <div className="w-full h-72 bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 text-xs">
        <span className="font-bold text-stone-800 text-sm">Live IoT Hive Telemetry Trends</span>
        <div className="flex items-center space-x-4 text-xs font-medium text-stone-600">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 mr-1.5" /> Temp (°C)</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-sky-600 mr-1.5" /> Humidity (%)</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1.5" /> Weight (kg)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" />
          <XAxis dataKey="time" stroke="#78716C" fontSize={11} />
          <YAxis stroke="#78716C" fontSize={11} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#EAE3D9', borderRadius: '0.75rem', color: '#1C1917', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Line type="monotone" dataKey="temp" stroke="#D97706" strokeWidth={2.5} dot={{ fill: '#D97706', r: 3 }} name="Temperature (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#0284C7" strokeWidth={2.5} dot={{ fill: '#0284C7', r: 3 }} name="Humidity (%)" />
          <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 3 }} name="Weight (kg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
