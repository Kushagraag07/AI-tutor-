import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

const Assessment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "Which of the following is a correct sentence?",
      options: [
        "He don't like coffee.",
        "He doesn't likes coffee.",
        "He doesn't like coffee.",
        "He not like coffee."
      ],
      correctAnswer: "He doesn't like coffee."
    },
    {
      id: 2,
      question: "Choose the correct past tense form:",
      options: [
        "I goed to the store.",
        "I went to the store.",
        "I gone to the store.",
        "I going to the store."
      ],
      correctAnswer: "I went to the store."
    },
    {
      id: 3,
      question: "Select the proper use of articles:",
      options: [
        "I saw a elephant.",
        "I saw an elephant.",
        "I saw the elephant.",
        "I saw elephant."
      ],
      correctAnswer: "I saw an elephant."
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(newAnswers);
    }
  };

  const calculateScore = async (finalAnswers: string[]) => {
    const correctAnswers = finalAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const finalScore = (correctAnswers / questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    if (user) {
      try {
        await supabase
          .from('student_progress')
          .insert([
            {
              user_id: user.id,
              module_id: courseId,
              score: finalScore,
              completed: true
            }
          ]);
      } catch (err) {
        console.error('Error saving assessment results:', err);
      }
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Assessment</h1>

      {!showResults ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentQuestion / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{
                  width: `${(currentQuestion / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Assessment Results</h2>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {score}%
            </div>
            <p className="text-gray-600">
              You answered {Math.round((score / 100) * questions.length)} out of {questions.length} questions correctly
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="border rounded-lg p-4">
                <div className="flex items-start">
                  {answers[index] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                  )}
                  <div className="ml-3">
                    <p className="font-medium">{q.question}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Your answer: {answers[index]}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Correct answer: {q.correctAnswer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Assessment;