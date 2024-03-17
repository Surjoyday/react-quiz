import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTIONS = 30;
const initialState = {
  questions: [],

  filterQuestions: [],

  // "loading", "error", "ready", "active", "finished"
  status: "loading",

  index: 0,

  answer: null,

  points: 0,

  highScore: JSON.parse(localStorage.getItem("highScore")),

  secondsRemaining: null,

  difficultyLevel: "all",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        filterQuestions: action.payload,
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "setDifficulty":
      return {
        ...state,
        difficultyLevel: action.payload,
        filterQuestions: state.questions.filter(
          (ques) => ques.level === action.payload
        ),
      };

    case "startGame":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
      };

    case "newAnswer":
      const currentQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,

        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "endGame":
      const highScore =
        state.points > state.highScore ? state.points : state.highScore;

      localStorage.setItem("highScore", JSON.stringify(highScore));
      return {
        ...state,
        status: "finished",
        highScore,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    default:
      throw new Error("Action unkown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    questions,
    filterQuestions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
    difficultyLevel,
  } = state;

  const numQuestions = filterQuestions.length;

  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  // console.log(maxPoints);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            highScore={highScore}
            difficultyLevel={difficultyLevel}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />

            <Question
              question={filterQuestions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
