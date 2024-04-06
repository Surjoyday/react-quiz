import { useEffect, useRef } from "react";
import { useQuiz } from "../context/QuizContext";

export default function Timer() {
  const { dispatch, secondsRemaining } = useQuiz();

  const minutes = Math.floor(secondsRemaining / 60);

  const seconds = secondsRemaining % 60;

  const intervalIDRef = useRef(null);

  useEffect(
    function () {
      intervalIDRef.current = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      return function () {
        clearInterval(intervalIDRef.current);
      };
    },
    [dispatch]
  );

  return (
    <div className="timer">
      {minutes < 10 && "0"}
      {minutes}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}
