
import { Intervention, Region } from './types';

export const REGIONS: Region[] = [
  {
    id: 'global',
    name: 'Global Average',
    population: 8000000000,
    baselineMortality: 45,
    baselineGDP: 12000,
    description: 'Worldwide aggregate health and economic simulation.',
    countries: [] 
  },
  {
    id: 'sub_saharan_africa',
    name: 'Sub-Saharan Africa',
    population: 1100000000,
    baselineMortality: 76,
    baselineGDP: 1600,
    description: 'High burden of infectious diseases, developing infrastructure.',
    countries: ['Nigeria', 'Ethiopia', 'DR Congo', 'South Africa', 'Kenya', 'Uganda', 'Sudan', 'Angola', 'Ghana', 'Mozambique']
  },
  {
    id: 'southeast_asia',
    name: 'Southeast Asia',
    population: 675000000,
    baselineMortality: 60,
    baselineGDP: 4500,
    description: 'Rapidly industrializing, mixed healthcare access.',
    countries: ['Indonesia', 'Vietnam', 'Thailand', 'Philippines', 'Malaysia', 'Myanmar', 'Cambodia', 'Laos', 'Singapore']
  },
  {
    id: 'south_america',
    name: 'South America',
    population: 430000000,
    baselineMortality: 55,
    baselineGDP: 8500,
    description: 'Urbanized population, challenges with inequality and vector-borne diseases.',
    countries: ['Brazil', 'Colombia', 'Argentina', 'Peru', 'Venezuela', 'Chile', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay']
  },
  {
    id: 'south_asia',
    name: 'South Asia',
    population: 1900000000,
    baselineMortality: 62,
    baselineGDP: 2200,
    description: 'High population density, dual burden of communicable and lifestyle diseases.',
    countries: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Afghanistan', 'Bhutan', 'Maldives']
  },
  {
    id: 'western_europe',
    name: 'Western Europe',
    population: 196000000,
    baselineMortality: 12,
    baselineGDP: 45000,
    description: 'Aging population, advanced healthcare, focus on chronic diseases.',
    countries: ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Switzerland', 'Portugal']
  }
];

export const DEFAULT_INTERVENTIONS: Intervention[] = [
  {
    id: 'vax_expanded',
    name: 'Expanded Immunization',
    category: 'Medical',
    description: 'Universal coverage for measles, polio, and new malaria vaccines.',
    intensity: 50,
    active: false,
  },
  {
    id: 'wash_infra',
    name: 'WASH Infrastructure',
    category: 'Infrastructure',
    description: 'Investment in clean water access and modern sanitation facilities.',
    intensity: 50,
    active: false,
  },
  {
    id: 'telehealth',
    name: 'Telemedicine & AI',
    category: 'Policy',
    description: 'Digital health platforms to reach remote rural areas.',
    intensity: 50,
    active: false,
  },
  {
    id: 'vector_control',
    name: 'Advanced Vector Control',
    category: 'Environment',
    description: 'Genetically modified mosquito release and widespread bed net usage.',
    intensity: 50,
    active: false,
  },
  {
    id: 'nutri_supp',
    name: 'Maternal Nutrition',
    category: 'Medical',
    description: 'Supplements and food security programs for mothers and infants.',
    intensity: 50,
    active: false,
  },
  {
    id: 'climate_res',
    name: 'Climate Resilience',
    category: 'Environment',
    description: 'Infrastructure hardening against extreme weather and heat.',
    intensity: 50,
    active: false,
  },
  {
    id: 'education',
    name: 'Health Education',
    category: 'Policy',
    description: 'Community-led programs for hygiene and preventive care.',
    intensity: 50,
    active: false,
  }
];
