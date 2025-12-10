
export interface Intervention {
  id: string;
  name: string;
  category: 'Medical' | 'Infrastructure' | 'Policy' | 'Environment';
  description: string;
  intensity: number; // 0-100 scale of investment/effort
  active: boolean;
}

export interface Region {
  id: string;
  name: string;
  population: number;
  baselineMortality: number; // per 1000
  baselineGDP: number; // USD per capita
  description: string;
  isCustom?: boolean;
  countries?: string[]; // List of specific countries in this region
}

export interface YearlyData {
  year: number;
  
  // Projections (With Interventions)
  mortalityRate: number;
  lifeExpectancy: number; 
  diseasePrevalence: number; // %
  healthcareAccess: number; // %
  economicIndex: number; // Normalized 0-100
  
  // Baselines (Business as Usual / No Action)
  mortalityBaseline: number; 
  lifeExpectancyBaseline: number;
  diseaseBaseline: number;
  healthcareBaseline: number;
  economicBaseline: number;
}

export interface InterventionImpact {
  name: string;
  score: number; // Relative contribution 0-100
  category: string;
}

export interface SimulationResult {
  regionName: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  data: YearlyData[];
  interventionImpact: InterventionImpact[]; // New visualization data
  impactScore: number; 
  livesSaved: number;
  economicROI: number;
  estimatedBaseline?: { // For custom regions
    population: number;
    gdp: number;
    mortality: number;
    description: string;
  };
}

export interface SimulationState {
  selectedRegion: Region | null;
  interventions: Intervention[];
  isSimulating: boolean;
  result: SimulationResult | null;
}
