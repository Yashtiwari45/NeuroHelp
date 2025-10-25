// src/pages/TabularPredictionPage.tsx

import React, { useState, useEffect } from 'react';
import { 
  Brain, Database, AlertCircle, CheckCircle2, Loader2, User, Users,
  Calendar, Hash, TrendingUp, BarChart2, BookOpen, Globe, CheckSquare, List,
  AlertTriangle,
  Info // <-- NEW: Import the Info icon
} from 'lucide-react';

// The API URL for the 12-input XGBoost model
const TABULAR_API_URL = "https://yash07745-alzheimer-prediction-api.hf.space/predict";

// ==========================================================
// --- NEW: A dictionary for all our tooltip descriptions ---
// ==========================================================
const tooltipDescriptions = {
  RID: "Research ID: A unique, anonymous number assigned to each participant in the study.",
  Visit: "Visit Code: A number representing the specific study visit (e.g., 1 for baseline, 2 for 6-month follow-up).",
  AGE: "Age: The participant's age in years at the time of the study visit.",
  PTGENDER: "Participant Gender: The participant's reported gender (Male or Female).",
  PTEDUCAT: "Education (Years): The total number of years the participant spent in formal education.",
  PTETHCAT: "Ethnicity: The participant's ethnicity, categorized as Hispanic/Latino or Not Hispanic/Latino.",
  PTRACCAT: "Race: The participant's race category (e.g., White, Black, Asian).",
  APOE4: "APOE4 Allele Count: The number of 'e4' variants (0, 1, or 2) for the APOE gene. This is a significant genetic risk factor for Alzheimer's Disease.",
  MMSE: "Mini-Mental State Exam: A 30-point test to measure cognitive impairment. A lower score indicates more severe impairment.",
  imputed_genotype: "Imputed Genotype: A boolean (True/False) indicating if the genetic data was statistically inferred (True) or directly sequenced (False).",
  APOE1: "APOE Allele 1: The first of two alleles for the Apolipoprotein E (APOE) gene, inherited from one parent.",
  APOE2: "APOE Allele 2: The second of two alleles for the Apolipoprotein E (APOE) gene, inherited from the other parent."
};

// ==========================================================
// --- NEW: An upgraded input component with a tooltip ---
// ==========================================================
const FormInputWithTooltip = ({ icon, label, name, tooltipText, children, ...props }: any) => {
  const InputIcon = icon;
  
  const baseInputClasses = "relative block w-full rounded-lg bg-gray-700/50 border-gray-600 text-white shadow-sm transition-all duration-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-700 hover:border-blue-500 focus:scale-[1.02] transform";

  return (
    <div className="relative">
      {/* The label now includes the info icon and tooltip */}
      <label htmlFor={name} className="flex items-center gap-1.5 absolute -top-2 left-3 z-10 inline-block bg-gray-800 px-1 text-xs font-medium text-gray-400">
        <span>{label}</span>
        {/* Tooltip trigger */}
        <div className="group relative flex">
          <Info className="w-3.5 h-3.5 text-gray-500 cursor-help" />
          {/* Tooltip content */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3
                           bg-gray-900 text-white text-xs rounded-lg shadow-lg
                           opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                           transition-all duration-200 ease-in-out pointer-events-none z-50">
            {tooltipText}
            {/* Tooltip arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                            border-x-4 border-x-transparent
                            border-t-4 border-t-gray-900"></div>
          </span>
        </div>
      </label>
      
      {/* The input icon (brain, user, etc.) */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <InputIcon className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* The input or select element */}
      {props.type === "select" ? (
        <select id={name} name={name} {...props} className={baseInputClasses}>
          {children}
        </select>
      ) : (
        <input id={name} name={name} {...props} className={baseInputClasses} />
      )}
    </div>
  );
};


function TabularPredictionPage() {
  const [formData, setFormData] = useState({
    RID: 5,
    Visit: 1,
    AGE: 73.7,
    PTGENDER: 'Male',
    PTEDUCAT: 16,
    PTETHCAT: 'Not Hisp/Latino',
    PTRACCAT: 'White',
    APOE4: 0,
    MMSE: 29,
    imputed_genotype: true,
    APOE1: '3',
    APOE2: '3',
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: string | number | boolean = value;
    if (type === 'number') {
      finalValue = parseFloat(value);
    }
    if (name === 'imputed_genotype') {
      finalValue = value === 'true';
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setError(null);
    setErrorShake(false);

    try {
      await new Promise(res => setTimeout(res, 500));
      const response = await fetch(TABULAR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || `HTTP error! Status: ${response.status}`);
      }
      setPrediction(result.prediction);
    } catch (err: any) {
      setError(err.message);
      setErrorShake(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorShake) {
      const timer = setTimeout(() => setErrorShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [errorShake]);

  // Helper function to render the detailed result
  const renderPredictionResult = () => {
    if (!prediction) return null;

    let title = "";
    let description = "";
    let Icon = CheckCircle2;
    let colors = {
      icon: "text-green-400",
      border: "border-green-500/20",
      bg: "bg-green-500/10",
      title: "text-green-300"
    };

    switch (prediction) {
      case 'AD':
        title = "Alzheimer's Disease (AD)";
        description = "This result indicates a high probability of Alzheimer's Disease, characterized by significant memory, thinking, and behavior problems that interfere with daily life.";
        Icon = AlertCircle;
        colors = {
          icon: "text-red-400",
          border: "border-red-500/20",
          bg: "bg-red-500/10",
          title: "text-red-300"
        };
        break;
      case 'MCI':
        title = "Mild Cognitive Impairment (MCI)";
        description = "This result indicates Mild Cognitive Impairment, a stage between normal aging and dementia. Individuals may experience minor, but noticeable, memory or thinking issues.";
        Icon = AlertTriangle;
        colors = {
          icon: "text-yellow-400",
          border: "border-yellow-500/20",
          bg: "bg-yellow-500/10",
          title: "text-yellow-300"
        };
        break;
      case 'CN':
        title = "Cognitive Normal (CN)";
        description = "This result suggests the individual is Cognitively Normal, with no signs of memory or cognitive impairment beyond typical age-related changes.";
        Icon = CheckCircle2;
        colors = {
          icon: "text-green-400",
          border: "border-green-500/20",
          bg: "bg-green-500/10",
          title: "text-green-300"
        };
        break;
      default:
        title = `Unknown Result: ${prediction}`;
        description = "The model returned a result that is not recognized by the system.";
        Icon = AlertCircle;
        colors = {
          icon: "text-gray-400",
          border: "border-gray-500/20",
          bg: "bg-gray-500/10",
          title: "text-gray-300"
        };
    }

    return (
      <div className={`rounded-md ${colors.bg} p-4 border ${colors.border} animate-fade-in-up transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${colors.icon}`} aria-hidden="true" />
          </div>
          <div className="ml-4">
            <h3 className={`text-2xl font-bold ${colors.title}`}>{title}</h3>
            <div className="mt-2 text-md text-gray-200">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="text-center">
        <Database className="mx-auto h-12 w-12 text-blue-400 animate-pulse" />
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Tabular Data Prediction
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Use demographic and genetic data for an AI-powered diagnosis estimate.
        </p>
      </div>

      <div 
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30"
        style={{ animationDelay: '200ms' }}
      >
        <form onSubmit={handleSubmit}>
          
          {/* ========================================================== */}
          {/* --- MODIFIED: Now using FormInputWithTooltip --- */}
          {/* ========================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            <FormInputWithTooltip icon={Hash} label="RID (int)" name="RID" value={formData.RID} onChange={handleChange} tooltipText={tooltipDescriptions.RID} />
            <FormInputWithTooltip icon={Calendar} label="Visit (int)" name="Visit" value={formData.Visit} onChange={handleChange} tooltipText={tooltipDescriptions.Visit} />
            <FormInputWithTooltip icon={TrendingUp} label="AGE (float)" name="AGE" value={formData.AGE} step="0.1" onChange={handleChange} tooltipText={tooltipDescriptions.AGE} />
            
            <FormInputWithTooltip icon={User} label="Gender" name="PTGENDER" type="select" value={formData.PTGENDER} onChange={handleChange} tooltipText={tooltipDescriptions.PTGENDER}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </FormInputWithTooltip>
            
            <FormInputWithTooltip icon={BookOpen} label="Education (int)" name="PTEDUCAT" value={formData.PTEDUCAT} onChange={handleChange} tooltipText={tooltipDescriptions.PTEDUCAT} />
            
            <FormInputWithTooltip icon={Globe} label="Ethnicity" name="PTETHCAT" type="select" value={formData.PTETHCAT} onChange={handleChange} tooltipText={tooltipDescriptions.PTETHCAT}>
              <option value="Not Hisp/Latino">Not Hisp/Latino</option>
              <option value="Hisp/Latino">Hisp/Latino</option>
              <option value="Unknown">Unknown</option>
            </FormInputWithTooltip>
            
            <FormInputWithTooltip icon={Users} label="Race" name="PTRACCAT" type="select" value={formData.PTRACCAT} onChange={handleChange} tooltipText={tooltipDescriptions.PTRACCAT}>
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Asian">Asian</option>
            </FormInputWithTooltip>
            
            <FormInputWithTooltip icon={Brain} label="APOE4 (int)" name="APOE4" value={formData.APOE4} onChange={handleChange} tooltipText={tooltipDescriptions.APOE4} />
            <FormInputWithTooltip icon={BarChart2} label="MMSE (int)" name="MMSE" value={formData.MMSE} onChange={handleChange} tooltipText={tooltipDescriptions.MMSE} />
            
            <FormInputWithTooltip icon={CheckSquare} label="Imputed Genotype" name="imputed_genotype" type="select" value={formData.imputed_genotype.toString()} onChange={handleChange} tooltipText={tooltipDescriptions.imputed_genotype}>
              <option value="true">True</option>
              <option value="false">False</option>
            </FormInputWithTooltip>
            
            <FormInputWithTooltip icon={List} label="APOE1" name="APOE1" type="select" value={formData.APOE1} onChange={handleChange} tooltipText={tooltipDescriptions.APOE1}>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </FormInputWithTooltip>
            
            <FormInputWithTooltip icon={List} label="APOE2" name="APOE2" type="select" value={formData.APOE2} onChange={handleChange} tooltipText={tooltipDescriptions.APOE2}>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </FormInputWithTooltip>
          </div>
          
          <div className="mt-10">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.03]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Run Prediction
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display (This section is unchanged) */}
      <div className="mt-6 min-h-[100px]">
        
        {!isLoading && renderPredictionResult()}

        {error && (
          <div className={`rounded-md bg-red-500/10 p-4 border border-red-500/20 ${errorShake ? 'animate-shake' : 'animate-fade-in-up'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-300">An Error Occurred</h3>
                <div className="mt-2 text-sm text-red-200">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabularPredictionPage;