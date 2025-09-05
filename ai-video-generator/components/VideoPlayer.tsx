
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { GenerationState } from '../types';
import { Spinner, FilmReelIcon, AlertTriangleIcon } from './icons';

interface VideoPlayerProps {
  generationState: GenerationState;
  progressMessage: string;
  videoUrl: string | null;
  error: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ generationState, progressMessage, videoUrl, error }) => {
  const { t } = useLocalization();

  const renderContent = () => {
    switch (generationState) {
      case GenerationState.IDLE:
        return (
          <div className="text-center text-gray-500">
            <FilmReelIcon className="w-16 h-16 mx-auto mb-4" />
            <p>{t('idleText')}</p>
          </div>
        );
      case GenerationState.GENERATING:
      case GenerationState.POLLING:
        return (
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
            <p className="text-lg font-semibold">{t('generatingTitle')}</p>
            <p className="text-gray-400">{progressMessage}</p>
          </div>
        );
      case GenerationState.SUCCESS:
        if (videoUrl) {
          return (
            <div>
              <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg shadow-lg">
                Your browser does not support the video tag.
              </video>
              <a 
                href={videoUrl} 
                download="generated-video.mp4" 
                className="mt-4 inline-block w-full text-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('downloadVideo')}
              </a>
            </div>
          );
        }
        return null; // Should not happen if state is success
      case GenerationState.ERROR:
        return (
          <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
            <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4" />
            <p className="font-bold">{t('errorTitle')}</p>
            <p>{error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-inner min-h-[300px] flex items-center justify-center">
      {renderContent()}
    </div>
  );
};
