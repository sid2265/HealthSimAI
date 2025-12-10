import React, { useState } from 'react';
import { Settings, Server, Shield, Cpu, Save } from 'lucide-react';

const ModelConfigView: React.FC = () => {
  const [duration, setDuration] = useState(5);
  const [strictness, setStrictness] = useState('standard');
  const [useRealTime, setUseRealTime] = useState(true);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          System Configuration
        </h2>
        <p className="text-slate-500">
          Manage predictive model parameters and API connectivity settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Model Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Cpu className="w-4 h-4 text-indigo-600" /> Model Parameters
           </h3>
           
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">
                 Simulation Duration (Years)
               </label>
               <div className="flex items-center gap-4">
                 <input 
                    type="range" 
                    min="3" 
                    max="10" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <span className="text-sm font-bold text-indigo-600 w-8 text-center">{duration}</span>
               </div>
               <p className="text-xs text-slate-500 mt-1">Longer durations increase prediction variance.</p>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                 Inference Strictness
               </label>
               <div className="grid grid-cols-3 gap-2">
                 {['Conservative', 'Standard', 'Aggressive'].map((mode) => (
                   <button
                    key={mode}
                    onClick={() => setStrictness(mode.toLowerCase())}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      strictness === mode.toLowerCase()
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                   >
                     {mode}
                   </button>
                 ))}
               </div>
             </div>
           </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-emerald-600" /> Data & Connectivity
           </h3>

           <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-md shadow-sm">
                   <Server className="w-4 h-4 text-indigo-600" />
                 </div>
                 <div>
                   <p className="text-sm font-semibold text-slate-700">Real-time Data Fetching</p>
                   <p className="text-xs text-slate-500">Connect to external APIs for latest stats</p>
                 </div>
               </div>
               <input 
                  type="checkbox" 
                  checked={useRealTime}
                  onChange={(e) => setUseRealTime(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                />
             </div>
             
             <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs leading-relaxed">
               <strong>Note:</strong> Adjusting these parameters will reload the AI model context. Ensure you have a stable connection before applying changes.
             </div>
           </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default ModelConfigView;