import { QUESTIONS } from "./questions.js";
import { TASKS } from "./tasks.js";

const LS_KEY = "aiinfolab_profile_v1";

export function loadProfile(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{ return null; }
}

export function saveProfile(p){
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}

export function computeLevel(percent){
  if (percent <= 49) return { key:"basic", name:"Базалық", note:"Негізді бекіту" };
  if (percent <= 74) return { key:"mid", name:"Орта", note:"Талдау және тұрақтандыру" };
  return { key:"advanced", name:"Жоғары", note:"Күрделі есептер" };
}

export function mountNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".chip").forEach(a=>{
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
}

// ---------- TEST PAGE ----------
export function mountTest(){
  const wrap = document.getElementById("questions");
  if (!wrap) return;

  // Render questions
  wrap.innerHTML = QUESTIONS.map((qq, idx)=>`
    <div class="q" data-qid="${qq.id}">
      <p class="q-title">${idx+1}) ${qq.q} <span class="muted">(${qq.topic})</span></p>
      <div class="options">
        ${qq.options.map((opt, i)=>`
          <label class="opt">
            <input type="radio" name="q_${qq.id}" value="${i}">
            <span>${opt}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `).join("");

  document.getElementById("submitTest").addEventListener("click", ()=>{
    const answers = [];
    let correct = 0;

    for (const qq of QUESTIONS){
      const picked = document.querySelector(`input[name="q_${qq.id}"]:checked`);
      const val = picked ? Number(picked.value) : null;
      answers.push({ id: qq.id, picked: val, answer: qq.answer, topic: qq.topic });

      if (val === qq.answer) correct++;
    }

    const total = QUESTIONS.length;
    const percent = Math.round((correct / total) * 100);
    const level = computeLevel(percent);

    // weak topics
    const wrong = answers.filter(a => a.picked !== a.answer);
    const weak = {};
    for (const w of wrong){
      weak[w.topic] = (weak[w.topic] || 0) + 1;
    }
    const weakList = Object.entries(weak)
      .sort((a,b)=>b[1]-a[1])
      .map(([topic, cnt])=> `${topic} (${cnt})`);

    const profile = {
      updatedAt: new Date().toISOString(),
      total,
      correct,
      percent,
      levelKey: level.key,
      levelName: level.name,
      weakTopics: weakList,
      answers
    };

    saveProfile(profile);
    location.href = "results.html";
  });

  document.getElementById("resetTest").addEventListener("click", ()=>{
    if (confirm("Жауаптарды тазалаймыз ба?")){
      document.querySelectorAll("input[type=radio]").forEach(i=> i.checked = false);
    }
  });
}

// ---------- RESULTS PAGE ----------
export function mountResults(){
  const out = document.getElementById("resultsBox");
  if (!out) return;

  const p = loadProfile();
  if (!p){
    out.innerHTML = `<p class="muted">Нәтиже табылмады. Алдымен диагностикадан өтіңіз.</p>
    <div class="actions"><a class="btn primary" href="test.html">Диагностикаға өту</a></div>`;
    return;
  }

  const level = computeLevel(p.percent);

  out.innerHTML = `
    <div class="kpi">
      <div class="pill"><b>Дұрыс:</b> ${p.correct}/${p.total}</div>
      <div class="pill"><b>Нәтиже:</b> ${p.percent}%</div>
      <div class="pill"><b>Деңгей:</b> ${level.name}</div>
      <div class="pill"><b>Ұсыныс:</b> ${level.note}</div>
    </div>
    <hr class="sep">
    <p class="muted"><b>Әлсіз тақырыптар:</b> ${p.weakTopics.length ? p.weakTopics.join(", ") : "Анықталмады (барлығы дұрыс немесе өте аз қате)."}</p>
    <div class="actions">
      <a class="btn success" href="tasks.html">Менің практикалық тапсырмаларым</a>
      <a class="btn" href="test.html">Тестті қайта тапсыру</a>
    </div>
  `;

  const small = document.getElementById("miniInfo");
  if (small){
    small.textContent = `Соңғы жаңарту: ${new Date(p.updatedAt).toLocaleString()}`;
  }
}

// ---------- TASKS PAGE ----------
function runUserSolve(code, args){
  // Expect user code defines function solve(...)
  // We'll evaluate in a safe-ish wrapper (still client-side, so user runs own code)
  const wrapped = `"use strict";\n${code}\nreturn solve;`;
  const fnFactory = new Function(wrapped);
  const solve = fnFactory();
  if (typeof solve !== "function") throw new Error("solve функциясы табылмады.");
  // args may be single or array
  if (Array.isArray(args)) return solve(...args);
  return solve(args);
}

function deepEqual(a,b){
  return JSON.stringify(a) === JSON.stringify(b);
}

export function mountTasks(){
  const wrap = document.getElementById("tasksBox");
  if (!wrap) return;

  const p = loadProfile();
  if (!p){
    wrap.innerHTML = `<p class="muted">Алдымен диагностикадан өтіңіз. Тест нәтижесіне сай тапсырмалар беріледі.</p>
      <div class="actions"><a class="btn primary" href="test.html">Диагностикаға өту</a></div>`;
    return;
  }

  const level = computeLevel(p.percent);
  const list = TASKS[level.key];

  document.getElementById("levelLine").innerHTML =
    `Сіздің деңгейіңіз: <b>${level.name}</b> (${p.percent}%). Төмендегі тапсырмалар осы нәтижеге сай берілді.`;

  wrap.innerHTML = list.map(t=>`
    <div class="q" data-tid="${t.id}">
      <p class="q-title">${t.title}</p>
      <p class="muted">${t.statement}</p>
      <details>
        <summary class="muted">Кеңес (hint)</summary>
        <p class="muted">${t.hint}</p>
      </details>
      <hr class="sep">
      <label class="muted">Код (JavaScript):</label>
      <textarea class="codebox" id="code_${t.id}">${t.starter}</textarea>
      <div class="actions">
        <button class="btn success" data-run="${t.id}">Тексеру</button>
        <button class="btn" data-fill="${t.id}">Бастапқы код</button>
      </div>
      <div class="out" id="out_${t.id}">Нәтиже осында шығады…</div>
    </div>
  `).join("");

  wrap.addEventListener("click", (e)=>{
    const runId = e.target?.getAttribute?.("data-run");
    const fillId = e.target?.getAttribute?.("data-fill");

    if (fillId){
      const t = list.find(x=>x.id===fillId);
      document.getElementById(`code_${fillId}`).value = t.starter;
      document.getElementById(`out_${fillId}`).textContent = "Бастапқы код қойылды.";
      return;
    }

    if (runId){
      const t = list.find(x=>x.id===runId);
      const code = document.getElementById(`code_${runId}`).value;
      const outEl = document.getElementById(`out_${runId}`);

      try{
        const results = [];
        for (const tc of t.tests){
          const got = runUserSolve(code, tc.input);
          const ok = deepEqual(got, tc.output);
          results.push({ input: tc.input, expected: tc.output, got, ok });
        }

        const allOk = results.every(r=>r.ok);
        outEl.textContent =
          (allOk ? "✅ Барлық тест өтті!\n\n" : "❌ Кейбір тест өтпеді.\n\n") +
          results.map((r,i)=>(
            `#${i+1}\nКіріс: ${JSON.stringify(r.input)}\nКүтілетін: ${JSON.stringify(r.expected)}\nАлынған: ${JSON.stringify(r.got)}\nНәтиже: ${r.ok ? "OK" : "FAIL"}\n`
          )).join("\n");
      }catch(err){
        outEl.textContent = `Қате: ${err.message}`;
      }
    }
  });
}

// ---------- ASSISTANT (modal, rule-based + optional iframe) ----------
export function mountAssistant(){
  const fab = document.getElementById("fab");
  const modal = document.getElementById("modal");
  if (!fab || !modal) return;

  const closeBtn = document.getElementById("closeModal");
  const saveEmbedBtn = document.getElementById("saveEmbed");
  const embedInput = document.getElementById("embedUrl");
  const iframe = document.getElementById("embedFrame");
  const chatOut = document.getElementById("chatOut");
  const chatIn = document.getElementById("chatIn");
  const askBtn = document.getElementById("askBtn");

  const EMBED_KEY = "aiinfolab_embed_url_v1";
  const getEmbed = ()=> localStorage.getItem(EMBED_KEY) || "";
  const setEmbed = (v)=> localStorage.setItem(EMBED_KEY, v);

  const applyEmbed = ()=>{
    const url = getEmbed().trim();
    if (url){
      iframe.src = url;
      iframe.style.display = "block";
    }else{
      iframe.removeAttribute("src");
      iframe.style.display = "none";
    }
    embedInput.value = url;
  };

  const reply = (text)=>{
    const prev = chatOut.textContent;
    chatOut.textContent = (prev ? prev + "\n\n" : "") + text;
  };

  const bot = (msg)=>{
    const m = msg.toLowerCase();

    // Quick help based on typical needs
    if (m.includes("қате") || m.includes("error")){
      return "Қате талдау: 1) Қате мәтінін оқыңыз 2) Қай жолда екенін табыңыз 3) Синтаксис пе, логика ма екенін ажыратыңыз 4) Бір-екі тестпен тексеріңіз.";
    }
    if (m.includes("цикл") || m.includes("for") || m.includes("while")){
      return "Цикл: бір әрекетті көп рет қайталау. for — санауышпен, while — шарт ақиқат болғанша. Әр қадамда айнымалы өзгеріп тұруы керек.";
    }
    if (m.includes("шарт") || m.includes("if")){
      return "Шартты оператор: if (шарт) { ... } else { ... }. Бірнеше жағдай болса else if қолданасыз.";
    }
    if (m.includes("массив") || m.includes("list") || m.includes("array")){
      return "Массив/тізім: бірнеше мәнді бір жерде сақтау. Негізгі әрекеттер: ұзындығы (length), өту (for/of), қосу (push), алу (arr[i]).";
    }
    if (m.includes("деңгей") || m.includes("нәтиже")){
      const p = loadProfile();
      if (!p) return "Алдымен Диагностикадан өтіңіз. Сонда деңгейіңіз шығып, тапсырмалар автоматты беріледі.";
      return `Сіздің соңғы нәтижеңіз: ${p.percent}%. Деңгей: ${computeLevel(p.percent).name}. "Практика" бетіне өтіңіз.`;
    }
    return "Сұрағыңызды нақтылаңыз: қай тақырып? (шарт, цикл, массив, функция, қате талдау). Қаласаңыз, мысал код жіберіңіз — талдап берем.";
  };

  fab.addEventListener("click", ()=>{
    modal.classList.add("open");
    applyEmbed();
  });
  closeBtn.addEventListener("click", ()=> modal.classList.remove("open"));
  modal.addEventListener("click", (e)=>{
    if (e.target === modal) modal.classList.remove("open");
  });

  saveEmbedBtn.addEventListener("click", ()=>{
    setEmbed(embedInput.value.trim());
    applyEmbed();
    alert("Embed URL сақталды. Егер чатбот берілген болса, төменде ашылады.");
  });

  askBtn.addEventListener("click", ()=>{
    const msg = chatIn.value.trim();
    if (!msg) return;
    reply(`👤 Сіз: ${msg}\n🤖 AI-ассистент: ${bot(msg)}`);
    chatIn.value = "";
  });

  applyEmbed();
}
