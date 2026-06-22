// ══════════════════════════════════════
//  DATA
// ══════════════════════════════════════
const DAYS = [
  {
    key: 'seg',
    short: 'SEG',
    name: 'Segunda',
    focus: 'Peito + Bíceps',
    cardioMin: 45,
    rest: false,
    groups: [
      {
        icon: '•',
        muscle: 'Peito',
        sets: '4 séries cada',
        exercises: [
          { name: 'Supino Reto com Barra', detail: '4×8–10 reps' },
          { name: 'Crucifixo com Halteres', detail: '3×12 reps' },
          { name: 'Crossover (cabo alto)', detail: '3×15 reps' },
        ]
      },
      {
        icon: '•',
        muscle: 'Bíceps',
        sets: '3–4 séries cada',
        exercises: [
          { name: 'Rosca Direta com Barra', detail: '4×10 reps' },
          { name: 'Rosca Martelo com Halteres', detail: '3×12 reps' },
          { name: 'Rosca Concentrada', detail: '3×15 reps' },
        ]
      }
    ]
  },
  {
    key: 'ter',
    short: 'TER',
    name: 'Terça',
    focus: 'Costas + Tríceps',
    cardioMin: 45,
    rest: false,
    groups: [
      {
        icon: '•',
        muscle: 'Costas',
        sets: '4 séries cada',
        exercises: [
          { name: 'Barra Fixa (pegada pronada)', detail: '4×6–8 reps' },
          { name: 'Remada Curvada com Barra', detail: '4×8–10 reps' },
          { name: 'Puxada Frontal (polia)', detail: '3×12 reps' },
        ]
      },
      {
        icon: '•',
        muscle: 'Tríceps',
        sets: '3–4 séries cada',
        exercises: [
          { name: 'Tríceps Corda (polia)', detail: '4×12 reps' },
          { name: 'Tríceps Testa com Barra', detail: '3×10 reps' },
          { name: 'Mergulho em Paralelas', detail: '3×até a falha' },
        ]
      }
    ]
  },
  {
    key: 'qua',
    short: 'QUA',
    name: 'Quarta',
    focus: 'Posterior de Coxa',
    cardioMin: 45,
    rest: false,
    groups: [
      {
        icon: '•',
        muscle: 'Posterior de Coxa',
        sets: '4 séries cada',
        exercises: [
          { name: 'Stiff com Barra', detail: '4×10 reps' },
          { name: 'Flexora Deitado (máquina)', detail: '3×12 reps' },
          { name: 'Rosca Nórdica Assistida', detail: '3×8 reps' },
        ]
      },
      {
        icon: '•',
        muscle: 'Panturrilha',
        sets: '3 séries cada',
        exercises: [
          { name: 'Panturrilha em Pé (máquina)', detail: '4×15 reps' },
          { name: 'Panturrilha Sentado', detail: '3×20 reps' },
          { name: 'Panturrilha no Leg Press', detail: '3×20 reps' },
        ]
      }
    ]
  },
  {
    key: 'qui',
    short: 'QUI',
    name: 'Quinta',
    focus: 'Descanso',
    cardioMin: 0,
    rest: true,
    groups: []
  },
  {
    key: 'sex',
    short: 'SEX',
    name: 'Sexta',
    focus: 'Quadríceps',
    cardioMin: 45,
    rest: false,
    groups: [
      {
        icon: '•',
        muscle: 'Quadríceps',
        sets: '4 séries cada',
        exercises: [
          { name: 'Agachamento Livre com Barra', detail: '4×8–10 reps' },
          { name: 'Leg Press 45°', detail: '4×12 reps' },
          { name: 'Cadeira Extensora', detail: '3×15 reps' },
        ]
      }
    ]
  },
  {
    key: 'sab',
    short: 'SÁB',
    name: 'Sábado',
    focus: 'Posterior + Glúteo',
    cardioMin: 45,
    rest: false,
    groups: [
      {
        icon: '•',
        muscle: 'Posterior + Glúteo',
        sets: '4 séries cada',
        exercises: [
          { name: 'Stiff com Barra', detail: '4×10 reps' },
          { name: 'Flexora Deitado (máquina)', detail: '3×12 reps' },
          { name: 'Hip Thrust com Barra', detail: '4×12 reps' },
        ]
      },
      {
        icon: '•',
        muscle: 'Panturrilha',
        sets: '3 séries cada',
        exercises: [
          { name: 'Panturrilha em Pé (máquina)', detail: '4×15 reps' },
          { name: 'Panturrilha Sentado', detail: '3×20 reps' },
          { name: 'Panturrilha no Leg Press', detail: '3×20 reps' },
        ]
      },
        {
    key: 'dom',
    short: 'DOM',
    name: 'Domingo',
    focus: 'Descanso',
    cardioMin: 0,
    rest: true,
    groups: []
  }
    ]
  }
];

// ══════════════════════════════════════
//  STATE
// ══════════════════════════════════════
let currentDay = 0; // index of active day (Monday = 0)
let checkState = {}; // { dayKey_groupIdx_exIdx: bool }
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

// init to today (Mon=0 … Sat=5)
(function initDay() {
  const jsDay = new Date().getDay(); // 0=Sun, 1=Mon...
  const map = { 1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 7:6 };
  if (map[jsDay] !== undefined) currentDay = map[jsDay];
  // If Sunday (0) or Thursday (4=index3), still show Monday by default
  if (jsDay === 0) currentDay = 0;
})();

// ══════════════════════════════════════
//  RENDER
// ══════════════════════════════════════
function render() {
  renderWeekBar();
  renderMain();
}

function renderWeekBar() {
  const bar = document.getElementById('weekBar');
  bar.innerHTML = DAYS.map((d, i) => `
    <div class="week-dot ${d.rest ? 'rest-day' : ''} ${i === currentDay ? 'active' : ''}"
         data-day-index="${i}"
         title="${d.name}">
      <span class="dot-label">${d.short}</span>
      <div class="dot-icon"></div>
      <span class="dot-name">${d.rest ? '— —' : d.focus.split(' ')[0]}</span>
    </div>
  `).join('');
}

function renderMain() {
  const main = document.getElementById('mainContent');
  const day = DAYS[currentDay];

  if (day.rest) {
    main.innerHTML = `
      <div class="rest-screen">
        <div class="rest-icon">🛌</div>
        <h2>Dia de Descanso</h2>
        <p>Recuperação ativa — prioriza sono, hidratação e nutrição.</p>
      </div>`;
    return;
  }

  // Count total exercises for progress
  const totalEx = day.groups.reduce((acc, g) => acc + g.exercises.length, 0);
  const doneEx  = day.groups.reduce((acc, g, gi) =>
    acc + g.exercises.filter((_, ei) => checkState[`${day.key}_${gi}_${ei}`]).length, 0);
  const pct = totalEx ? Math.round((doneEx / totalEx) * 100) : 0;

  const groupsHtml = day.groups.map((g, gi) => `
    <div class="muscle-card">
      <div class="card-header">
        <div class="card-icon">${g.icon}</div>
        <div>
          <div class="card-muscle">${g.muscle}</div>
          <div class="card-sets">${g.sets}</div>
        </div>
      </div>
      <div class="exercise-list">
        ${g.exercises.map((ex, ei) => {
          const key = `${day.key}_${gi}_${ei}`;
          const done = !!checkState[key];
          return `
          <div class="exercise-item ${done ? 'done' : ''}" id="item_${key}">
            <input type="checkbox" ${done ? 'checked' : ''}
              onchange="toggleEx('${day.key}', ${gi}, ${ei})" />
            <div class="ex-num">${String(ei+1).padStart(2,'0')}</div>
            <div class="ex-info">
              <div class="ex-name">${ex.name}</div>
              <div class="ex-detail">${ex.detail}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');

  const cardioLabel = 'Cardio - sessão de 45 minutos';

  main.innerHTML = `
    <div class="day-panel visible">
      <div class="day-header">
        <div class="day-title">${day.name.toUpperCase()}</div>
        <div class="day-focus">${day.focus}</div>
      </div>

      <div class="progress-row">
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill" style="width:${pct}%"></div>
        </div>
        <span class="progress-label">${doneEx}/${totalEx} EX</span>
      </div>

      <div class="groups-grid">
        ${groupsHtml}
      </div>

      <div class="cardio-banner">
        <div class="cardio-icon">🏃</div>
        <div>
          <div class="cardio-label">Cardio Diário</div>
          <div class="cardio-desc">${cardioLabel}</div>
        </div>
        <div class="cardio-right">
          <div class="cardio-time">${day.cardioMin}<span style="font-size:14px;color:var(--gray)"> MIN</span></div>
          <button class="timer-btn" onclick="startTimer(${day.cardioMin})">▶ INICIAR</button>
        </div>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════
//  INTERACTIONS
// ══════════════════════════════════════
function selectDay(i) {
  currentDay = i;
  render();
}

function toggleEx(dayKey, gi, ei) {
  const key = `${dayKey}_${gi}_${ei}`;
  checkState[key] = !checkState[key];
  // Update item class without full re-render
  const item = document.getElementById(`item_${key}`);
  if (item) item.classList.toggle('done', checkState[key]);
  // Update progress bar
  const day = DAYS.find(d => d.key === dayKey);
  const totalEx = day.groups.reduce((acc, g) => acc + g.exercises.length, 0);
  const doneEx  = day.groups.reduce((acc, g, gIdx) =>
    acc + g.exercises.filter((_, eIdx) => checkState[`${dayKey}_${gIdx}_${eIdx}`]).length, 0);
  const pct = totalEx ? Math.round((doneEx / totalEx) * 100) : 0;
  const fill = document.getElementById('progressFill');
  const label = fill?.parentElement?.nextElementSibling;
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `${doneEx}/${totalEx} EX`;
}

// ══════════════════════════════════════
//  TIMER
// ══════════════════════════════════════
function startTimer(minutes) {
  clearInterval(timerInterval);
  timerSeconds = minutes * 60;
  timerRunning = true;
  updateTimerDisplay();
  document.getElementById('timerMode').textContent = `CARDIO — ${minutes} MIN`;
  document.getElementById('timerOverlay').classList.add('open');
  timerInterval = setInterval(tick, 1000);
}

function tick() {
  if (!timerRunning) return;
  timerSeconds--;
  updateTimerDisplay();
  if (timerSeconds <= 0) {
    clearInterval(timerInterval);
    document.getElementById('timerDisplay').textContent = 'FIM!';
    document.getElementById('timerDisplay').classList.add('warning');
  }
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60).toString().padStart(2,'0');
  const s = (timerSeconds % 60).toString().padStart(2,'0');
  const disp = document.getElementById('timerDisplay');
  disp.textContent = `${m}:${s}`;
  disp.classList.toggle('warning', timerSeconds <= 60 && timerSeconds > 0);
}

document.getElementById('btnPause').addEventListener('click', () => {
  timerRunning = !timerRunning;
  document.getElementById('btnPause').textContent = timerRunning ? 'PAUSAR' : 'RETOMAR';
});

document.getElementById('btnCloseTimer').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('timerOverlay').classList.remove('open');
  document.getElementById('timerDisplay').classList.remove('warning');
});

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
render();

document.getElementById('weekBar').addEventListener('click', (event) => {
  const dot = event.target.closest('.week-dot');
  if (!dot || dot.classList.contains('rest-day')) return;
  const index = Number(dot.dataset.dayIndex);
  if (!Number.isNaN(index)) selectDay(index);
});
