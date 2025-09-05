
export enum Language {
  EN = 'en',
  RU = 'ru',
  HE = 'he',
}

export type Translations = {
  [key: string]: string;
};

export type AllTranslations = {
  [key in Language]: Translations;
};

export enum GenerationState {
  IDLE = 'idle',
  GENERATING = 'generating',
  POLLING = 'polling',
  SUCCESS = 'success',
  ERROR = 'error',
}
