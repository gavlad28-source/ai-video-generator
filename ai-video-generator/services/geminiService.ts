import { GoogleGenAI } from "@google/genai";

// More conservative exponential backoff configuration for polling
const INITIAL_BACKOFF_MS = 10000; // Start with 10 seconds
const MAX_BACKOFF_MS = 60000;    // Max out at 60 seconds
const BACKOFF_MULTIPLIER = 2;   // Double the delay each time

// This function converts a File object to a base64 string
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

// A list of reassuring messages for the user during the wait time
const loadingMessages = [
    "Warming up the AI artists...",
    "Composing the visual symphony...",
    "Rendering the first frames...",
    "Assembling pixel by pixel...",
    "Choreographing the digital dance...",
    "This is taking a moment, but great art needs patience...",
    "The AI is deep in thought, crafting your masterpiece...",
    "Finalizing the color palette...",
    "Adding the finishing touches..."
];

/**
 * Checks if an error object indicates a rate-limiting issue.
 * This is more robust than just checking for a '429' string.
 * @param error The error object to inspect.
 * @returns True if the error is a rate limit error, false otherwise.
 */
const isRateLimitError = (error: any): boolean => {
    const errorString = JSON.stringify(error).toLowerCase();
    return errorString.includes('429') || 
           errorString.includes('rate limit') || 
           errorString.includes('resource_exhausted');
};


export const generateVideoFromPrompt = async (
  prompt: string,
  image: { base64: string; mimeType: string } | undefined,
  onProgress: (message: string) => void
): Promise<Blob> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    onProgress("Sending request to the AI model...");

    const generateVideosParams: any = {
      model: 'veo-2.0-generate-001',
      prompt,
      config: {
        numberOfVideos: 1,
      }
    };

    if (image) {
      generateVideosParams.image = {
        imageBytes: image.base64,
        mimeType: image.mimeType,
      };
    }
    
    let operation = await ai.models.generateVideos(generateVideosParams);
    
    let messageIndex = 0;
    onProgress(`Polling for results... (${loadingMessages[messageIndex % loadingMessages.length]})`);
    
    let currentDelay = INITIAL_BACKOFF_MS;

    while (!operation.done) {
      const jitter = Math.random() * 1000; // Add up to 1s of jitter
      await new Promise(resolve => setTimeout(resolve, currentDelay + jitter));
      
      // Increase delay for the next poll
      currentDelay = Math.min(currentDelay * BACKOFF_MULTIPLIER, MAX_BACKOFF_MS);

      messageIndex++;
      onProgress(`Polling for results... (${loadingMessages[messageIndex % loadingMessages.length]})`);
      
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation failed: No download link found.");
    }

    onProgress("Fetching generated video...");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`Failed to download video: ${response.statusText}. Details: ${errorText}`);
    }

    onProgress("Video downloaded successfully.");
    return response.blob();
  } catch(err) {
      console.error("Gemini Service Error:", err);
      if (isRateLimitError(err)) {
          throw new Error("The AI is currently busy. Please wait a few moments before trying again. (Rate limit exceeded)");
      }
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during video generation.';
      throw new Error(errorMessage);
  }
};