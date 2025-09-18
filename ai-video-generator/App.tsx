
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { VideoPlayer } from './components/VideoPlayer';
import { LanguageProvider } from './contexts/LanguageContext';
import { generateVideoFromPrompt } from './services/geminiService';
import { GenerationState } from './types';

function App() {
  const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.IDLE);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string, image?: { base64: string; mimeType: string; }) => {
    setGenerationState(GenerationState.GENERATING);
    setVideoUrl(null);
    setError(null);
    setProgressMessage('Initializing video generation...');

    try {
      const videoBlob = await generateVideoFromPrompt(prompt, image, (message) => {
        setProgressMessage(message);
        // Assuming polling starts after initial generation call
        if(message.includes('Polling')) {
            setGenerationState(GenerationState.POLLING);
        }
      });
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      setGenerationState(GenerationState.SUCCESS);
      setProgressMessage('Video generated successfully!');
    } catch (err) {
      console.error(err);
      // More robust error message extraction
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof (err as any).message === 'string') {
        errorMessage = (err as any).message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      setGenerationState(GenerationState.ERROR);
      setProgressMessage(''); // Clear progress message on error
    }
  }, []);

  return (
    <LanguageProvider>
      <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-400 mb-8">
              Create stunning videos from text or images. Describe your scene, upload an optional reference image, and let our AI bring your vision to life.
            </p>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl mb-8">
              <PromptForm 
                onGenerate={handleGenerate} 
                isGenerating={generationState === GenerationState.GENERATING || generationState === GenerationState.POLLING} 
              />
            </div>
            <VideoPlayer
              generationState={generationState}
              progressMessage={progressMessage}
              videoUrl={videoUrl}
              error={error}
            />
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
