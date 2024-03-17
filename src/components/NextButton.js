export default function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
  presentAnswer,
}) {
  if (index === 0 && presentAnswer === null) return null;
  if (presentAnswer === null)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "previousQuestion" })}
      >
        Previous
      </button>
    );

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "endGame" })}
      >
        Finish
      </button>
    );
}
