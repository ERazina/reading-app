import { useState, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
// import { useCurrentSentence } from './hooks/hook';
import "./App.css";

function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [current, setCurrent] = useState<string>("");
  const [activeButton, setActiveButton] = useState<"play" | "pause" | "stop" | null>(null);

  const text = "Another round of auto tariffs just went into effect. They could change the industry foreve. And smth else.";

  const splitedTextArr = text.match(/[^.!?]+[.!?]?/g) || [];

  let utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakText = (text: string) => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utteranceRef.current = utterance;

    utteranceRef.current.onboundary = (e) => {
      let currentPosition = 0;
      for (let i = 0; i < splitedTextArr.length; i++) {
        const word = splitedTextArr[i];
        const start = currentPosition;
        const end = start + word.length;

        if (e.charIndex >= start && e.charIndex <= end) {
          setCurrent(word);
          break;
        }
        currentPosition = end + 1;
      }
    };

    speechSynthesis.speak(utterance);
    setCurrent(current);
    setIsPlaying(false);
  };

  const speak = () => {
    speakText(text);
    setActiveButton("play");
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveButton("stop");
  };

  const pause = (isPlaying) => {
    if(isPlaying === true){
      speechSynthesis.pause();
      setActiveButton("pause")
    }
    else {
      speechSynthesis.resume();
    }
    setIsPlaying(!isPlaying);

  };

  return (
    <div className="App">
      <div>
        {splitedTextArr.map((t, index) => {
          return (
            <span
              className={current === t ? "highlight" : " "}
              key={index}
            >{`${t}. `}</span>
          );
        })}
      </div>
      <div className="controlls">
        <button className={`btn play ${activeButton === 'play'? 'active' : ''}`} onClick={speak}>
          <FaPlay />
        </button>
        <button className={`btn pause ${activeButton === 'pause'? 'active' : ''}`} onClick={() => pause(isPlaying)}>
          <FaPause />
        </button>
        <button className={`btn stop ${activeButton === 'stop'? 'active' : ''}`} onClick={stop}>
          <FaStop />
        </button>
      </div>
    </div>
  );
}

export default App;
