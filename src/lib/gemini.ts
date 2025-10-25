// ==========================================================
// --- FIX #1: API KEY & MODEL ---
// We now securely load the key from your .env file.
// We also removed the videoService import.
// ==========================================================
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

// ==========================================================
// --- FIX #2: JSON SCHEMA (No Video) ---
// This schema tells the model *exactly* what JSON format we
// expect. I have removed 'videoScript' and this replaces
// your old, fragile text-parsing logic.
// ==========================================================
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    "title": { "type": "STRING" },
    "introduction": { "type": "STRING" },
    "keyPoints": {
      "type": "ARRAY",
      "items": { "type": "STRING" }
    },
    "activities": {
      "type": "ARRAY",
      "items": { "type": "STRING" }
    },
    "resources": {
      "type": "ARRAY",
      "items": { "type": "STRING" }
    },
  },
  "propertyOrdering": [
    "title", "introduction", "keyPoints", 
    "activities", "resources"
  ]
};

// This is the prompt that guides the AI's persona.
const SYSTEM_PROMPT = `You are a compassionate AI assistant named Neuro-Sage, specializing in Alzheimer's disease. Your role is to provide clear, empathetic, and informative answers.

- You MUST respond in JSON format according to the provided schema.
- Your 'introduction' should be a direct answer to the user's question.
- 'keyPoints' should be 2-3 bullet points.
- 'activities' should be 2-3 actionable tips or mental exercises.
- 'resources' should be 2-3 links to reputable organizations (e.g., Alzheimer's Association).
- Do NOT include a video script.
- If the question is off-topic, gently decline and guide the user back to neurological health.
`;


export async function generateContent(request: any): Promise<any> {
  // Check if the .env key is missing
  if (!API_KEY || API_KEY.includes("PASTE_YOUR_NEW_GEMINI_KEY_HERE")) {
    console.error("Missing VITE_GEMINI_API_KEY in .env file.");
    throw new Error("API Key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  try {
    const payload = {
      contents: [
        {
          parts: [{ text: request.topic }], // The user's question
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json", // Ask for JSON
        responseSchema: RESPONSE_SCHEMA,     // Enforce our schema
      },
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    
    // ==========================================================
    // --- FIX #3: SIMPLIFIED RETURN ---
    // We now parse the content and return it directly.
    // No more videoUrl.
    // ==========================================================
    const parsedContent = parseResponse(data);
    return parsedContent; 
    
  } catch (error) {
    console.error("Error in generateContent:", error);
    throw error;
  }
}

// ==========================================================
// --- FIX #4: SIMPLIFIED PARSER (No Video) ---
// This replaces your old, complex text parser.
// ==========================================================
function parseResponse(data: any): any {
  try {
    const jsonText = data.candidates[0].content.parts[0].text;
    const parsedJson = JSON.parse(jsonText);

    return {
      title: parsedJson.title || "Answer",
      introduction: parsedJson.introduction || "I'm not sure how to respond to that.",
      keyPoints: parsedJson.keyPoints || [],
      activities: parsedJson.activities || [],
      resources: parsedJson.resources || [],
      // videoScript field is no longer here
    };

  } catch (error) { 
    console.error("Error parsing JSON response:", error, data);
    return {
      title: "Error",
      introduction: "Sorry, I had trouble processing that request. Please try again.",
      keyPoints: [],
      activities: [],
      resources: [],
    };
  }
}

