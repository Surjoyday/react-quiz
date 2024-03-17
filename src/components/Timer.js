import { useEffect, useRef } from "react";

export default function Timer({ dispatch, secondsRemaining }) {
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
