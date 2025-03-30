import { generateVideo } from "./videoService";

// NOTE: For production, store your API key in .env or another secure location.
const API_KEY = "AIzaSyAAcLjiN1r6Um-OLRQC-CnEurpv3osiShs";
// Replace with the correct model endpoint if needed.
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

/**
 * Main function to call Gemini LLM and optionally generate a video link.
 */
export async function generateContent(request: any): Promise<any> {
  try {
    const prompt = constructPrompt(request);

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const parsedContent = parseResponse(data);

    // Generate video if requested (for neuro queries, video generation is typically disabled)
    if (request.generateVideo && parsedContent.videoScript) {
      try {
        const videoUrl = await generateVideo(
          parsedContent.videoScript,
          request.topic,
          request.language
        );
        return {
          ...parsedContent,
          videoUrl,
        };
      } catch (videoError) {
        console.error("Error generating video link:", videoError);
        return parsedContent;
      }
    }

    return parsedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

/**
 * Construct the prompt text from user request data.
 * Updated to instruct the model to act as a neuro specialist and provide JSON output.
 */
function constructPrompt(request: any): string {
  return `
You are a knowledgeable and empathetic neuro specialist. Answer the following question with accurate, up-to-date, and medically sound information on neurological conditions such as Alzheimer's disease, Parkinson's disease, and related disorders.

Question: "${request.topic}"

Please provide your answer in JSON format with the following structure:
{
  "answer": "Your detailed answer here"
}
  `.trim();
}

/**
 * Parse the JSON from Gemini's text response.
 * If the JSON contains an "answer" field, use that; otherwise, use default fields.
 */
function parseResponse(data: any): any {
  try {
    const textResponse = data.candidates[0].content.parts[0].text;
    // Try to extract JSON from the LLM's text
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsedResponse = JSON.parse(jsonStr);

      // If the response follows the new JSON format with an "answer" field, use it.
      if (parsedResponse.answer) {
        return {
          title: "Answer",
          introduction: parsedResponse.answer,
          keyPoints: [],
          activities: [],
          resources: [],
          videoScript: "",
          codeSnippet: "",
        };
      }

      // Otherwise, fallback to the original structure.
      return {
        title: parsedResponse.title || "Answer",
        introduction: parsedResponse.introduction || "",
        keyPoints: parsedResponse.keyPoints || [],
        activities: parsedResponse.activities || [],
        resources: parsedResponse.resources || [],
        videoScript: parsedResponse.videoScript || "",
        codeSnippet: parsedResponse.codeSnippet || "",
      };
    }

    throw new Error("Failed to parse JSON from response");
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error("Failed to parse the generated content. Please try again.");
  }
}
