import React from 'react';
import { REGIONS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { Globe, TrendingUp, DollarSign } from 'lucide-react';

const HistoricalDataView: React.FC = () => {
  // Transform REGIONS constant into chart-friendly data, excluding global aggregate for better comparison
  const data = REGIONS.filter(r => r.id !== 'global').map(region => ({
    name: region.name,
    mortality: region.baselineMortality,
    gdp: region.baselineGDP,
    population: region.population
  })).sort((a, b) => b.mortality - a.mortality);

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Global Health Baselines (2024)
        </h2>
        <p className="text-slate-500">
          Comparative analysis of current health and economic indicators across major geopolitical regions.
          This data serves as the baseline for all predictive simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto pb-6">
        
        {/* Mortality Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-500" /> Mortality Rates
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Per 1,000</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11, fill: '#64748b'}} interval={0} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="mortality" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GDP Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> GDP Per Capita
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">USD ($)</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...data].sort((a, b) => b.gdp - a.gdp)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11, fill: '#64748b'}} interval={0} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="gdp" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataView;