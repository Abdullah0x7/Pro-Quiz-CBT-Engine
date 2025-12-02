// ui.js
import { escapeHTML } from './utils.js';

const screens = {
    upload: document.getElementById('screen-upload'),
    config: document.getElementById('screen-config'),
    exam: document.getElementById('screen-exam'),
    results: document.getElementById('screen-results'),
    history: document.getElementById('screen-history')
};

export function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    if(screens[name]) screens[name].classList.remove('hidden');

    const controls = document.getElementById('exam-controls');
    if (name === 'exam') controls.classList.remove('hidden');
    else controls.classList.add('hidden');

    window.scrollTo(0,0);
}

export function updateTimerDisplay(timeRemaining) {
    const m = Math.floor(timeRemaining / 60);
    const s = timeRemaining % 60;
    const text = `${m}:${s.toString().padStart(2, '0')}`;
    const badge = document.getElementById('timer-badge');
    document.getElementById('timer-display').innerText = text;

    if (timeRemaining < 60) badge.classList.add('urgent');
    else badge.classList.remove('urgent');
}

export function renderConfig(totalQuestions, examTitle) {
    document.getElementById('totalQuestionsDisplay').innerText = totalQuestions;
    document.getElementById('fileNameDisplay').innerText = examTitle;
    document.getElementById('examDuration').value = totalQuestions; // Default 1 min per Q
}

export function renderQuestion(state, onSelectAnswer) {
    const q = state.questions[state.currentIdx];
    document.getElementById('question-text').innerText = q.text;
    document.getElementById('q-number').innerText = state.currentIdx + 1;
    document.getElementById('q-total').innerText = state.questions.length;

    // Progress Bar
    const pct = ((state.currentIdx + 1) / state.questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Options
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach(opt => {
        const isSelected = state.answers[q.id] === opt.id;
        const el = document.createElement('div');
        el.className = `option-label ${isSelected ? 'selected' : ''}`;
        el.onclick = () => onSelectAnswer(q.id, opt.id);
        el.innerHTML = `
            <div class="option-marker">${opt.id}</div>
            <span style="flex:1; font-weight:500;">${escapeHTML(opt.text)}</span>
        `;
        container.appendChild(el);
    });

    // Buttons
    document.getElementById('btn-prev').disabled = state.currentIdx === 0;
    if (state.currentIdx === state.questions.length - 1) {
        document.getElementById('btn-next').classList.add('hidden');
        document.getElementById('btn-submit').classList.remove('hidden');
    } else {
        document.getElementById('btn-next').classList.remove('hidden');
        document.getElementById('btn-submit').classList.add('hidden');
    }
}

export function renderMap(state, onJump) {
    const map = document.getElementById('question-map');
    map.innerHTML = '';
    state.questions.forEach((q, idx) => {
        const btn = document.createElement('div');
        const isAnswered = state.answers[q.id] != null;
        btn.className = `q-node ${isAnswered ? 'answered' : ''} ${state.currentIdx === idx ? 'active' : ''}`;
        btn.innerText = idx + 1;
        btn.onclick = () => onJump(idx);
        map.appendChild(btn);
    });
}

export function renderResults(results) {
    document.getElementById('result-name').innerText = results.candidateName;
    document.getElementById('score-correct').innerText = results.correct;
    document.getElementById('score-wrong').innerText = results.wrong;
    document.getElementById('score-percent').innerText = results.percentVal + '%';
    document.getElementById('score-total').innerText = results.correct;
    document.getElementById('score-max').innerText = results.total;

    // Generate Review
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '';

    results.questions.forEach((q, idx) => {
        const userAns = results.answers[q.id];
        const isCorrect = userAns === q.correct;

        const div = document.createElement('div');
        div.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;

        let optionsHtml = '';
        q.options.forEach(opt => {
            let className = 'review-option';
            let icon = '';

            if (opt.id === q.correct) {
                className += ' correct';
                icon = '✓';
            } else if (opt.id === userAns && !isCorrect) {
                className += ' user-wrong';
                icon = '✗';
            }

            optionsHtml += `<div class="${className}">
                <span><b>${opt.id}.</b> ${escapeHTML(opt.text)}</span>
                <span>${icon}</span>
            </div>`;
        });

        div.innerHTML = `
            <div style="font-weight:bold; margin-bottom:10px; font-size: 1.05rem; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                Question ${idx+1}: <span style="color:var(--text-main)">${escapeHTML(q.text)}</span>
            </div>
            ${optionsHtml}
            ${!isCorrect ? `<div style="margin-top:15px; font-size:0.9rem; padding: 10px; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 4px; color: #c53030;">Correct Answer: <strong>${q.correct}</strong></div>` : ''}
        `;
        reviewContainer.appendChild(div);
    });
}

export function renderHistory(records) {
    const tbody = document.getElementById('history-body');
    const msg = document.getElementById('no-history-msg');

    tbody.innerHTML = '';

    if (records.length === 0) {
        msg.classList.remove('hidden');
        tbody.parentNode.classList.add('hidden');
    } else {
        msg.classList.add('hidden');
        tbody.parentNode.classList.remove('hidden');

        records.sort((a, b) => b.timestamp - a.timestamp);

        records.forEach(r => {
            const date = new Date(r.timestamp);
            const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const badgeClass = r.percent >= 50 ? 'badge-green' : 'badge-red';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${timeStr}</td>
                <td style="font-weight:600; color:var(--primary);">${escapeHTML(r.name)}</td>
                <td>${r.score}/${r.total}</td>
                <td><span class="badge ${badgeClass}">${r.percent}%</span></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

export function renderUserDisplay(name) {
     document.getElementById('user-display').innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        ${escapeHTML(name)}
    `;
}
