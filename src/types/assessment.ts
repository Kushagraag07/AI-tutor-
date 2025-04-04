export interface Question {
    id: string;
    text: string;
    options?: string[];
    correctAnswer: string | string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    conceptTag: string;
    explanation?: string;
  }
  
  export interface Assessment {
    id: string;
    title: string;
    courseId: string;
    questions: Question[];
    adaptiveLogic?: boolean;
  }
  
  export interface AssessmentResult {
    userId: string;
    assessmentId: string;
    score: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    conceptScores: Record<string, number>;
    timestamp: string;
  }
  
  export interface LearningModule {
    id: string;
    title: string;
    description: string;
    contentUrl: string;
    estimatedTimeMinutes: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    concepts: string[];
    sequence: number;
  }
  
  export interface LearningPath {
    id: string;
    courseId: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    modules: LearningModule[];
    description: string;
  }