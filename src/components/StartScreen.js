export default function StartScreen({
  numQuestions,
  dispatch,
  highScore,
  difficultyLevel,
}) {
  return (
    <div className="start">
      <h2 className="highscore-stored">High-Score : {highScore}</h2>
      <h2>Welcome to the The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <QuestionLevel difficultyLevel={difficultyLevel} dispatch={dispatch} />
      <button className="btn" onClick={() => dispatch({ type: "startGame" })}>
        Let's Start
      </button>
    </div>
  );
}

function QuestionLevel({ difficultyLevel, dispatch }) {
  return (
    <div className="question-level">
      <h3>Choose difficulty level : </h3>

      <select
        value={difficultyLevel}
        onChange={(e) =>
          dispatch({ type: "setDifficulty", payload: e.target.value })
        }
      >
        <option value="100">All</option>
        <option value="10">Easy</option>
        <option value="20">Medium</option>
        <option value="30">Hard</option>
      </select>
    </div>
  );
}
