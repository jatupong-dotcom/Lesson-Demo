export interface Question {
  word: string; // English word (e.g., "Cat")
  thai: string; // Thai translation (e.g., "แมว")
  options: string[]; // Mixed array of correct word + distractors
}

export type GameStatus = 'setup' | 'loading' | 'playing' | 'finished' | 'error';

export interface GameConfig {
  totalQuestions: number;
}

export interface GameState {
  questions: Question[];
  currentIndex: number;
  score: number;
  isCurrentQuestionAnswered: boolean;
}