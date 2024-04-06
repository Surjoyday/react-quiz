import { createContext, useContext, useEffect, useReducer } from "react";

const SECS_PER_QUESTIONS = 30;
const initialState = {
  questions: [],

  filterQuestions: [],

  // "loading", "error", "ready", "active", "finished"
  status: "loading",

  index: 0,

  answer: [],

  presentAnswer: null,

  points: 0,

  highScore: localStorage.getItem("highScore")
    ? JSON.parse(localStorage.getItem("highScore"))
    : 0,

  secondsRemaining: null,

  difficultyLevel: "",
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
        filterQuestions:
          action.payload === "100"
            ? [...state.questions]
            : state.questions.filter(
                (ques) => ques.points === Number(action.payload)
              ),
      };

    case "startGame":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.filterQuestions.length * SECS_PER_QUESTIONS,
      };

    case "newAnswer":
      const currentQuestion = state.filterQuestions.at(state.index);

      return {
        ...state,
        answer: [...state.answer, action.payload],

        presentAnswer: action.payload,

        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        presentAnswer: null,
      };

    case "previousQuestion":
      return {
        ...state,
        index: state.index - 1,
        presentAnswer: state.answer.at(state.index - 1),
      };

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
        filterQuestions: state.questions,
        status: "ready",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    default:
      throw new Error("Action unkown");
  }
}

const QuizContext = createContext();

function QuizProvider({ children }) {
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
    presentAnswer,
  } = state;

  const numQuestions = filterQuestions.length;

  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  // console.log(maxPoints);

  useEffect(function () {
    fetch("https://my-json-server.typicode.com/Surjoyday/react-quiz/questions/")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        filterQuestions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        difficultyLevel,
        presentAnswer,
        numQuestions,
        maxPoints,

        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error("QuizContext used outside QuizProvider");

  return context;
}

export { QuizProvider, useQuiz };
