// src/services/llmService.ts
import { Question } from '../types/assessment';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateQuestions(
  subject: string,
  topic: string,
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5
): Promise<Question[]> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Create the prompt
    const prompt = `You are an expert educational assessment creator for English language.
                    Crete 10 multiple-choice questions about English grammar and comprehension at an intermediate level.
                    Each question should have 4 options with exactly one correct answer.
                    Include a mix of questions on grammar rules, vocabulary usage, reading comprehension, and sentence structure.
                    Format your response as a JSON object with a 'questions' array of question objects.
                    Each question object should have: 'question', 'options' (array of 4 strings), 'correctAnswer' (string matching one option), and 'explanation'.
                    For reading comprehension questions, include a short passage followed by 1-2 questions about that passage.`;
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    // Extract the JSON object from the text (in case it's wrapped in ```json blocks)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : text;
    
    try {
      const parsedData = JSON.parse(jsonContent);
      const generatedQuestions = parsedData.questions || [];
      
      // Transform to our Question format
      return generatedQuestions.map((q: any, index: number) => ({
        id: `generated-${Date.now()}-${index}`,
        text: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        difficulty: difficultyLevel,
        conceptTag: topic,
        explanation: q.explanation || ''
      }));
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Failed to parse questions from Gemini response");
    }
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw error;
  }
}

// Alternative: Static questions for testing
export async function getStaticQuestions(
  subject: string,
  topic: string,
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5
): Promise<Question[]> {
  // Example static questions for testing
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      text: 'What is the primary purpose of a variable in programming?',
      options: [
        'To make the code look more complex',
        'To store and manage data in a program',
        'To create visual elements on the screen',
        'To connect to the internet'
      ],
      correctAnswer: 'To store and manage data in a program',
      difficulty: 'beginner',
      conceptTag: 'variables',
      explanation: 'Variables are used to store and manage data within a program.'
    },
    {
      id: 'q2',
      text: 'Which of the following is a correct way to declare a function in JavaScript?',
      options: [
        'function myFunction {}',
        'def myFunction():',
        'function myFunction() {}',
        'func myFunction() {}'
      ],
      correctAnswer: 'function myFunction() {}',
      difficulty: 'beginner',
      conceptTag: 'functions',
      explanation: 'In JavaScript, functions are declared using the function keyword followed by the name, parentheses, and curly braces.'
    },
    // Add more sample questions as needed
  ];

  // Filter and return based on parameters
  return sampleQuestions
    .filter(q => q.difficulty === difficultyLevel)
    .slice(0, count);
}