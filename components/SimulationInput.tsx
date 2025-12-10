import React, { useState } from 'react';
import { Intervention, Region } from '../types';
import { REGIONS } from '../constants';
import { Sliders, Activity, Search, Globe, ChevronDown, CheckCircle2, Play } from 'lucide-react';

interface Props {
  selectedRegion: Region | null;
  onSelectRegion: (r: Region) => void;
  interventions: Intervention[];
  onUpdateIntervention: (id: string, updates: Partial<Intervention>) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

const SimulationInput: React.FC<Props> = ({
  selectedRegion,
  onSelectRegion,
  interventions,
  onUpdateIntervention,
  onRunSimulation,
  isSimulating
}) => {
  const [customRegionName, setCustomRegionName] = useState('');

  const handleCustomRegionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRegionName.trim()) return;
    
    const customRegion: Region = {
      id: `custom_${Date.now()}`,
      name: customRegionName,
      population: 0, 
      baselineMortality: 0, 
      baselineGDP: 0, 
      description: 'Custom selected region. Baseline data will be estimated.',
      isCustom: true
    };
    
    onSelectRegion(customRegion);
  };

  const handleCountrySelect = (countryName: string, parentRegion: Region) => {
    if (countryName === 'all') {
      onSelectRegion(parentRegion);
    } else {
      const countryRegion: Region = {
        id: `specific_${countryName.toLowerCase().replace(/\s+/g, '_')}`,
        name: countryName,
        population: 0,
        baselineMortality: 0,
        baselineGDP: 0, 
        description: `Specific analysis for ${countryName} within ${parentRegion.name}.`,
        isCustom: true
      };
      onSelectRegion(countryRegion);
    }
  };

  const isRegionActive = (region: Region) => {
    if (!selectedRegion) return false;
    if (selectedRegion.id === region.id) return true;
    if (selectedRegion.isCustom && region.countries?.includes(selectedRegion.name)) return true;
    return false;
  };

  const getDropdownValue = (region: Region) => {
     if (selectedRegion?.id === region.id) return 'all';
     if (selectedRegion?.isCustom && region.countries?.includes(selectedRegion.name)) return selectedRegion.name;
     return 'all';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-indigo-600" />
          Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Define region and intervention parameters.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Region Selection */}
        <section>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" /> Target Geography
          </label>

          {/* Custom Search */}
          <form onSubmit={handleCustomRegionSubmit} className="mb-4 relative group">
             <input
                type="text"
                placeholder="Search specific country..."
                value={customRegionName}
                onChange={(e) => setCustomRegionName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all outline-none group-hover:bg-white"
             />
             <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
             {customRegionName && (
               <button 
                type="submit" 
                className="absolute right-2 top-2 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
               >
                 Set
               </button>
             )}
          </form>

          {/* Presets List */}
          <div className="space-y-2">
            {REGIONS.map((region) => {
              const active = isRegionActive(region);
              return (
                <div 
                  key={region.id}
                  className={`rounded-xl border transition-all duration-200 ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                >
                  <button
                    onClick={() => {
                      setCustomRegionName('');
                      onSelectRegion(region);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center justify-between group"
                  >
                    <div>
                      <div className={`font-semibold text-sm ${active ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {region.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {region.id === 'global' ? 'Global Aggregate' : `${(region.population / 1000000).toFixed(0)}M Population`}
                      </div>
                    </div>
                    {active && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>

                  {/* Country Dropdown */}
                  {active && region.countries && region.countries.length > 0 && (
                    <div className="px-4 pb-4 pt-0 animate-fadeIn">
                       <div className="relative">
                        <select
                          value={getDropdownValue(region)}
                          onChange={(e) => handleCountrySelect(e.target.value, region)}
                          className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-indigo-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:border-indigo-300 transition-colors"
                        >
                          <option value="all">Entire Region ({region.name})</option>
                          <option disabled>──────────</option>
                          {region.countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Interventions */}
        <section>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Interventions
          </label>
          <div className="space-y-3">
            {interventions.map((intervention) => (
              <div 
                key={intervention.id}
                className={`p-4 rounded-xl border transition-all ${
                  intervention.active 
                    ? 'border-indigo-200 bg-white shadow-sm' 
                    : 'border-slate-200 bg-slate-50/50 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-800">{intervention.name}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                        {intervention.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{intervention.description}</p>
                  </div>
                  <button
                    onClick={() => onUpdateIntervention(intervention.id, { active: !intervention.active })}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      intervention.active ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm ${
                      intervention.active ? 'left-[22px]' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                {intervention.active && (
                   <div className="mt-3 pt-3 border-t border-slate-100 animate-fadeIn">
                     <div className="flex justify-between items-center mb-1.5">
                       <span className="text-xs font-medium text-slate-600">Investment Intensity</span>
                       <span className="text-xs font-bold text-indigo-600">{intervention.intensity}%</span>
                     </div>
                     <input
                       type="range"
                       min="0"
                       max="100"
                       value={intervention.intensity}
                       onChange={(e) => onUpdateIntervention(intervention.id, { intensity: parseInt(e.target.value) })}
                       className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                     />
                   </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10">
        <button
          onClick={onRunSimulation}
          disabled={!selectedRegion || isSimulating}
          className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all ${
            !selectedRegion || isSimulating
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isSimulating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SimulationInput;