// main.js
import { parseFileContent } from './parser.js';
import * as storage from './storage.js';
import * as quiz from './quiz.js';
import * as ui from './ui.js';

// Event Listeners
document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('btn-history').addEventListener('click', showHistory);
document.getElementById('btn-start-exam').addEventListener('click', startExam);
document.getElementById('btn-prev').addEventListener('click', onPrev);
document.getElementById('btn-next').addEventListener('click', onNext);
document.getElementById('btn-submit').addEventListener('click', submitExam);
document.getElementById('btn-reset').addEventListener('click', resetApp);
document.getElementById('btn-history').addEventListener('click', showHistory);
document.getElementById('btn-back-upload').addEventListener('click', () => ui.showScreen('upload'));
document.getElementById('btn-clear-history').addEventListener('click', clearHistory);
document.getElementById('btn-exit').addEventListener('click', confirmExit);

// Initialize
window.onload = function() {
    storage.cleanupRecords();
};

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const { questions, examTitle } = parseFileContent(text, file.name);

    if (questions.length > 0) {
        // Initialize quiz state partially
        quiz.initQuiz(questions, examTitle, 0, ""); // Duration and name set later
        ui.renderConfig(questions.length, examTitle);
        ui.showScreen('config');
    } else {
        alert("No valid questions found. Please check file format.");
    }
}

function startExam() {
    const name = document.getElementById('candidateName').value.trim();
    if (!name) return alert("Please enter your name.");

    const mins = parseInt(document.getElementById('examDuration').value) || 30;

    // Update quiz state with final config
    const state = quiz.getState();
    quiz.initQuiz(state.questions, state.examTitle, mins, name);

    ui.renderUserDisplay(name);

    quiz.startTimer(
        (timeRemaining) => ui.updateTimerDisplay(timeRemaining),
        () => submitExam()
    );

    updateExamView();
    ui.showScreen('exam');
}

function updateExamView() {
    const state = quiz.getState();
    ui.renderQuestion(state, (qId, optId) => {
        quiz.setAnswer(qId, optId);
        updateExamView();
    });
    ui.renderMap(state, (idx) => {
        quiz.jumpToQuestion(idx);
        updateExamView();
    });
}

function onPrev() {
    if(quiz.prevQuestion()) updateExamView();
}

function onNext() {
    if(quiz.nextQuestion()) updateExamView();
}

function submitExam() {
    quiz.stopTimer();
    const results = quiz.calculateResults();

    storage.saveRecord({
        name: results.candidateName,
        score: results.correct,
        total: results.total,
        percent: results.percentVal,
        timestamp: Date.now()
    });

    ui.renderResults(results);
    ui.showScreen('results');
}

function showHistory() {
    const records = storage.getHistory();
    ui.renderHistory(records);
    ui.showScreen('history');
}

function clearHistory() {
    if(confirm("Delete all history records?")) {
        storage.clearHistory();
        showHistory();
    }
}

function confirmExit() {
    if (confirm("Are you sure you want to exit the exam? All progress will be lost.")) resetApp();
}

function resetApp() {
    quiz.stopTimer();
    document.getElementById('fileInput').value = '';
    document.getElementById('candidateName').value = '';
    ui.showScreen('upload');
}
