import { useQuiz } from "../context/QuizContext";
import Options from "./Options";

export default function Question() {
  const { questions, index, dispatch, answer, presentAnswer } = useQuiz();
  // console.log(question);

  const question = questions.at(index);

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
