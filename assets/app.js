import { QUESTIONS } from "./questions.js";
import { TASKS } from "./tasks.js";

const LS_KEY = "aiinfolab_profile_v3";

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
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* ---------- TEST ---------- */
export function mountTest(){
  const wrap = document.getElementById("questions");
  if (!wrap) return;

  wrap.innerHTML = QUESTIONS.map((qq, idx)=>`
    <div class="q">
      <p class="q-title">${idx+1}) ${qq.q} <span class="muted">(${qq.topic})</span></p>
      <div class="options">
        ${qq.options.map((opt,i)=>`
          <label class="opt">
            <input type="radio" name="q_${qq.id}" value="${i}">
            <span>${opt}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `).join("");

  document.getElementById("submitTest").addEventListener("click", ()=>{
    const g = document.querySelector('input[name="grade"]:checked');
    if (!g){ alert("8 немесе 9 сыныпты таңдаңыз."); return; }
    const grade = Number(g.value);

    let correct=0;
    const answers=[];
    for (const qq of QUESTIONS){
      const picked = document.querySelector(`input[name="q_${qq.id}"]:checked`);
      const val = picked ? Number(picked.value) : null;
      answers.push({ id:qq.id, picked:val, answer:qq.answer, topic:qq.topic });
      if (val === qq.answer) correct++;
    }

    const total = QUESTIONS.length;
    const percent = Math.round((correct/total)*100);
    const level = computeLevel(percent);

    const wrong = answers.filter(a => a.picked !== a.answer);
    const weak = {};
    for (const w of wrong) weak[w.topic]=(weak[w.topic]||0)+1;
    const weakList = Object.entries(weak).sort((a,b)=>b[1]-a[1]).map(([t,c])=>`${t} (${c})`);

    saveProfile({
      updatedAt: new Date().toISOString(),
      grade,
      total, correct, percent,
      levelKey: level.key,
      levelName: level.name,
      weakTopics: weakList,
      answers
    });

    location.href="results.html";
  });

  document.getElementById("resetTest").addEventListener("click", ()=>{
    if (confirm("Жауаптарды тазалаймыз ба?")){
      document.querySelectorAll("input[type=radio]").forEach(i=>i.checked=false);
    }
  });
}

/* ---------- RESULTS ---------- */
export function mountResults(){
  const out = document.getElementById("resultsBox");
  if (!out) return;

  const p = loadProfile();
  if (!p){
    out.innerHTML = `<p class="muted">Нәтиже жоқ. Алдымен тест тапсырыңыз.</p>
      <div class="actions"><a class="btn primary" href="test.html">Диагностика</a></div>`;
    return;
  }

  const level = computeLevel(p.percent);
  const mini = document.getElementById("miniInfo");
  if (mini) mini.textContent = `Сынып: ${p.grade} | Жаңарту: ${new Date(p.updatedAt).toLocaleString()}`;

  out.innerHTML = `
    <div class="kpi">
      <div class="pill"><b>Дұрыс:</b> ${p.correct}/${p.total}</div>
      <div class="pill"><b>Нәтиже:</b> ${p.percent}%</div>
      <div class="pill"><b>Деңгей:</b> ${level.name}</div>
      <div class="pill"><b>Ұсыныс:</b> ${level.note}</div>
    </div>
    <hr class="sep">
    <p class="muted"><b>Әлсіз тақырыптар:</b> ${p.weakTopics.length ? p.weakTopics.join(", ") : "Анықталмады."}</p>
    <div class="actions">
      <a class="btn success" href="tasks.html">Python практика</a>
      <a class="btn" href="test.html">Қайта тапсыру</a>
    </div>
  `;
}

/* ---------- PYODIDE ---------- */
let pyodide=null, pyReady=false;
async function initPy(){
  if (pyReady) return;
  pyodide = await loadPyodide();
  pyReady = true;
}
function norm(v){
  try{
    if (v && typeof v.toJs === "function"){
      const js = v.toJs({ dict_converter: Object.fromEntries });
      v.destroy?.();
      return js;
    }
  }catch{}
  return v;
}
async function runSolve(code, args){
  await initPy();
  pyodide.globals.set("ARGS", args);
  const py = `
from pyodide.ffi import to_py
args = to_py(ARGS)
${code}
try:
    solve
except NameError:
    raise Exception("solve функциясы табылмады. def solve(...): болуы керек.")
result = solve(*args)
result
  `;
  return norm(pyodide.runPython(py));
}
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }

/* ---------- TASKS ---------- */
export function mountTasks(){
  const box = document.getElementById("tasksBox");
  if (!box) return;

  const p = loadProfile();
  if (!p){
    box.innerHTML = `<p class="muted">Алдымен диагностикадан өтіңіз.</p>
      <div class="actions"><a class="btn primary" href="test.html">Диагностика</a></div>`;
    return;
  }

  const level = computeLevel(p.percent);
  const gradeKey = p.grade === 9 ? "grade9" : "grade8";
  const list = TASKS[gradeKey][level.key];

  document.getElementById("levelLine").innerHTML =
    `Сынып: <b>${p.grade}</b> | Деңгей: <b>${level.name}</b> (${p.percent}%). Тапсырмалар автоматты берілді.`;

  box.innerHTML = list.map(t=>`
    <div class="q">
      <p class="q-title">${t.title}</p>
      <p class="muted">${t.statement}</p>
      <details><summary class="muted">Кеңес (hint)</summary><p class="muted">${t.hint}</p></details>
      <hr class="sep">
      <label class="muted">Python коды:</label>
      <textarea class="codebox" id="code_${t.id}">${t.starter}</textarea>
      <div class="actions">
        <button class="btn success" data-run="${t.id}">Тексеру</button>
        <button class="btn" data-reset="${t.id}">Бастапқы код</button>
      </div>
      <div class="out" id="out_${t.id}">Нәтиже осында… (Python жүктелуі 2–5 сек)</div>
    </div>
  `).join("");

  box.addEventListener("click", async (e)=>{
    const runId = e.target?.getAttribute?.("data-run");
    const resetId = e.target?.getAttribute?.("data-reset");

    if (resetId){
      const t = list.find(x=>x.id===resetId);
      document.getElementById(`code_${resetId}`).value = t.starter;
      document.getElementById(`out_${resetId}`).textContent = "Бастапқы код қойылды.";
      return;
    }

    if (runId){
      const t = list.find(x=>x.id===runId);
      const code = document.getElementById(`code_${runId}`).value;
      const out = document.getElementById(`out_${runId}`);

      out.textContent = "⏳ Тексеріп жатырмын...";
      try{
        const checks=[];
        for (const tc of t.tests){
          const got = await runSolve(code, tc.args);
          const ok = eq(got, tc.output);
          checks.push({ args: tc.args, expected: tc.output, got, ok });
        }
        const all = checks.every(x=>x.ok);
        out.textContent =
          (all ? "✅ Барлық тест өтті!\n\n" : "❌ Кейбір тест өтпеді.\n\n") +
          checks.map((r,i)=>`#${i+1}\nARGS: ${JSON.stringify(r.args)}\nКүтілетін: ${JSON.stringify(r.expected)}\nАлынған: ${JSON.stringify(r.got)}\n${r.ok?"OK":"FAIL"}\n`).join("\n");
      }catch(err){
        out.textContent = `Қате: ${err.message}`;
      }
    }
  });
}

/* ---------- ASSISTANT MODAL OPEN/CLOSE ---------- */
export function mountAssistant(){
  const fab = document.getElementById("fab");
  const modal = document.getElementById("modal");
  if (!fab || !modal) return;

  const close = document.getElementById("closeModal");
  fab.addEventListener("click", ()=> modal.classList.add("open"));
  close.addEventListener("click", ()=> modal.classList.remove("open"));
  modal.addEventListener("click", (e)=>{ if (e.target===modal) modal.classList.remove("open"); });
}
