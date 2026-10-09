/**
 * 會計科段考練習系統 - 核心邏輯 (手機響應式優化版)
 * 包含：段考真題練習、借貸法則特訓、複式簿記分錄工作台 (有借必有貸，有貸必有借，借貸金額必相等)
 */

// ==========================================
// 音效合成模組 (Web Audio API - 零外部檔案依賴)
// ==========================================
class SoundFX {
  constructor() {
    this.muted = localStorage.getItem("accounting_muted") === "true";
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("accounting_muted", this.muted);
    return this.muted;
  }

  playTone(freq, duration, type = "sine", gain = 0.1) {
    if (this.muted) return;
    try {
      this.init();
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playCorrect() {
    this.playTone(523.25, 0.1, "sine", 0.12); // C5
    setTimeout(() => this.playTone(659.25, 0.15, "sine", 0.12), 80); // E5
    setTimeout(() => this.playTone(783.99, 0.25, "sine", 0.15), 160); // G5
  }

  playWrong() {
    this.playTone(330, 0.12, "triangle", 0.15);
    setTimeout(() => this.playTone(260, 0.2, "triangle", 0.18), 90);
  }

  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.25, "sine", 0.15), idx * 120);
    });
  }
}

const sfx = new SoundFX();

// ==========================================
// 應用程式狀態管理
// ==========================================
const AppState = {
  activeTab: "exam",
  examMode: "practice", // 'practice' (逐題即時解析) 或 'test' (模擬考交卷計分)
  filterCategory: "all", // 'all', 'tf', 'choice', 'mistakes'
  userAnswers: {}, // { qId: selectedOption }
  submitted: false,
  timerSeconds: 0,
  timerInterval: null,
  timerRunning: false,
  wrongQuestionIds: new Set(JSON.parse(localStorage.getItem("accounting_mistakes") || "[]")),

  // 借貸特訓狀態
  drillIndex: 0,
  drillScore: 0,
  drillCombo: 0,
  drillMaxCombo: 0,

  // 分錄練習狀態
  journalIndex: 0,
  journalScore: 0
};

// ==========================================
// 初始化與事件綁定
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTabs();
  renderExamQuestions();
  updateExamSidebar();
  initDrill();
  initJournalWorkbench();
  bindGlobalEvents();
});

// 主題切換
function initTheme() {
  const savedTheme = localStorage.getItem("accounting_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  document.getElementById("btn-theme-toggle")?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("accounting_theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // 音效切換
  const soundBtn = document.getElementById("btn-sound-toggle");
  updateSoundIcon(sfx.muted);
  soundBtn?.addEventListener("click", () => {
    const isMuted = sfx.toggleMute();
    updateSoundIcon(isMuted);
  });
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("btn-theme-toggle");
  if (btn) btn.innerHTML = theme === "light" ? "🌙" : "☀️";
}

function updateSoundIcon(isMuted) {
  const btn = document.getElementById("btn-sound-toggle");
  if (btn) btn.innerHTML = isMuted ? "🔇" : "🔔";
}

// 標籤頁切換
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  AppState.activeTab = tabId;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `tab-${tabId}`);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 模組一：段考真題練習
// ==========================================
function renderExamQuestions() {
  const container = document.getElementById("exam-questions-list");
  if (!container) return;

  const questions = getFilteredExamQuestions();

  if (questions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">目前沒有錯題！</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">你在作答中表現完美，可以切換至「全部題目」複習或挑戰全真模擬考！</p>
      </div>
    `;
    return;
  }

  container.innerHTML = questions.map(q => createQuestionHTML(q)).join("");

  // 綁定選項點擊事件
  container.querySelectorAll(".option-item").forEach(optEl => {
    optEl.addEventListener("click", () => {
      const qCard = optEl.closest(".question-card");
      const qId = parseInt(qCard.dataset.qid);
      const chosen = optEl.dataset.value;
      handleOptionSelect(qId, chosen);
    });
  });
}

function getFilteredExamQuestions() {
  return QUIZ_DATA.examQuestions.filter(q => {
    if (AppState.filterCategory === "mistakes") {
      return AppState.wrongQuestionIds.has(q.id);
    }
    if (AppState.filterCategory === "tf") return q.type === "tf";
    if (AppState.filterCategory === "choice") return q.type === "choice";
    return true;
  });
}

function createQuestionHTML(q) {
  const userAns = AppState.userAnswers[q.id];
  const isPractice = AppState.examMode === "practice";
  const isSubmitted = AppState.submitted;
  const showFeedback = isPractice ? !!userAns : isSubmitted;

  let cardClass = "question-card";
  if (showFeedback && userAns) {
    if (userAns === q.answer) {
      cardClass += " answered-correct";
    } else {
      cardClass += " answered-wrong";
    }
  }

  // 選項列表
  const optionsHTML = q.type === "tf"
    ? `
      <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="option-item ${getOptionStatusClass(q, "O", userAns, showFeedback)}" data-value="O">
          <div class="opt-indicator">○</div>
          <span>O (正確)</span>
        </div>
        <div class="option-item ${getOptionStatusClass(q, "X", userAns, showFeedback)}" data-value="X">
          <div class="opt-indicator">✕</div>
          <span>X (錯誤)</span>
        </div>
      </div>
    `
    : `
      <div class="options-grid">
        ${q.options.map(opt => {
          const optLetter = opt.trim().charAt(0); // 'A', 'B', 'C', 'D'
          return `
            <div class="option-item ${getOptionStatusClass(q, optLetter, userAns, showFeedback)}" data-value="${optLetter}">
              <div class="opt-indicator">${optLetter}</div>
              <span>${escapeHTML(opt)}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;

  return `
    <div class="${cardClass}" id="q-card-${q.id}" data-qid="${q.id}">
      <div class="q-header">
        <div class="q-badge ${q.type === 'tf' ? 'tf' : ''}">
          <span>第 ${q.number} 題</span> • <span>${q.category}</span>
        </div>
        <div class="q-meta">
          ${q.tags.map(t => `<span class="q-tag">#${t}</span>`).join("")}
        </div>
      </div>
      <div class="q-title">${escapeHTML(q.question)}</div>
      ${optionsHTML}
      <div class="explanation-box ${showFeedback ? 'show' : ''}">
        <div class="exp-header">
          <span class="exp-correct">標準答案：【${q.answer}】</span>
          ${showFeedback && userAns ? (userAns === q.answer ? '<span style="color:var(--color-success)">✓ 答對了！</span>' : '<span style="color:var(--color-error)">✕ 答錯了</span>') : ''}
        </div>
        <div class="exp-text">${escapeHTML(q.explanation).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  `;
}

function getOptionStatusClass(q, optVal, userAns, showFeedback) {
  let classes = [];
  if (userAns === optVal) {
    classes.push("selected");
  }
  if (showFeedback) {
    if (optVal === q.answer) {
      classes.push("correct");
    } else if (userAns === optVal && userAns !== q.answer) {
      classes.push("wrong");
    }
  }
  return classes.join(" ");
}

function handleOptionSelect(qId, chosen) {
  if (AppState.examMode === "test" && AppState.submitted) {
    return; // 模擬測驗已交卷，鎖定答案
  }

  const q = QUIZ_DATA.examQuestions.find(item => item.id === qId);
  if (!q) return;

  AppState.userAnswers[qId] = chosen;

  // 練習模式即時音效與錯題紀錄
  if (AppState.examMode === "practice") {
    if (chosen === q.answer) {
      sfx.playCorrect();
      AppState.wrongQuestionIds.delete(qId);
    } else {
      sfx.playWrong();
      AppState.wrongQuestionIds.add(qId);
    }
    localStorage.setItem("accounting_mistakes", JSON.stringify([...AppState.wrongQuestionIds]));
  }

  // 刷新當前卡片與側邊導航
  renderExamQuestions();
  updateExamSidebar();
}

function updateExamSidebar() {
  const total = QUIZ_DATA.examQuestions.length;
  const answeredCount = Object.keys(AppState.userAnswers).length;
  const percentage = Math.round((answeredCount / total) * 100);

  // 進度條
  const fillEl = document.getElementById("exam-progress-fill");
  const countEl = document.getElementById("answered-count-text");
  if (fillEl) fillEl.style.width = `${percentage}%`;
  if (countEl) countEl.innerText = `${answeredCount} / ${total} 題 (${percentage}%)`;

  // 快速跳題九宮格
  const gridEl = document.getElementById("exam-quick-grid");
  if (gridEl) {
    gridEl.innerHTML = QUIZ_DATA.examQuestions.map(q => {
      const userAns = AppState.userAnswers[q.id];
      const showFeedback = AppState.examMode === "practice" ? !!userAns : AppState.submitted;
      let stateClass = "";
      if (userAns) {
        stateClass = "answered";
        if (showFeedback) {
          stateClass = userAns === q.answer ? "correct" : "wrong";
        }
      }
      return `
        <div class="q-grid-item ${stateClass}" onclick="scrollToQuestion(${q.id})" title="第 ${q.number} 題">
          ${q.number}
        </div>
      `;
    }).join("");
  }

  // 錯題計數
  const mistakeBadge = document.getElementById("mistake-count-badge");
  if (mistakeBadge) {
    mistakeBadge.innerText = AppState.wrongQuestionIds.size;
  }
}

function scrollToQuestion(qId) {
  const card = document.getElementById(`q-card-${qId}`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("pulse-anim");
    setTimeout(() => card.classList.remove("pulse-anim"), 1500);
  }
}

// 模擬測驗計時器
function startExamTimer() {
  if (AppState.timerRunning) return;
  AppState.timerRunning = true;
  AppState.timerSeconds = 40 * 60; // 40分鐘
  updateTimerDisplay();

  AppState.timerInterval = setInterval(() => {
    AppState.timerSeconds--;
    if (AppState.timerSeconds <= 0) {
      clearInterval(AppState.timerInterval);
      AppState.timerRunning = false;
      alert("考試時間結束！系統將自動交卷計分。");
      submitExam();
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("exam-timer-digits");
  if (!el) return;
  const m = Math.floor(AppState.timerSeconds / 60).toString().padStart(2, "0");
  const s = (AppState.timerSeconds % 60).toString().padStart(2, "0");
  el.innerText = `${m}:${s}`;
}

function submitExam() {
  AppState.submitted = true;
  if (AppState.timerInterval) clearInterval(AppState.timerInterval);
  AppState.timerRunning = false;

  // 計算分數 (全25題，每題4分，滿分100)
  let correctCount = 0;
  QUIZ_DATA.examQuestions.forEach(q => {
    const userAns = AppState.userAnswers[q.id];
    if (userAns === q.answer) {
      correctCount++;
      AppState.wrongQuestionIds.delete(q.id);
    } else {
      AppState.wrongQuestionIds.add(q.id);
    }
  });

  localStorage.setItem("accounting_mistakes", JSON.stringify([...AppState.wrongQuestionIds]));

  const score = correctCount * 4;
  sfx.playFanfare();

  // 顯示成績彈窗
  showScoreModal(score, correctCount, QUIZ_DATA.examQuestions.length);

  // 重新渲染顯示解析
  renderExamQuestions();
  updateExamSidebar();
}

function showScoreModal(score, correctCount, totalCount) {
  const modal = document.getElementById("score-modal");
  if (!modal) return;

  document.getElementById("modal-score-value").innerText = `${score} 分`;
  document.getElementById("modal-correct-detail").innerText = `答對 ${correctCount} 題 / 共 ${totalCount} 題 (答對率 ${Math.round((correctCount/totalCount)*100)}%)`;

  let evalText = "";
  if (score === 100) evalText = "🏆 滿分大滿貫！你已完全精通高職會計學段考核心重點！";
  else if (score >= 80) evalText = "🌟 優秀！觀念相當紮實，僅有少數易混淆觀念需注意！";
  else if (score >= 60) evalText = "👍 及格過關！建議針對錯題與「借貸法則」加強複習！";
  else evalText = "💪 還有進步空間！快到「必考手冊」與「複式簿記」特訓專區補強！";

  document.getElementById("modal-evaluation-text").innerText = evalText;
  modal.classList.add("active");
}

function resetExam() {
  AppState.userAnswers = {};
  AppState.submitted = false;
  if (AppState.timerInterval) clearInterval(AppState.timerInterval);
  AppState.timerRunning = false;
  AppState.timerSeconds = 0;
  document.getElementById("exam-timer-digits").innerText = "40:00";
  renderExamQuestions();
  updateExamSidebar();
}

// ==========================================
// 模組二：借貸法則特訓專區 (Drill Mode)
// ==========================================
function initDrill() {
  renderDrillQuestion();
  renderElementsEquation();

  document.getElementById("btn-drill-debit")?.addEventListener("click", () => handleDrillAnswer("借"));
  document.getElementById("btn-drill-credit")?.addEventListener("click", () => handleDrillAnswer("貸"));
  document.getElementById("btn-drill-next")?.addEventListener("click", () => {
    AppState.drillIndex = (AppState.drillIndex + 1) % QUIZ_DATA.debitCreditDrills.length;
    renderDrillQuestion();
  });
}

function renderDrillQuestion() {
  const drill = QUIZ_DATA.debitCreditDrills[AppState.drillIndex];
  if (!drill) return;

  document.getElementById("drill-current-num").innerText = `${AppState.drillIndex + 1} / ${QUIZ_DATA.debitCreditDrills.length}`;
  document.getElementById("drill-item-title").innerText = drill.item;

  const actionTag = document.getElementById("drill-action-badge");
  actionTag.innerText = `【${drill.change}】`;
  actionTag.className = `drill-action-tag ${drill.change.includes("增加") ? 'tag-increase' : 'tag-decrease'}`;

  document.getElementById("drill-element-type").innerText = `要素歸屬：${drill.element}`;
  document.getElementById("drill-feedback-box").style.display = "none";
  document.getElementById("drill-buttons-group").style.display = "grid";
  document.getElementById("btn-drill-next").style.display = "none";
}

function handleDrillAnswer(chosen) {
  const drill = QUIZ_DATA.debitCreditDrills[AppState.drillIndex];
  const isCorrect = chosen === drill.answer;
  const feedbackBox = document.getElementById("drill-feedback-box");

  if (isCorrect) {
    sfx.playCorrect();
    AppState.drillScore += 10;
    AppState.drillCombo++;
    if (AppState.drillCombo > AppState.drillMaxCombo) AppState.drillMaxCombo = AppState.drillCombo;
    feedbackBox.innerHTML = `
      <div style="color: var(--color-success); font-weight: 700; font-size: 1.05rem; margin-bottom: 4px;">
        ✓ 完全正確！應記【${drill.answer}方】
      </div>
      <div style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">${escapeHTML(drill.explanation)}</div>
    `;
  } else {
    sfx.playWrong();
    AppState.drillCombo = 0;
    feedbackBox.innerHTML = `
      <div style="color: var(--color-error); font-weight: 700; font-size: 1.05rem; margin-bottom: 4px;">
        ✕ 答錯囉！正確應記【${drill.answer}方】
      </div>
      <div style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">${escapeHTML(drill.explanation)}</div>
    `;
  }

  document.getElementById("drill-combo-val").innerText = `${AppState.drillCombo} 連擊 🔥`;
  document.getElementById("drill-score-val").innerText = `${AppState.drillScore} 分`;

  feedbackBox.style.display = "block";
  document.getElementById("drill-buttons-group").style.display = "none";
  document.getElementById("btn-drill-next").style.display = "inline-flex";
}

function renderElementsEquation() {
  const grid = document.getElementById("elements-cards-grid");
  if (!grid) return;

  const elementsData = [
    { name: "資產 (Assets)", type: "elem-asset", badge: "實帳戶", debit: "+ 增加", credit: "- 減少", desc: "現金、存貨、應收帳款、設備" },
    { name: "負債 (Liabilities)", type: "elem-liability", badge: "實帳戶", debit: "- 減少", credit: "+ 增加", desc: "應付帳款、短期借款、應付票據" },
    { name: "權益 (Equity)", type: "elem-equity", badge: "實帳戶", debit: "- 減少", credit: "+ 增加", desc: "業主資本、資本公積、保留盈餘" },
    { name: "收益 (Revenues)", type: "elem-revenue", badge: "虛帳戶", debit: "- 減少", credit: "+ 增加", desc: "銷貨收入、利息收入、租金收入" },
    { name: "費損 (Expenses)", type: "elem-expense", badge: "虛帳戶", debit: "+ 增加", credit: "- 減少", desc: "薪資支出、租金支出、折舊費用" }
  ];

  grid.innerHTML = elementsData.map(e => `
    <div class="element-card ${e.type}">
      <span class="elem-badge">${e.badge}</span>
      <h4 style="font-weight: 800; font-size: 0.95rem; margin-bottom: 3px;">${e.name}</h4>
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">${e.desc}</p>
      <div class="elem-rules">
        <div class="rule-col">
          <div class="dir">借方 (Dr.)</div>
          <div class="sign ${e.debit.includes('+') ? 'plus' : 'minus'}">${e.debit}</div>
        </div>
        <div class="rule-col">
          <div class="dir">貸方 (Cr.)</div>
          <div class="sign ${e.credit.includes('+') ? 'plus' : 'minus'}">${e.credit}</div>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================
// 模組三：複式簿記實戰分錄 (Journalizing Workbench)
// 核心鐵律：有借必有貸，有貸必有借，借貸金額必相等
// ==========================================
function initJournalWorkbench() {
  populateAccountSelects();
  renderJournalScenario();
  renderNineTypesGrid();

  document.getElementById("btn-check-journal")?.addEventListener("click", checkJournalEntry);
  document.getElementById("btn-next-journal")?.addEventListener("click", () => {
    AppState.journalIndex = (AppState.journalIndex + 1) % QUIZ_DATA.journalDrills.length;
    renderJournalScenario();
  });
}

function populateAccountSelects() {
  const accounts = [
    "-- 請選擇會計項目 --",
    "現金", "銀行存款", "應收帳款", "應收票據", "存貨", "文具用品", "辦公設備",
    "應付帳款", "應付票據", "銀行借款", "預收貨款",
    "業主資本", "業主往來",
    "銷貨收入", "利息收入",
    "進貨", "薪資支出", "租金支出", "文具用品耗用"
  ];

  const debitSelect = document.getElementById("journal-debit-account");
  const creditSelect = document.getElementById("journal-credit-account");

  if (!debitSelect || !creditSelect) return;

  const optionsHTML = accounts.map(acc => `<option value="${acc}">${acc}</option>`).join("");
  debitSelect.innerHTML = optionsHTML;
  creditSelect.innerHTML = optionsHTML;

  // 即時更新 T 字帳動畫
  debitSelect.addEventListener("change", updateLiveTAccounts);
  creditSelect.addEventListener("change", updateLiveTAccounts);
  document.getElementById("journal-debit-amount")?.addEventListener("input", updateLiveTAccounts);
  document.getElementById("journal-credit-amount")?.addEventListener("input", updateLiveTAccounts);
}

function renderJournalScenario() {
  const item = QUIZ_DATA.journalDrills[AppState.journalIndex];
  if (!item) return;

  document.getElementById("journal-index-text").innerText = `第 ${AppState.journalIndex + 1} 題 / 共 ${QUIZ_DATA.journalDrills.length} 題`;
  document.getElementById("journal-scenario-text").innerText = item.scenario;

  // 重置表單
  document.getElementById("journal-debit-account").selectedIndex = 0;
  document.getElementById("journal-credit-account").selectedIndex = 0;
  document.getElementById("journal-debit-amount").value = "";
  document.getElementById("journal-credit-amount").value = "";

  document.getElementById("journal-feedback-box").style.display = "none";
  document.getElementById("btn-check-journal").style.display = "inline-flex";
  document.getElementById("btn-next-journal").style.display = "none";

  updateLiveTAccounts();
}

function updateLiveTAccounts() {
  const debAcc = document.getElementById("journal-debit-account")?.value || "借方項目";
  const creAcc = document.getElementById("journal-credit-account")?.value || "貸方項目";
  const debAmt = document.getElementById("journal-debit-amount")?.value || "0";
  const creAmt = document.getElementById("journal-credit-amount")?.value || "0";

  document.getElementById("t-account-debit-name").innerText = debAcc.startsWith("--") ? "借方項目" : debAcc;
  document.getElementById("t-account-credit-name").innerText = creAcc.startsWith("--") ? "貸方項目" : creAcc;

  document.getElementById("t-deb-val").innerText = debAmt ? `$${Number(debAmt).toLocaleString()}` : "$0";
  document.getElementById("t-cre-val").innerText = creAmt ? `$${Number(creAmt).toLocaleString()}` : "$0";
}

function checkJournalEntry() {
  const item = QUIZ_DATA.journalDrills[AppState.journalIndex];
  const userDebAcc = document.getElementById("journal-debit-account")?.value;
  const userCreAcc = document.getElementById("journal-credit-account")?.value;
  const userDebAmt = parseInt(document.getElementById("journal-debit-amount")?.value || "0");
  const userCreAmt = parseInt(document.getElementById("journal-credit-amount")?.value || "0");

  const feedbackBox = document.getElementById("journal-feedback-box");

  // 檢查是否漏填
  if (!userDebAcc || userDebAcc.startsWith("--") || !userCreAcc || userCreAcc.startsWith("--") || !userDebAmt || !userCreAmt) {
    alert("請完整選取借貸方會計項目並填寫金額！");
    return;
  }

  // 借貸必平衡檢查（融入核心鐵律）
  if (userDebAmt !== userCreAmt) {
    sfx.playWrong();
    feedbackBox.innerHTML = `
      <div style="color: var(--color-error); font-weight: 800; font-size: 1rem; margin-bottom: 6px;">
        ✕ 借貸不平衡！
      </div>
      <div style="color: var(--color-gold); font-weight: 800; font-size: 0.95rem; margin-bottom: 6px;">
        ⚖️ 複式簿記核心鐵律：「有借必有貸，有貸必有借，借貸金額必相等」！
      </div>
      <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">
        你所填寫的借方金額為 $${userDebAmt.toLocaleString()}，貸方金額為 $${userCreAmt.toLocaleString()}，兩者必須完全相等！
      </p>
    `;
    feedbackBox.style.display = "block";
    return;
  }

  const isDebAccCorrect = userDebAcc === item.debit.account;
  const isCreAccCorrect = userCreAcc === item.credit.account || (item.creditAccount && userCreAcc === item.creditAccount);
  const isAmtCorrect = userDebAmt === item.debit.amount;

  if (isDebAccCorrect && isCreAccCorrect && isAmtCorrect) {
    sfx.playCorrect();
    AppState.journalScore += 10;
    feedbackBox.innerHTML = `
      <div style="color: var(--color-success); font-weight: 800; font-size: 1.05rem; margin-bottom: 6px;">
        ✓ 分錄完全正確！完美體現「有借必有貸，有貸必有借，借貸金額必相等」！
      </div>
      <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--color-success); font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6;">
        ${escapeHTML(item.explanation).replace(/\n/g, '<br>')}
      </div>
    `;
  } else {
    sfx.playWrong();
    feedbackBox.innerHTML = `
      <div style="color: var(--color-error); font-weight: 800; font-size: 1.05rem; margin-bottom: 6px;">
        ✕ 分錄項目有誤，請參考正確分錄：
      </div>
      <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--color-error); font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6;">
        ${escapeHTML(item.explanation).replace(/\n/g, '<br>')}
      </div>
    `;
  }

  feedbackBox.style.display = "block";
  document.getElementById("btn-check-journal").style.display = "none";
  document.getElementById("btn-next-journal").style.display = "inline-flex";
}

function renderNineTypesGrid() {
  const container = document.getElementById("nine-types-grid");
  if (!container) return;

  container.innerHTML = QUIZ_DATA.nineTransactionTypes.map(t => `
    <div class="type-card">
      <div class="type-title">
        <span>⚖️</span>
        <span>${t.title}</span>
      </div>
      <div class="type-moves" style="color: var(--text-main);">
        <span style="color: #60a5fa;">借：${t.debit}</span> ➔ <span style="color: #f472b6;">貸：${t.credit}</span>
      </div>
      <div class="type-ex">例：${escapeHTML(t.example)}</div>
    </div>
  `).join("");
}

// ==========================================
// 全域事件與過濾篩選
// ==========================================
function bindGlobalEvents() {
  // 模式切換 (練習 vs 模擬考)
  document.querySelectorAll("[data-exam-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-exam-mode]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.examMode = btn.dataset.examMode;

      const timerBlock = document.getElementById("sidebar-timer-block");
      const submitBtn = document.getElementById("btn-submit-exam");

      if (AppState.examMode === "test") {
        if (timerBlock) timerBlock.style.display = "block";
        if (submitBtn) submitBtn.style.display = "inline-flex";
        startExamTimer();
      } else {
        if (timerBlock) timerBlock.style.display = "none";
        if (submitBtn) submitBtn.style.display = "none";
        if (AppState.timerInterval) clearInterval(AppState.timerInterval);
        AppState.timerRunning = false;
      }

      renderExamQuestions();
      updateExamSidebar();
    });
  });

  // 篩選標籤 (全部 / 是非 / 選擇 / 錯題)
  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.filterCategory = btn.dataset.filter;
      renderExamQuestions();
    });
  });

  // 手機版折疊題號速查按鈕
  document.getElementById("btn-toggle-grid")?.addEventListener("click", () => {
    const grid = document.getElementById("exam-quick-grid");
    const toggleBtn = document.getElementById("btn-toggle-grid");
    if (!grid || !toggleBtn) return;
    if (grid.classList.contains("collapsed")) {
      grid.classList.remove("collapsed");
      toggleBtn.innerText = "收合 ▴";
    } else {
      grid.classList.add("collapsed");
      toggleBtn.innerText = "展開 ▾";
    }
  });

  // 交卷與重置
  document.getElementById("btn-submit-exam")?.addEventListener("click", submitExam);
  document.getElementById("btn-reset-exam")?.addEventListener("click", () => {
    if (confirm("確定要重設目前的作答記錄嗎？")) {
      resetExam();
    }
  });

  // 成績單關閉按鈕
  document.getElementById("btn-close-score")?.addEventListener("click", () => {
    document.getElementById("score-modal")?.classList.remove("active");
  });
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
