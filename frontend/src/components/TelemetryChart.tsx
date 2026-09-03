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
    <div className="w-full h-64 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-stone-300">Live IoT Hive Telemetry Trends</span>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" /> Temp (°C)</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-sky-400 mr-1.5" /> Humidity (%)</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" /> Weight (kg)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
          <YAxis stroke="#71717a" fontSize={11} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.5rem', color: '#f4f4f5', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temperature (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} name="Humidity (%)" />
          <Line type="monotone" dataKey="weight" stroke="#34d399" strokeWidth={2} dot={false} name="Weight (kg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
