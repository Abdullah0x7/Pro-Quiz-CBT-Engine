// quiz.js

let state = {
    questions: [],
    answers: {},
    currentIdx: 0,
    timer: null,
    timeRemaining: 0,
    examTitle: "",
    candidateName: "",
    duration: 0
};

export function initQuiz(questions, title, duration, name) {
    state.questions = questions;
    state.examTitle = title;
    state.duration = duration;
    state.timeRemaining = duration * 60;
    state.candidateName = name;
    state.answers = {};
    state.currentIdx = 0;
}

export function getState() {
    return state;
}

export function startTimer(onTick, onEnd) {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(() => {
        state.timeRemaining--;
        onTick(state.timeRemaining);
        if (state.timeRemaining <= 0) {
            clearInterval(state.timer);
            onEnd();
        }
    }, 1000);
}

export function stopTimer() {
    if (state.timer) clearInterval(state.timer);
}

export function setAnswer(questionId, answerId) {
    state.answers[questionId] = answerId;
}

export function nextQuestion() {
    if (state.currentIdx < state.questions.length - 1) {
        state.currentIdx++;
        return true;
    }
    return false;
}

export function prevQuestion() {
    if (state.currentIdx > 0) {
        state.currentIdx--;
        return true;
    }
    return false;
}

export function jumpToQuestion(idx) {
    if (idx >= 0 && idx < state.questions.length) {
        state.currentIdx = idx;
        return true;
    }
    return false;
}

export function calculateResults() {
    let correct = 0;
    state.questions.forEach(q => {
        if (state.answers[q.id] === q.correct) correct++;
    });
    const wrong = state.questions.length - correct;
    const percentVal = state.questions.length > 0 ? Math.round((correct / state.questions.length) * 100) : 0;

    return {
        correct,
        wrong,
        percentVal,
        total: state.questions.length,
        answers: state.answers,
        questions: state.questions,
        candidateName: state.candidateName
    };
}
