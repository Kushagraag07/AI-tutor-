// src/components/Assessment/AssessmentEngine.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from 'D:/intel/project/project/src/lib/supabase';
import { Question, AssessmentResult } from '../types/assessment';
import QuestionDisplay from './QuestionDisplay';
import ResultsDisplay from './ResultsDisplay';

interface AssessmentEngineProps {
  courseId: string;
  userId: string;
  onComplete: (result: AssessmentResult) => void;
}

const AssessmentEngine: React.FC<AssessmentEngineProps> = ({ 
  courseId, 
  userId, 
  onComplete 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      // Fetch questions from Supabase
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('course_id', courseId)
        .order('difficulty', { ascending: true });
      
      if (error) {
        console.error('Error fetching questions:', error);
      } else if (data) {
        setQuestions(data);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [courseId]);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    // Calculate overall score
    let correctCount = 0;
    const conceptScores: Record<string, { correct: number, total: number }> = {};

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)
        ? userAnswer.every(a => question.correctAnswer.includes(a)) && 
          question.correctAnswer.every(a => userAnswer.includes(a))
        : userAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;
      
      // Track concept mastery
      if (!conceptScores[question.conceptTag]) {
        conceptScores[question.conceptTag] = { correct: 0, total: 0 };
      }
      
      conceptScores[question.conceptTag].total += 1;
      if (isCorrect) conceptScores[question.conceptTag].correct += 1;
    });

    const score = (correctCount / questions.length) * 100;
    
    // Convert concept scores to percentages
    const normalizedConceptScores: Record<string, number> = {};
    Object.entries(conceptScores).forEach(([concept, { correct, total }]) => {
      normalizedConceptScores[concept] = (correct / total) * 100;
    });

    // Determine level
    let level: 'beginner' | 'intermediate' | 'advanced';
    if (score < 60) level = 'beginner';
    else if (score < 80) level = 'intermediate';
    else level = 'advanced';

    const result: AssessmentResult = {
      userId,
      assessmentId: `${courseId}-${Date.now()}`,
      score,
      level,
      conceptScores: normalizedConceptScores,
      timestamp: new Date().toISOString()
    };

    // Save result to Supabase
    saveResult(result);
    
    setResult(result);
    setCompleted(true);
    onComplete(result);
  };

  const saveResult = async (result: AssessmentResult) => {
    const { error } = await supabase
      .from('assessment_results')
      .insert([result]);
    
    if (error) {
      console.error('Error saving assessment result:', error);
    }
  };

  if (loading) return <div>Loading assessment...</div>;
  
  if (completed && result) {
    return <ResultsDisplay result={result} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="assessment-container">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="question-count">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      
      {currentQuestion && (
        <QuestionDisplay
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          userAnswer={answers[currentQuestion.id]}
        />
      )}
      
      <button 
        className="next-button"
        onClick={handleNext}
        disabled={!answers[currentQuestion?.id]}
      >
        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
};

export default AssessmentEngine;