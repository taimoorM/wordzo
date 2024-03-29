import { useState } from "react";
import { TimerProvider, useTimer } from "./contexts/TimerContext";
import Timer from "./components/Timer";

function App() {
  const [words, setWords] = useState<string[][]>([]);
  const [wordBoard, setWordBoard] = useState<
    { definition: string; word: string; valid: boolean }[]
  >([]);
  const [wordInput, setWordInput] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [wordIndex, setWordIndex] = useState<number | null>(null);

  const { startTimer, pauseTimer, resetTimer } = useTimer();

  const handleWordSubmit = async () => {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/dictionary?word=${wordInput}`,
      {
        headers: { "X-Api-Key": import.meta.env.VITE_API_NINJAS_API_KEY },
      }
    );
    const data = await response.json();
    console.log(data);
    if (!data.valid) {
      console.log("Word does not exist");
    } else {
      setWordBoard([...wordBoard, data]);
      console.log(data);
      setWordInput("");
      setScore(score + wordInput.length);
    }
  };

  const handleStartGame = async () => {
    setWordBoard([]);
    setWords([]);
    resetTimer();
    // Connect to API to get list of valid English words
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?number=3&length=5`
    );
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      setWords((words) => [...words, data[i].split("")]);
    }
    startTimer();
  };

  const handleLetterClick = (letter: string, index: number) => {
    setWordIndex(index);
    if (wordIndex !== index) {
      setWordInput(wordInput + letter);
      console.log(wordInput);
    }
  };

  const handleInputClear = () => {
    setWordInput("");
  };

  return (
    <div className="container flex flex-col items-center h-screen mx-auto bg-blue-400">
      <div className="mb-20">
        <h1 className="text-4xl text-center">Wordzo</h1>
      </div>
      <Timer />
      <div className="flex w-full justify-center">
        <div className="flex flex-col h-full">
          <div>Score: {score}</div>
          <div className="flex flex-col mr-32 w-[150px] border border-gray-800 p-2 space-y-2 h-full">
            {wordBoard.map((word, index) => (
              <div>
                <span>{index + 1}.</span> {word.word}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-10 flex justify-center">{wordInput}</div>

          <div className="flex flex-col justify-center items-center">
            {words.map((word, index) => (
              <div className="flex space-x-2 mb-5">
                {word.map((letter, i) => (
                  <div
                    key={i}
                    className={`p-2 border-2 border-gray-600 w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-black hover:text-gray-200 transition-color`}
                    onClick={() => handleLetterClick(letter, index)}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}
            <div className="space-x-2 mb-2">
              <button
                className="border p-2 bg-green-500"
                onClick={handleWordSubmit}
              >
                Submit
              </button>
              <button
                className="border p-2 bg-red-500"
                onClick={handleInputClear}
              >
                Clear
              </button>
            </div>
            <button
              className="border p-2 bg-orange-500"
              onClick={handleStartGame}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
