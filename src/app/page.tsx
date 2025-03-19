"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [questions, setQuestions] = useState<{ question: string; options: string[]; answer: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleSelect = (option: string) => {
    if (!selectedOption) {
      setSelectedOption(option);
      if (option === questions[currentIndex]?.answer) {
        setCorrectAnswer(true);
        setScore((prev) => prev + 1);
      } else {
        setCorrectAnswer(false);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setCorrectAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (questions.length === 0) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-blue-500 text-white py-4 text-center text-2xl font-semibold">
        Quiz App
      </nav>

      {quizFinished ? (
        <div className="mt-20 bg-white p-10 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold">Quiz Completed!</h1>
          <p className="text-lg mt-4">Your Score: <span className="font-semibold">{score} / {questions.length}</span></p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setSelectedOption(null);
              setCorrectAnswer(null);
              setQuizFinished(false);
            }}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mt-10">
          <div className="flex justify-end gap-2 items-center mb-4">
            <h1 className="text-lg font-semibold">{currentIndex + 1} of {questions.length}</h1>
            <span className="text-gray-600">Score: {score}</span>
          </div>

          <h2 className="text-xl font-medium text-center my-4">{questions[currentIndex]?.question}</h2>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4">
            {questions[currentIndex]?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full py-3 text-lg font-medium rounded-lg border-2 transition ${
                  selectedOption
                    ? option === questions[currentIndex]?.answer
                      ? "border-green-500 bg-green-100 text-black"
                      : option === selectedOption
                      ? "border-red-500 bg-red-100 text-black"
                      : "border-gray-300 bg-gray-100 text-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedOption && (
            <button
              onClick={handleNext}
              className="w-full mt-4 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition"
            >
              {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
