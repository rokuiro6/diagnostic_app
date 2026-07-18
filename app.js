let config = null;
let answers = []; 
let currentIndex = 0;

// DOM Elements
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const progressText = document.getElementById('question-progress-text');
const progressPercent = document.getElementById('question-progress-percent');
const progressBar = document.getElementById('question-progress-bar');
const prevBtn = document.getElementById('prev-btn');
const resetTestBtn = document.getElementById('reset-test-btn');
const restartBtn = document.getElementById('restart-btn');

const resultCode = document.getElementById('result-code');
const resultTitle = document.getElementById('result-title');
const resultDesc = document.getElementById('result-desc');
const resultWarning = document.getElementById('result-warning');
const resultWarningText = document.getElementById('result-warning-text');
const axisCharts = document.getElementById('axis-charts');

window.addEventListener('DOMContentLoaded', () => {
  // Check if global configurations loaded successfully from config.js
  if (typeof window.DIAGNOSTIC_CONFIG !== 'undefined') {
    config = window.DIAGNOSTIC_CONFIG;
    document.getElementById('intro-title').textContent = formatIntroTitle(config.name);
    resetDiagnostic();
    setupEvents();
  } else {
    alert("設定ファイル config.js が見つかりません。同じフォルダ内に配置してください。");
  }
});

function formatIntroTitle(name) {
  const baseTitle = name || "歩行者交通マナー\n違反タイプ診断";
  return baseTitle
    .replace("歩行者の交通マナー違反タイプ診断", "歩行者交通マナー\n違反タイプ診断")
    .replace("歩行者交通マナー違反タイプ診断", "歩行者交通マナー\n違反タイプ診断");
}

function setupEvents() {
  // Navigation Transitions
  startBtn.addEventListener('click', () => {
    currentIndex = 0;
    showQuestion(0);
    showScreen('screen-question');
  });
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) showQuestion(--currentIndex);
  });
  resetTestBtn.addEventListener('click', () => {
    if(confirm("診断を最初からやり直しますか？")) resetDiagnostic();
  });
  restartBtn.addEventListener('click', resetDiagnostic);

  // Circle options click handlers
  document.querySelectorAll('.likert-option').forEach(option => {
    option.addEventListener('click', () => {
      const val = parseInt(option.getAttribute('data-value'), 10);
      
      document.querySelectorAll('.likert-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      // 320ms visual confirmation delay before transitioning
      setTimeout(() => {
        answers[currentIndex] = val;
        if (currentIndex < config.questions.length - 1) {
          currentIndex++;
          
          // Question card slide out-in animation
          questionText.style.opacity = '0';
          questionText.style.transform = 'translateX(-20px)';
          
          setTimeout(() => {
            showQuestion(currentIndex);
            questionText.style.opacity = '1';
            questionText.style.transform = 'translateX(0)';
          }, 150);
        } else {
          finishDiagnostic();
        }
      }, 320);
    });
  });
}

function resetDiagnostic() {
  answers = new Array(config.questions.length).fill(null);
  currentIndex = 0;
  showScreen('screen-intro');
}

function showQuestion(index) {
  const q = config.questions[index];
  questionText.textContent = q.text;

  // Progress metrics calculation
  const total = config.questions.length;
  progressText.textContent = `質問 ${index + 1} / ${total}`;
  const pct = Math.round((index / total) * 100);
  progressPercent.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;

  prevBtn.disabled = index === 0;

  // Restore answer state visually
  document.querySelectorAll('.likert-option').forEach(o => o.classList.remove('selected'));
  const prevAns = answers[index];
  if (prevAns !== null) {
    const option = document.querySelector(`.likert-option[data-value="${prevAns}"]`);
    if (option) option.classList.add('selected');
  }
}

function finishDiagnostic() {
  const scores = {};
  const maxScores = {};

  config.axes.forEach(axis => {
    scores[axis.id] = 0;
    maxScores[axis.id] = 0;
  });

  // Calculate accumulated score
  config.questions.forEach((q, idx) => {
    scores[q.axis] += answers[idx] * (q.direction || 1);
    maxScores[q.axis] += 3;
  });

  let typeCode = "";
  const axisBreakdowns = [];

  config.axes.forEach(axis => {
    const score = scores[axis.id];
    const max = maxScores[axis.id];
    const isPositive = score >= 0;
    typeCode += isPositive ? axis.positive.code : axis.negative.code;

    // Normalizing percentage splits
    const posPercent = max > 0 ? Math.round(((score + max) / (2 * max)) * 100) : 50;
    const negPercent = 100 - posPercent;

    axisBreakdowns.push({
      axis, posPercent, negPercent, isPositive,
      domPercent: isPositive ? posPercent : negPercent
    });
  });

  resultCode.textContent = typeCode;

  // Load outcome descriptions
  const resultMatch = config.results[typeCode];
  const resultQuote = document.getElementById('result-quote');
  if (resultMatch) {
    resultTitle.textContent = resultMatch.title;
    if (resultQuote) {
      resultQuote.textContent = resultMatch.quote || '';
      resultQuote.style.display = resultMatch.quote ? 'block' : 'none';
    }
    resultDesc.innerHTML = resultMatch.description.replace(/\n/g, '<br>');
    resultWarning.style.display = 'none';
  } else {
    resultTitle.textContent = `未定義のタイプ: ${typeCode}`;
    resultDesc.innerHTML = `<span style="color: var(--text-muted);">config.js の results オブジェクトに結果を追加してください。</span>`;
    resultWarningText.textContent = `結果コード「${typeCode}」の定義がありません。`;
    resultWarning.style.display = 'flex';
  }

  // Draw chart metrics
  axisCharts.innerHTML = '';
  axisBreakdowns.forEach(item => {
    const row = document.createElement('div');
    row.className = 'axis-row';
    row.innerHTML = `
      <div class="axis-labels">
        <div class="axis-label-left" style="opacity: ${item.isPositive ? '1' : '0.5'}; font-weight: ${item.isPositive ? '700' : '400'};">
          <span>${item.axis.positive.label}</span>
          ${item.isPositive ? `<span class="axis-percent-value">${item.domPercent}%</span>` : `<span class="axis-percent-value" style="font-size:0.8rem;">(${100 - item.domPercent}%)</span>`}
        </div>
        <div class="axis-label-right" style="opacity: ${!item.isPositive ? '1' : '0.5'}; font-weight: ${!item.isPositive ? '700' : '400'};">
          <span>${item.axis.negative.label}</span>
          ${!item.isPositive ? `<span class="axis-percent-value">${item.domPercent}%</span>` : `<span class="axis-percent-value" style="font-size:0.8rem;">(${100 - item.domPercent}%)</span>`}
        </div>
      </div>
      <div class="axis-bar-container">
        <div class="axis-bar-fill ${item.isPositive ? 'left-dominant' : 'right-dominant'}" style="width: 0%;"></div>
      </div>
    `;
    axisCharts.appendChild(row);

    // Expand bar size after drawing
    setTimeout(() => {
      row.querySelector('.axis-bar-fill').style.width = `${item.domPercent}%`;
    }, 100);
  });

  showScreen('screen-result');
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    document.getElementById('diagnostic-view').scrollTop = 0;
  }
}
