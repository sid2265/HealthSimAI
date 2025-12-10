import React from 'react';
import { SimulationResult } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, 
  Heart, Shield, PieChart as PieChartIcon, Globe, FileText,
  Database, AlertTriangle, Layers, TrendingUp
} from 'lucide-react';

interface Props {
  result: SimulationResult | null;
}

const ResultsView: React.FC<Props> = ({ result }) => {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center animate-fadeIn">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Activity className="w-10 h-10 text-indigo-400" />
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Simulate</h3>
          <p className="text-slate-500 leading-relaxed">
            Select a region and configure your intervention strategy to generate a predictive comparative analysis using our AI-driven model.
          </p>
        </div>
      </div>
    );
  }

  const impactPieData = result.interventionImpact.map(i => ({
    name: i.name,
    value: i.score
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e'];

  // Data for the last year (Year 5)
  const finalYear = result.data[result.data.length - 1];
  
  const calculateChange = (base: number, proj: number) => {
    const diff = proj - base;
    const percent = base !== 0 ? (diff / base) * 100 : 0;
    return { diff, percent };
  };

  const mortalityChange = calculateChange(finalYear.mortalityBaseline, finalYear.mortalityRate);
  const lifeExpChange = calculateChange(finalYear.lifeExpectancyBaseline, finalYear.lifeExpectancy);
  const diseaseChange = calculateChange(finalYear.diseaseBaseline, finalYear.diseasePrevalence);
  const econChange = calculateChange(finalYear.economicBaseline, finalYear.economicIndex);

  // Radar Chart Data Prep
  // Normalizing metrics to 0-100 scale where 100 is "Good"
  // For Mortality & Disease, lower is better, so we invert: 100 - value (normalized approx)
  const radarData = [
    {
      subject: 'Longevity',
      A: Math.min(100, (finalYear.lifeExpectancyBaseline / 90) * 100),
      B: Math.min(100, (finalYear.lifeExpectancy / 90) * 100),
      fullMark: 100,
    },
    {
      subject: 'Economic',
      A: finalYear.economicBaseline,
      B: finalYear.economicIndex,
      fullMark: 100,
    },
    {
      subject: 'Healthcare',
      A: finalYear.healthcareBaseline,
      B: finalYear.healthcareAccess,
      fullMark: 100,
    },
    {
      subject: 'Survival',
      // Arbitrary scaling for visualization: Mortality 100 = 0 score, Mortality 0 = 100 score
      A: Math.max(0, 100 - finalYear.mortalityBaseline), 
      B: Math.max(0, 100 - finalYear.mortalityRate),
      fullMark: 100,
    },
    {
      subject: 'Wellness',
      A: Math.max(0, 100 - finalYear.diseaseBaseline),
      B: Math.max(0, 100 - finalYear.diseasePrevalence),
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex-1">
           <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
             <Globe className="w-5 h-5 text-indigo-600" /> 
             {result.regionName}
             {result.estimatedBaseline?.description && (
               <span className="text-xs font-normal text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full bg-white hidden sm:inline-block">
                 Custom Analysis
               </span>
             )}
           </h3>
           <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">{result.summary}</p>
        </div>
        <div className="flex gap-6 text-sm border-l border-slate-200 pl-6 flex-shrink-0">
           <div>
              <span className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-0.5">Population</span>
              <span className="font-bold text-slate-700">{(result.estimatedBaseline?.population || 0).toLocaleString()}</span>
           </div>
           <div>
              <span className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-0.5">Baseline GDP</span>
              <span className="font-bold text-slate-700">${(result.estimatedBaseline?.gdp || 0).toLocaleString()}</span>
           </div>
        </div>
      </div>

      {/* Holistic View: Radar Chart + Comparative Table */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Radar Chart */}
        <div className="xl:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Holistic Impact Analysis</h3>
          </div>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Baseline"
                  dataKey="A"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="#cbd5e1"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Projected"
                  dataKey="B"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => value.toFixed(0)}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="absolute top-2 right-2 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              Normalized Score (0-100)
            </div>
          </div>
        </div>

        {/* Comparative Table */}
        <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
             <FileText className="w-4 h-4 text-indigo-600" />
             <h3 className="font-bold text-slate-800">Year 5 Comparative Metrics</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Metric</th>
                  <th className="px-6 py-3 font-medium text-slate-400">Baseline</th>
                  <th className="px-6 py-3 font-medium text-indigo-600">Projected</th>
                  <th className="px-6 py-3 font-medium">Net Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 group">
                  <td className="px-6 py-4 font-medium text-slate-900">Mortality Rate <span className="text-xs font-normal text-slate-400 ml-1">(per 1k)</span></td>
                  <td className="px-6 py-4 text-slate-500">{finalYear.mortalityBaseline.toFixed(1)}</td>
                  <td className="px-6 py-4 text-indigo-700 font-bold">{finalYear.mortalityRate.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${mortalityChange.diff < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {mortalityChange.diff > 0 ? '+' : ''}{mortalityChange.percent.toFixed(1)}%
                      </span>
                      {/* Visual Bar */}
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${mortalityChange.diff < 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                          style={{ width: `${Math.min(100, Math.abs(mortalityChange.percent))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 group">
                  <td className="px-6 py-4 font-medium text-slate-900">Life Expectancy <span className="text-xs font-normal text-slate-400 ml-1">(Years)</span></td>
                  <td className="px-6 py-4 text-slate-500">{finalYear.lifeExpectancyBaseline.toFixed(1)}</td>
                  <td className="px-6 py-4 text-indigo-700 font-bold">{finalYear.lifeExpectancy.toFixed(1)}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${lifeExpChange.diff > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {lifeExpChange.diff > 0 ? '+' : ''}{lifeExpChange.percent.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${lifeExpChange.diff > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                          style={{ width: `${Math.min(100, Math.abs(lifeExpChange.percent))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 group">
                  <td className="px-6 py-4 font-medium text-slate-900">Disease Prevalence <span className="text-xs font-normal text-slate-400 ml-1">(%)</span></td>
                  <td className="px-6 py-4 text-slate-500">{finalYear.diseaseBaseline.toFixed(1)}%</td>
                  <td className="px-6 py-4 text-indigo-700 font-bold">{finalYear.diseasePrevalence.toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${diseaseChange.diff < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {diseaseChange.diff > 0 ? '+' : ''}{diseaseChange.percent.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${diseaseChange.diff < 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                          style={{ width: `${Math.min(100, Math.abs(diseaseChange.percent))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 group">
                  <td className="px-6 py-4 font-medium text-slate-900">Econ. Index <span className="text-xs font-normal text-slate-400 ml-1">(0-100)</span></td>
                  <td className="px-6 py-4 text-slate-500">{finalYear.economicBaseline.toFixed(1)}</td>
                  <td className="px-6 py-4 text-indigo-700 font-bold">{finalYear.economicIndex.toFixed(1)}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${econChange.diff > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {econChange.diff > 0 ? '+' : ''}{econChange.percent.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${econChange.diff > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                          style={{ width: `${Math.min(100, Math.abs(econChange.percent))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* KPI Cards with Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-white to-emerald-50/50 p-5 rounded-xl border border-emerald-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-white shadow-sm border border-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
               <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">Cumulative</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Lives Saved</p>
          <h4 className="text-2xl font-black text-slate-800 mt-1">{result.livesSaved.toLocaleString()}</h4>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-white shadow-sm border border-blue-100 rounded-lg group-hover:scale-110 transition-transform">
               <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600/70">Efficiency</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Economic ROI</p>
          <h4 className="text-2xl font-black text-slate-800 mt-1">{result.economicROI}x</h4>
        </div>

         <div className="bg-gradient-to-br from-white to-rose-50/50 p-5 rounded-xl border border-rose-100 shadow-sm group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-white shadow-sm border border-rose-100 rounded-lg group-hover:scale-110 transition-transform">
               <Heart className="w-5 h-5 text-rose-600" />
            </div>
             <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600/70">Impact</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Mortality Delta</p>
          <h4 className="text-2xl font-black text-slate-800 mt-1">{mortalityChange.percent.toFixed(1)}%</h4>
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50/50 p-5 rounded-xl border border-indigo-100 shadow-sm group hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-white shadow-sm border border-indigo-100 rounded-lg group-hover:scale-110 transition-transform">
               <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600/70">Overall</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Strategy Score</p>
          <h4 className="text-2xl font-black text-slate-800 mt-1">{result.impactScore}/100</h4>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mortality Comparison Area Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">Mortality Trajectory</h3>
            </div>
            <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">5 Year Forecast</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}}/>
                <Area type="monotone" dataKey="mortalityBaseline" stroke="#94a3b8" strokeDasharray="4 4" fill="url(#colorBase)" name="Baseline (No Action)" />
                <Area type="monotone" dataKey="mortalityRate" stroke="#4f46e5" strokeWidth={3} fill="url(#colorProj)" name="Projected (With Interventions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Life Expectancy Line Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">Life Expectancy Impact</h3>
            </div>
            <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Avg. Years</div>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}}/>
                <Line type="monotone" dataKey="lifeExpectancyBaseline" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} name="Baseline" dot={false} />
                <Line type="monotone" dataKey="lifeExpectancy" stroke="#10b981" strokeWidth={3} name="Projected" dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Intervention Breakdown & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Impact Share Donut Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-indigo-600" /> Contribution Share
          </h3>
          <p className="text-xs text-slate-500 mb-4">Relative impact of selected interventions.</p>
          <div className="flex-1 min-h-[240px]">
             {impactPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {impactPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => `${value.toFixed(0)}%`}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px'}}/>
                </PieChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No breakdown available
                </div>
             )}
          </div>
        </div>

        {/* Text Analysis */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-indigo-600" /> Key Insights
            </h3>
            <ul className="space-y-3">
              {result.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-emerald-600" /> Recommendations
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                  <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Data Sources & Disclaimer */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-slate-400" /> Data Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {['World Health Organization (WHO)', 'The World Bank', 'United Nations Development Programme (UNDP)'].map((source) => (
                <span key={source} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                  {source}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Model Disclaimer
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This simulation utilizes generative AI to synthesize predictive scenarios based on public epidemiological and economic data. Results are for educational and planning purposes only and should not be considered as absolute medical or financial forecasts. Actual outcomes depend on complex, dynamic real-world variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;