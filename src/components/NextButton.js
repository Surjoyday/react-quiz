import { useQuiz } from "../context/QuizContext";

export default function NextButton() {
  const { dispatch, index, numQuestions, presentAnswer } = useQuiz();

  if (index === 0 && presentAnswer === null) return null;
  if (
    presentAnswer === null ||
    (index === numQuestions - 1 && presentAnswer === null)

    // index !== 0 &&
    // presentAnswer === answer.at(index)
  )
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
