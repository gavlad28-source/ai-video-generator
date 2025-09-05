
import { AllTranslations, Language } from '../types';

export const translations: AllTranslations = {
  [Language.EN]: {
    appTitle: 'AI Video Generator',
    promptLabel: 'Your Vision',
    promptPlaceholder: 'e.g., A majestic lion walking on a beach at sunset, cinematic style',
    uploadImage: 'Add Image',
    generateButton: 'Generate Video',
    generatingButton: 'Generating...',
    idleText: 'Your generated video will appear here.',
    generatingTitle: 'Crafting Your Video...',
    errorTitle: 'An Error Occurred',
    downloadVideo: 'Download Video',
  },
  [Language.RU]: {
    appTitle: 'Генератор Видео ИИ',
    promptLabel: 'Ваше видение',
    promptPlaceholder: 'например, Величественный лев идет по пляжу на закате, кинематографический стиль',
    uploadImage: 'Добавить изображение',
    generateButton: 'Сгенерировать видео',
    generatingButton: 'Генерация...',
    idleText: 'Ваше сгенерированное видео появится здесь.',
    generatingTitle: 'Создание вашего видео...',
    errorTitle: 'Произошла ошибка',
    downloadVideo: 'Скачать видео',
  },
  [Language.HE]: {
    appTitle: 'מחולל וידאו AI',
    promptLabel: 'החזון שלך',
    promptPlaceholder: 'למשל, אריה מלכותי הולך על חוף הים בשקיעה, סגנון קולנועי',
    uploadImage: 'הוסף תמונה',
    generateButton: 'צור וידאו',
    generatingButton: 'יוצר...',
    idleText: 'הסרטון שנוצר יופיע כאן.',
    generatingTitle: 'יוצר את הסרטון שלך...',
    errorTitle: 'אירעה שגיאה',
    downloadVideo: 'הורד וידאו',
  },
};
