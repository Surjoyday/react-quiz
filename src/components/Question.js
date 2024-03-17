import Options from "./Options";

export default function Question({
  question,
  dispatch,
  answer,
  presentAnswer,
}) {
  // console.log(question);

  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
        presentAnswer={presentAnswer}
      />
    </div>
  );
}
