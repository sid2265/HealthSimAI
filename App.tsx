import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Share2, 
  Bell, 
  Menu,
  Globe2,
  Download,
  BarChart3
} from 'lucide-react';
import SimulationInput from './components/SimulationInput';
import ResultsView from './components/ResultsView';
import HistoricalDataView from './components/HistoricalDataView';
import ModelConfigView from './components/ModelConfigView';
import { DEFAULT_INTERVENTIONS } from './constants';
import { Intervention, Region, SimulationState } from './types';
import { runSimulation } from './services/geminiService';

type ViewMode = 'dashboard' | 'history' | 'config';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  
  const [simulationState, setSimulationState] = useState<SimulationState>({
    selectedRegion: null,
    interventions: DEFAULT_INTERVENTIONS,
    isSimulating: false,
    result: null,
  });

  const handleRegionSelect = (region: Region) => {
    setSimulationState(prev => ({ ...prev, selectedRegion: region, result: null }));
  };

  const handleInterventionUpdate = (id: string, updates: Partial<Intervention>) => {
    setSimulationState(prev => ({
      ...prev,
      interventions: prev.interventions.map(i => i.id === id ? { ...i, ...updates } : i)
    }));
  };

  const handleRunSimulation = async () => {
    if (!simulationState.selectedRegion) return;

    setSimulationState(prev => ({ ...prev, isSimulating: true }));
    
    try {
      const result = await runSimulation(simulationState.selectedRegion, simulationState.interventions);
      setSimulationState(prev => ({ ...prev, result, isSimulating: false }));
    } catch (error) {
      console.error("Simulation error", error);
      setSimulationState(prev => ({ ...prev, isSimulating: false }));
      alert("Failed to run simulation. Please check your API key.");
    }
  };

  const renderContent = () => {
    switch(activeView) {
      case 'history':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 h-full">
            <HistoricalDataView />
          </div>
        );
      case 'config':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 h-full">
            <ModelConfigView />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
            {/* Left Panel: Simulation Controls */}
            <div className="xl:col-span-4 h-full flex flex-col">
              <SimulationInput 
                selectedRegion={simulationState.selectedRegion}
                onSelectRegion={handleRegionSelect}
                interventions={simulationState.interventions}
                onUpdateIntervention={handleInterventionUpdate}
                onRunSimulation={handleRunSimulation}
                isSimulating={simulationState.isSimulating}
              />
            </div>

            {/* Right Panel: Results */}
            <div className="xl:col-span-8 flex flex-col">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 min-h-[600px] flex-1">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-slate-100">
                   <div>
                     <h2 className="text-2xl font-bold text-slate-900">
                       {simulationState.result ? 'Impact Analysis Report' : 'Simulation Output'}
                     </h2>
                     <p className="text-sm text-slate-500 mt-1">
                       {simulationState.result 
                        ? `Projected outcomes for ${simulationState.result.regionName}` 
                        : 'Configure parameters to generate a new report'}
                     </p>
                   </div>
                   
                   {simulationState.result && (
                     <button className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2">
                       <Download className="w-4 h-4" /> Export PDF
                     </button>
                   )}
                 </div>
                 <ResultsView result={simulationState.result} />
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-0 md:w-20'
        } bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out flex flex-col fixed md:relative h-full z-30 shadow-2xl`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20 mr-3 flex-shrink-0">
             <Globe2 className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-xl text-white tracking-tight whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>
            HealthSim AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'dashboard' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/10' 
                : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Simulation Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveView('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'history' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/10' 
                : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Historical Data</span>
          </button>
          
          <button 
            onClick={() => setActiveView('config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'config' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/10' 
                : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Model Config</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-[#0b1120]">
           <div className={`flex items-center gap-3 ${!isSidebarOpen ? 'justify-center' : ''}`}>
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse border-2 border-[#0b1120]"></span>
                <Globe2 className="w-5 h-5 text-slate-500" />
              </div>
              <div className={`text-xs ${!isSidebarOpen && 'hidden'}`}>
                <p className="text-slate-400 font-medium">Data Stream Active</p>
                <p className="text-slate-600">WHO & World Bank API</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200/60 h-20 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Global Health Impact Simulator</h1>
              <p className="text-xs text-slate-500 mt-0.5">Predictive modeling for public health interventions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
               <Share2 className="w-4 h-4" />
               <span className="hidden sm:inline">Share Report</span>
             </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold ring-2 ring-white shadow-sm">
              AI
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto h-full">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;