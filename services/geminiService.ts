
import { GoogleGenAI } from "@google/genai";
import { Intervention, Region, SimulationResult } from "../types";

const SIMULATION_MODEL = "gemini-2.5-flash";

export const runSimulation = async (
  region: Region,
  interventions: Intervention[]
): Promise<SimulationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please provide a valid API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const activeInterventions = interventions.filter(i => i.active);
  const interventionDesc = activeInterventions.length > 0 
    ? activeInterventions.map(i => `- ${i.name}: ${i.intensity}% Intensity`).join("\n")
    : "No new interventions (Baseline Scenario)";

  // Handling for custom regions where we might not have exact stats
  const contextString = region.isCustom 
    ? `Target Region Name: ${region.name}. Note: Exact baseline statistics are NOT provided. You must ESTIMATE realistic 2024 demographics, economic, and health baselines for this specific region/country based on your knowledge base.`
    : `Target Region: ${region.name}.
       Population: ${region.population}
       Baseline Mortality: ${region.baselineMortality} (per 1000)
       GDP per capita: $${region.baselineGDP}`;

  const prompt = `
    Act as a sophisticated epidemiological and economic simulation engine utilizing WHO, World Bank, and UN data models.
    
    Target: ${contextString}
    
    USER SELECTED INTERVENTIONS (Parameters):
    ${interventionDesc}
    
    INSTRUCTIONS:
    1. Simulate a 5-year timeline.
    2. "Baseline" values represent the "Business as Usual" scenario (if no new interventions were added).
    3. "Projected" values represent the outcome AFTER applying the user's interventions.
    4. CRITICAL: The difference between Baseline and Projected must be mathematically proportional to the INTENSITY of the selected interventions. 
       - If intensity is 100%, show maximum realistic improvement. 
       - If intensity is 10%, show minimal improvement over baseline.
       - If "Infrastructure" interventions are high, GDP and Healthcare Access should rise significantly.
       - If "Medical" interventions are high, Mortality and Disease Prevalence should drop significantly.
    
    OUTPUT REQUIREMENTS:
    Return strictly JSON matching this schema:
    {
      "regionName": "string",
      "summary": "string (executive summary contrasting the current path vs the new path)",
      "impactScore": number (0-100 overall effectiveness of strategy),
      "livesSaved": number (integer estimate of difference in deaths),
      "economicROI": number (e.g., 1.5),
      "keyInsights": ["string", "string", "string"],
      "recommendations": ["string", "string", "string"],
      "estimatedBaseline": {
        "population": number,
        "gdp": number,
        "mortality": number,
        "description": "string"
      },
      "interventionImpact": [
        { "name": "Intervention Name", "score": number (relative contribution), "category": "string" }
      ],
      "data": [
        {
          "year": 1,
          "mortalityRate": number (projected),
          "mortalityBaseline": number (no action),
          "lifeExpectancy": number (projected),
          "lifeExpectancyBaseline": number (no action),
          "diseasePrevalence": number (projected %),
          "diseaseBaseline": number (no action %),
          "healthcareAccess": number (projected %),
          "healthcareBaseline": number (no action %),
          "economicIndex": number (projected 0-100),
          "economicBaseline": number (no action 0-100)
        }
        // ... Repeat for years 2-5
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: SIMULATION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, 
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (!parsed.interventionImpact) parsed.interventionImpact = [];
      return parsed as SimulationResult;
    } else {
        throw new Error("No data returned from simulation.");
    }
  } catch (error) {
    console.error("Simulation failed:", error);
    return {
        regionName: region.name,
        summary: "Simulation unable to complete (API Error).",
        impactScore: 0,
        livesSaved: 0,
        economicROI: 0,
        keyInsights: ["Error connecting to predictive engine."],
        recommendations: ["Retry simulation."],
        data: [],
        interventionImpact: []
    };
  }
};
