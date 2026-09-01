import React from 'react';
import { BarChart3, Activity, ShieldCheck, Cpu, Server, CheckCircle2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCallout from '../components/ui/StatCallout';

export default function Analytics() {
  const { analytics } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#0B2545] text-white p-5 rounded-lg border-b-4 border-[#FFC300] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FFC300]" />
            <h2 className="text-xl font-bold font-serif text-white">Supervisor Analytics & Intelligence</h2>
          </div>
          <p className="text-xs text-gray-300">
            Real-time screening metrics, risk distributions, and multi-post system health.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#13315C] px-3 py-1.5 rounded text-xs font-mono">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>SSB Node 04: 100% Operational</span>
        </div>
      </div>

      {/* Top Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCallout label="Total Screened Today" value={analytics.screenedToday} icon={Activity} />
        <StatCallout label="Total Flagged" value={analytics.flaggedToday} icon={ShieldCheck} badgeColor="bg-[#C1272D]" />
        <StatCallout label="Avg Processing Speed" value={`${analytics.avgProcessingTimeSeconds}s`} icon={Cpu} badgeColor="bg-[#13315C]" />
        <StatCallout label="AI Uptime ULL Rate" value="99.98%" icon={Server} badgeColor="bg-[#2E7D32]" />
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Verifications Over Time */}
        <div className="bg-white border border-[#C7D6E8] rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-[#0B2545] font-serif uppercase tracking-wider">
            Screenings & Flagged Volume Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.verificationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#0B2545" fontSize={11} />
                <YAxis stroke="#0B2545" fontSize={11} />
                <Tooltip />
                <Bar dataKey="screened" fill="#0B2545" name="Screened" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flagged" fill="#C1272D" name="Flagged" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Distribution */}
        <div className="bg-white border border-[#C7D6E8] rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-[#0B2545] font-serif uppercase tracking-wider">
            Risk Classification Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analytics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold">
            {analytics.riskDistribution.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Indicators Section */}
      <div className="bg-white border border-[#C7D6E8] rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-[#0B2545] font-serif uppercase tracking-wider">
          AI Modules & System Health Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Module 1: OCR Parser</p>
              <p className="text-[11px] text-emerald-700">Tesseract/MRZ Active</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Module 2: Validator</p>
              <p className="text-[11px] text-emerald-700">SSB Watchlist Live</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Module 3: Forgery AI</p>
              <p className="text-[11px] text-emerald-700">ELA Engine Ready</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Module 4: Face Match</p>
              <p className="text-[11px] text-emerald-700">InsightFace GPU Active</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
