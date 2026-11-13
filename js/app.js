const $=id=>document.getElementById(id);
const BRITISH_QUESTIONS=window.QUESTIONS, BRITISH_SYLLABUS=window.SYLLABUS;
let activeSubject="british",current=0,answers={},seconds=5400,clock=null,finished=false,activeQuestions=window.QUESTIONS.slice(),quizLabel="British Literature Mock Examination";
function setSubject(which){activeSubject=which;if(which==="indian"){window.QUESTIONS=window.INDIAN_QUESTIONS;window.SYLLABUS=window.INDIAN_SYLLABUS;}else if(which==="nz"){window.QUESTIONS=window.NZ_QUESTIONS;window.SYLLABUS=window.NZ_SYLLABUS;}else{window.QUESTIONS=BRITISH_QUESTIONS;window.SYLLABUS=BRITISH_SYLLABUS;}}
const screens=["home-screen","subject-screen","indian-subject-screen","nz-subject-screen","syllabus-screen","practice-screen","leaderboard-screen","performance-screen","quiz-screen","result-screen","whale-hub-screen","whale-play-screen","whale-study-screen","whale-quiz-screen","whale-complete-screen"];
const STORAGE_KEY="litquest-attempts";
function show(id){screens.forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden");window.scrollTo(0,0)}
function attempts(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []}}
function saveAttempts(a){localStorage.setItem(STORAGE_KEY,JSON.stringify(a))}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderHome(){
 $("subject-grid").innerHTML=SUBJECTS.map((s,i)=>`<button class="subject-card ${i===0?"available":""}" data-i="${i}"><span class="subject-icon">${["✦","文","❖","◌","⌂","✧"][i]}</span><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.subtitle)}</small><span class="status ${s.status==="ready"?"ready":""}">${s.status==="ready"?"Available now":"Coming soon"}</span></button>`).join("");
 document.querySelectorAll(".subject-card").forEach(b=>b.onclick=()=>{if(+b.dataset.i===0){setSubject("british");show("subject-screen")}else if(+b.dataset.i===1){setSubject("indian");show("indian-subject-screen")}else if(+b.dataset.i===4){setSubject("nz");show("nz-subject-screen")}else alert("This module is ready to be populated.")});
}
function renderSyllabus(){$("syllabus-back").textContent="← "+(activeSubject==="nz"?"New Zealand Literature":activeSubject==="indian"?"Indian Literature":"British Literature");$("syllabus-list").innerHTML=SYLLABUS.map(u=>`<article class="syllabus-card"><h3>UNIT ${u.unit} · ${escapeHtml(u.title)}</h3>${u.texts.map(t=>`<div class="text-row"><span>${escapeHtml(t.author)}</span><span>${escapeHtml(t.title)}</span></div>`).join("")}</article>`).join("")}
function renderPractice(){
 $("practice-back").textContent="← "+(activeSubject==="nz"?"New Zealand Literature":activeSubject==="indian"?"Indian Literature":"British Literature");
 const unitMarkup=SYLLABUS.map(u=>`<button class="unit-practice" data-kind="unit" data-unit="${u.unit}"><span class="unit-number">${u.unit}</span><span><strong>${escapeHtml(u.title)}</strong><small>${QUESTIONS.filter(q=>q.unit===u.unit).length} questions · ${u.texts.length} prescribed texts</small></span></button>`).join("");
 const textMarkup=SYLLABUS.flatMap(u=>u.texts.map(t=>{const count=QUESTIONS.filter(q=>q.work===t.title).length;return `<button class="unit-practice text-practice" data-kind="text" data-work="${escapeHtml(t.title)}"><span class="unit-number">✎</span><span><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.author)} · ${count} questions · Unit ${u.unit}</small></span></button>`})).join("");
 const bankButton=activeSubject==="nz"?`<button class="primary wide" id="nz-run-all-bank">Start all ${QUESTIONS.length} questions →</button><button class="secondary wide" id="nz-run-mock">Mixed 100-question mock →</button>`:"";
 $("practice-units").innerHTML=bankButton+`<h2 class="practice-subhead">Practise by unit</h2>${unitMarkup}<h2 class="practice-subhead">Practise by prescribed text</h2>${textMarkup}`;
 document.querySelectorAll(".unit-practice").forEach(b=>b.onclick=()=>{if(b.dataset.kind==="text"){activeQuestions=QUESTIONS.filter(q=>q.work===b.dataset.work);quizLabel=b.dataset.work+" · Text Practice";}else{activeQuestions=QUESTIONS.filter(q=>q.unit===b.dataset.unit);quizLabel="Unit "+b.dataset.unit+" Practice";}startQuiz()});
 const all=$("nz-run-all-bank");if(all)all.onclick=()=>{activeQuestions=QUESTIONS.slice();quizLabel="New Zealand Literature · Complete Question Bank";startQuiz()};
 const mock=$("nz-run-mock");if(mock)mock.onclick=startNZMock;
}
function startNZMock(){const per=QUESTIONS.reduce((m,q)=>(m[q.work]=(m[q.work]||[]).concat(q),m),{});const selected=[];Object.keys(per).forEach((k,i)=>{const a=per[k].slice().sort(()=>Math.random()-.5);selected.push(...a.slice(0,i<10?7:6))});activeQuestions=selected.sort(()=>Math.random()-.5);quizLabel="New Zealand Literature · Mixed 100-question Mock";startQuiz()}

function renderLeaderboard(){
 const a=attempts().filter(r=>(r.subject||"british")===activeSubject).sort((x,y)=>y.percent-x.percent||new Date(y.date)-new Date(x.date));
 $("leaderboard-list").innerHTML=a.length?a.map((v,i)=>`<div class="leader-row"><span class="rank">${i===0?"♛":i+1}</span><span class="leader-detail"><strong>${escapeHtml(v.label)}</strong><small>${new Date(v.date).toLocaleString()} · ${v.correct}/${v.total} correct</small></span><span class="leader-score">${v.percent}%</span></div>`).join(""):`<div class="empty">No completed attempts yet. Finish a mock examination and your results will appear here. Your personal leaderboard is saved on this device.</div>`;
}
function startFull(){activeQuestions=QUESTIONS.slice();quizLabel=(activeSubject==="indian"?"Indian Literature in English":"British Literature")+" Mock Examination";startQuiz()}
function startQuiz(){
 current=0;answers={};seconds=quizLabel.includes("Mock Examination")?5400:Math.max(600,activeQuestions.length*60);finished=false;show("quiz-screen");renderQuestion();renderNav();tick();clearInterval(clock);clock=setInterval(()=>{seconds--;tick();if(seconds<=0)submit()},1000);
}
function tick(){$("timer").textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")}
function renderQuestion(){
 const q=activeQuestions[current];$("question-count").textContent=`QUESTION ${current+1} OF ${activeQuestions.length}`;$("question-unit").textContent="UNIT "+q.unit;$("work-label").textContent=q.work;$("question-text").textContent=q.q;$("progress-fill").style.width=((current+1)/activeQuestions.length*100)+"%";
 $("options").innerHTML=q.a.map((v,i)=>`<button class="option ${answers[current]===i?"selected":""}" data-choice="${i}"><span class="letter">${"ABCD"[i]}</span><span>${escapeHtml(v)}</span></button>`).join("");
 document.querySelectorAll(".option").forEach(b=>b.onclick=()=>{answers[current]=+b.dataset.choice;renderQuestion();renderNav()});
 $("prev-question").disabled=current===0;$("prev-question").style.opacity=current===0?".4":"1";$("next-question").textContent=current===activeQuestions.length-1?"Review answers →":"Next question →";
}
function renderNav(){
 $("question-nav").innerHTML=activeQuestions.map((q,i)=>`<button class="nav-dot ${answers[i]!==undefined?"answered":""} ${i===current?"current":""}" data-q="${i}">${i+1}</button>`).join("");
 document.querySelectorAll(".nav-dot").forEach(b=>b.onclick=()=>{current=+b.dataset.q;renderQuestion();renderNav()});
}
function submit(){
 if(finished)return;finished=true;clearInterval(clock);
 const correct=activeQuestions.filter((q,i)=>answers[i]===q.correct).length,answered=Object.keys(answers).length,percent=Math.round(correct/activeQuestions.length*100);
 const detail=activeQuestions.map((q,i)=>({unit:String(q.unit),work:q.work,correct:answers[i]===q.correct,attempted:answers[i]!==undefined,category:/^who wrote/i.test(q.q)?"Author identification":"Text understanding"}));
 const all=attempts();all.push({id:Date.now(),date:new Date().toISOString(),percent,correct,total:activeQuestions.length,answered,label:quizLabel,subject:activeSubject,details:detail});saveAttempts(all);
 $("score-percent").textContent=percent+"%";$("correct-count").textContent=correct;$("wrong-count").textContent=answered-correct;$("unanswered-count").textContent=activeQuestions.length-answered;
 $("review-list").innerHTML=activeQuestions.map((q,i)=>{const ok=answers[i]===q.correct;return `<article class="review-item"><h3>${i+1}. ${escapeHtml(q.q)}</h3><p class="${ok?"right":"wrong"}">${ok?"✓ Correct":"✕ Not quite"} · Your answer: ${answers[i]===undefined?"Not answered":escapeHtml(q.a[answers[i]])}</p><p><strong>Correct answer:</strong> ${escapeHtml(q.a[q.correct])}</p><p>${escapeHtml(q.why)}</p></article>`}).join("");
 show("result-screen");
}
function aggregate(){
 const records=attempts().filter(r=>(r.subject||"british")===activeSubject),items=records.flatMap(a=>(a.details||[]).map(d=>({...d,date:a.date})));
 const total=items.length,answered=items.filter(x=>x.attempted),correct=answered.filter(x=>x.correct).length;
 const groupBy=key=>{const m={};items.forEach(x=>{const k=x[key]||"Unknown";m[k]??={total:0,attempted:0,correct:0};m[k].total++;if(x.attempted){m[k].attempted++;if(x.correct)m[k].correct++}});return m};
 const units=groupBy("unit"),works=groupBy("work"),categories=groupBy("category");
 const pct=g=>g.attempted?Math.round(g.correct/g.attempted*100):0;
 return {records,items,total,answered:answered.length,correct,accuracy:answered.length?Math.round(correct/answered.length*100):0,units,works,categories,pct};
}
function progressBar(label,g,pct){
 const score=pct(g),tone=score>=85?"#36775b":score>=70?"#7964b5":score>=50?"#c18a39":"#b65a62";
 return `<div class="metric-row"><div class="metric-head"><strong>${escapeHtml(label)}</strong><b>${score}%</b></div><div class="metric-track"><span style="width:${score}%;background:${tone}"></span></div><small>${g.correct} correct · ${g.attempted} answered · ${g.total} seen</small></div>`;
}
function renderPerformance(){
 const a=aggregate(),unitNames=activeSubject==="indian"?{"01":"Poetry","02":"Prose","03":"Drama","04":"Fiction","05":"Literary Criticism"}:activeSubject==="nz"?{"01":"Poetry","02":"Prose","03":"Drama","04":"Fiction","05":"Short Stories"}:{"01":"Poetry I · Early twentieth century","02":"Poetry II · Late twentieth century","03":"Prose","04":"Drama","05":"Fiction"};
 if(!a.records.length){$("performance-content").innerHTML=`<div class="empty">Your performance insights will appear after you complete your first quiz. Start with a unit practice or the full mock examination.</div>`;return}
 const unitRows=Object.entries(unitNames).filter(([k])=>a.units[k]).map(([k,n])=>progressBar(n,a.units[k],a.pct)).join("");
 const workRows=Object.entries(a.works).sort((x,y)=>a.pct(x[1])-a.pct(y[1])).map(([n,g])=>progressBar(n,g,a.pct)).join("");
 const unitScores=Object.entries(a.units).filter(([,g])=>g.attempted).sort((x,y)=>a.pct(y[1])-a.pct(x[1]));
 const insight=unitScores.length?`<div class="insight-card"><strong>Strongest area</strong><p>${escapeHtml(unitNames[unitScores[0][0]]||"Unit "+unitScores[0][0])} · ${a.pct(unitScores[0][1])}% accuracy</p></div>${unitScores.length>1?`<div class="insight-card caution"><strong>Area to revisit</strong><p>${escapeHtml(unitNames[unitScores[unitScores.length-1][0]]||"Unit "+unitScores[unitScores.length-1][0])} · ${a.pct(unitScores[unitScores.length-1][1])}% accuracy</p></div>`:""}`:`<div class="empty">Answer more questions to unlock unit comparisons.</div>`;
 $("performance-content").innerHTML=`
 <div class="performance-summary"><div><small>OVERALL ACCURACY</small><strong>${a.accuracy}%</strong></div><div><small>QUESTIONS ANSWERED</small><strong>${a.answered}</strong></div><div><small>CORRECT ANSWERS</small><strong>${a.correct}</strong></div></div>
 <article class="analytics-card"><h3>Unit-wise performance</h3><p class="analytics-sub">Based on all saved attempts on this device. Skipped questions are excluded from accuracy.</p>${unitRows||'<div class="empty">No unit results yet.</div>'}</article>
 <article class="analytics-card"><h3>What the numbers suggest</h3>${insight}<p class="analytics-sub">These are rule-based insights from her answers, not AI-generated assessments. A small number of attempts may not represent overall ability.</p></article>
 <article class="analytics-card"><h3>Prescribed text performance</h3><p class="analytics-sub">Lowest-scoring texts appear first. Practise these works to strengthen coverage.</p>${workRows||'<div class="empty">No text-level results yet.</div>'}</article>
 <article class="analytics-card"><h3>Question-type performance</h3>${Object.entries(a.categories).map(([n,g])=>progressBar(n,g,a.pct)).join("")}</article>
 <article class="analytics-card"><h3>Attempt history</h3>${a.records.slice().reverse().slice(0,8).map(r=>`<div class="history-row"><span><strong>${escapeHtml(r.label)}</strong><small>${new Date(r.date).toLocaleString()}</small></span><b>${r.percent}%</b></div>`).join("")}</article>`;
}
function exportProgress(){
 const data={app:"LitQuest",version:1,exportedAt:new Date().toISOString(),attempts:attempts()};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="litquest-progress-backup.json";a.click();URL.revokeObjectURL(url);
}
$("brand-home").onclick=()=>show("home-screen");
$("open-leaderboard").onclick=()=>{renderLeaderboard();show("leaderboard-screen")};
$("open-subject-leaderboard").onclick=()=>{renderLeaderboard();show("leaderboard-screen")};
$("open-performance").onclick=()=>{renderPerformance();show("performance-screen")};
$("performance-back").onclick=()=>show(activeSubject==="indian"?"indian-subject-screen":activeSubject==="nz"?"nz-subject-screen":"subject-screen");
$("export-progress").onclick=exportProgress;
$("clear-progress").onclick=()=>{if(confirm("Delete all saved LitQuest attempts and performance history from this device? This cannot be undone.")){localStorage.removeItem(STORAGE_KEY);renderPerformance();alert("Saved progress cleared.")}};
$("back-home").onclick=()=>show("home-screen");
$("open-syllabus").onclick=()=>{renderSyllabus();show("syllabus-screen")};
$("syllabus-back").onclick=()=>show(activeSubject==="indian"?"indian-subject-screen":activeSubject==="nz"?"nz-subject-screen":"subject-screen");
$("open-practice").onclick=()=>{renderPractice();show("practice-screen")};
$("practice-back").onclick=()=>show(activeSubject==="indian"?"indian-subject-screen":activeSubject==="nz"?"nz-subject-screen":"subject-screen");
$("leader-back").onclick=()=>show(activeSubject==="indian"?"indian-subject-screen":activeSubject==="nz"?"nz-subject-screen":"subject-screen");
$("start-quiz").onclick=startFull;
$("prev-question").onclick=()=>{if(current>0){current--;renderQuestion();renderNav()}};
$("next-question").onclick=()=>{if(current<activeQuestions.length-1){current++;renderQuestion();renderNav()}else if(confirm("Submit your answers?"))submit()};
$("submit-quiz").onclick=()=>{if(confirm("Submit your examination now?"))submit()};
$("quit-quiz").onclick=()=>{if(confirm("Exit this attempt? Your answers will be lost.")){clearInterval(clock);show(activeSubject==="indian"?"indian-subject-screen":activeSubject==="nz"?"nz-subject-screen":"subject-screen")}};
$("retry-quiz").onclick=()=>quizLabel.includes("Mock Examination")?startFull():startQuiz();
$("home-button").onclick=()=>show("home-screen");
$("indian-back-home").onclick=()=>show("home-screen");
$("indian-open-syllabus").onclick=()=>{setSubject("indian");renderSyllabus();show("syllabus-screen")};
$("indian-start-quiz").onclick=()=>{setSubject("indian");startFull()};
$("indian-open-practice").onclick=()=>{setSubject("indian");renderPractice();show("practice-screen")};
$("indian-open-leaderboard").onclick=()=>{setSubject("indian");renderLeaderboard();show("leaderboard-screen")};
$("indian-open-performance").onclick=()=>{setSubject("indian");renderPerformance();show("performance-screen")};
$("nz-back-home").onclick=()=>show("home-screen");
$("nz-open-syllabus").onclick=()=>{setSubject("nz");renderSyllabus();show("syllabus-screen")};
$("nz-open-bank").onclick=()=>{setSubject("nz");renderPractice();show("practice-screen")};
$("nz-open-unit-practice").onclick=()=>{setSubject("nz");renderPractice();show("practice-screen");$("practice-units").querySelector(".practice-subhead").scrollIntoView({block:"start"})};
$("nz-open-text-practice").onclick=()=>{setSubject("nz");renderPractice();show("practice-screen");const h=[...document.querySelectorAll(".practice-subhead")].find(x=>x.textContent.includes("prescribed text"));if(h)h.scrollIntoView({block:"start"})};
$("nz-open-story").onclick=()=>{setSubject("nz");window.openWhaleHub()};
$("nz-open-performance").onclick=()=>{setSubject("nz");renderPerformance();show("performance-screen")};
$("nz-open-leaderboard").onclick=()=>{setSubject("nz");renderLeaderboard();show("leaderboard-screen")};
window.openNZWorkPractice=(work)=>{setSubject("nz");activeQuestions=QUESTIONS.filter(q=>q.work===work);quizLabel=work+" · Text Practice";startQuiz()};
renderHome();renderSyllabus();
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
