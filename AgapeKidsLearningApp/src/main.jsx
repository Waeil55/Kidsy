import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
import {curriculum, grades, activities} from "./curriculum";

const defaultChild = {name:"Maheen Hassan", grade:"Grade 2", coins:12000, streak:7, xp:680, level:"Bronze"};

function Icon({children}){ return <span className="icon">{children}</span> }

function KidAvatar({small=false}) {
  return <div className={"kid-avatar " + (small ? "small":"")}>
    <div className="hair"></div><div className="face"><i></i><i></i><b></b></div>
  </div>
}

function App(){
  const [child,setChild] = useState(()=>JSON.parse(localStorage.getItem("brightsteps-child")||"null")||defaultChild);
  const [tab,setTab] = useState("home");
  const [modal,setModal] = useState(null);
  const [grade,setGrade] = useState(child.grade);
  const [subject,setSubject] = useState("Math");
  const [lesson,setLesson] = useState(null);

  useEffect(()=>{
    localStorage.setItem("brightsteps-child", JSON.stringify(child));
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
  },[child]);

  const activeGrade = grade || "Grade 2";
  const gradeData = curriculum[activeGrade];

  function openLesson(item){ setLesson(item); setTab("learn"); }
  function reward(amount=100){
    setChild(c=>({...c, coins:c.coins+amount, xp:c.xp+amount}));
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand" onClick={()=>setTab("home")}>
        <KidAvatar small/><div><div className="hello">Good Afternoon!</div><strong>{child.name}</strong></div>
      </div>
      <div className="coin-pill"><span>✦</span>{child.coins}</div>
    </header>

    <main className="screen">
      {tab==="home" && <Home child={child} onActivities={()=>setModal("activities")} onLesson={openLesson} onTab={setTab}/>}
      {tab==="learn" && <Learn grade={activeGrade} setGrade={setGrade} subject={subject} setSubject={setSubject} onLesson={openLesson}/>}
      {tab==="chat" && <Chat child={child}/>}
      {tab==="profile" && <Profile child={child} setChild={setChild}/>}
    </main>

    <nav className="bottom-nav">
      <NavButton active={tab==="home"} onClick={()=>setTab("home")} icon="⌂" label="Home"/>
      <NavButton active={tab==="learn"} onClick={()=>setTab("learn")} icon="▦" label="Learn"/>
      <NavButton active={tab==="chat"} onClick={()=>setTab("chat")} icon="•••" label="AI Chat"/>
      <NavButton active={tab==="profile"} onClick={()=>setTab("profile")} icon="●" label="Profile"/>
    </nav>

    {modal==="activities" && <ActivityModal onClose={()=>setModal(null)} onLesson={openLesson}/>}
    {lesson && <LessonModal lesson={lesson} onClose={()=>setLesson(null)} onReward={reward}/>}
  </div>
}

function NavButton({active,onClick,icon,label}){return <button className={"nav-btn "+(active?"active":"")} onClick={onClick}><span>{icon}</span><small>{label}</small></button>}

function Home({child,onActivities,onLesson,onTab}){
  const featured = curriculum[child.grade].Math[0];
  return <div className="home">
    <section className="habit-card">
      <div>
        <div className="eyebrow">Today's good habit</div>
        <h1>"Kindness makes the<br/>world a better place."</h1>
        <div className="habit-actions"><button className="white-btn" onClick={()=>onLesson({title:"Kindness",type:"Good Habit",summary:"Small acts of kindness can make a big difference.",questions:[["What is a kind action?",["Helping someone","Ignoring someone","Taking something"],0]]})}>Play ◉</button><span className="reward">✦ 100</span></div>
      </div>
      <div className="bird">🐦</div>
    </section>

    <section className="quick-grid">
      <QuickCard emoji="🔤" title="Alphabets" tone="blue" onClick={()=>onTab("learn")}/>
      <QuickCard emoji="🔢" title="Numbers" tone="pink" onClick={()=>onTab("learn")}/>
      <QuickCard emoji="🧸" title="More" tone="peach" onClick={onActivities}/>
    </section>

    <section className="puzzle-banner">
      <div><h2>Puzzle Game</h2><p>Play & match the puzzles</p></div>
      <div className="tiles"><i></i><i></i><i></i><i></i></div>
      <button className="blue-btn" onClick={()=>onLesson({title:"Word Puzzle",type:"Puzzle",summary:"Match words, meanings, and pictures.",questions:[["Which word means a place where books are kept?",["Library","Garden","Kitchen"],0],["Which word rhymes with cat?",["Sun","Hat","Dog"],1]]})}>Play ◉</button>
    </section>

    <div className="section-title"><h2>More Stories</h2><button onClick={()=>onLesson({title:"The Happy Lion",type:"Story",summary:"A short story about friendship, courage, and sharing.",questions:[["What did the lion learn?",["Sharing helps friends","Being loud wins","Never ask for help"],0]]})}>See All</button></div>
    <section className="story-card">
      <div><span>Mystical Stories</span><h2>“Story About<br/>The Happy Lion.”</h2><div className="story-meta">▶ Play &nbsp; ◷ 14 min</div></div>
      <div className="lion">🦁</div>
    </section>

    <section className="today-strip">
      <div><span className="eyebrow">Continue learning</span><h3>{featured.title}</h3><p>{featured.summary}</p></div>
      <button className="blue-btn" onClick={()=>onLesson(featured)}>Continue</button>
    </section>
  </div>
}

function QuickCard({emoji,title,tone,onClick}){return <button className={"quick-card "+tone} onClick={onClick}><div className="spark">✧</div><span className="big-emoji">{emoji}</span><strong>{title}</strong></button>}

function ActivityModal({onClose,onLesson}){
 return <div className="overlay"><div className="activity-sheet">
   <div className="handle"></div><div className="activity-head"><h2>Activities</h2><button onClick={onClose}>×</button></div>
   <div className="activity-grid">{activities.map((a,i)=><button key={a.title} className={"activity "+["blue","pink","peach"][i%3]} onClick={()=>{onLesson(a);onClose()}}><span>{a.emoji}</span><b>{a.title}</b></button>)}</div>
 </div></div>
}

function Learn({grade,setGrade,subject,setSubject,onLesson}){
 const subjects=Object.keys(curriculum[grade]);
 const lessons=curriculum[grade][subject];
 return <div className="learn-page">
   <div className="page-head"><div><span className="eyebrow">Learning path</span><h1>{grade}</h1></div><select value={grade} onChange={e=>setGrade(e.target.value)}>{grades.map(g=><option key={g}>{g}</option>)}</select></div>
   <div className="subject-tabs">{subjects.map(s=><button className={s===subject?"selected":""} onClick={()=>setSubject(s)} key={s}>{s}</button>)}</div>
   <div className="progress-card"><div><b>{subject}</b><p>Build skills one small lesson at a time.</p></div><strong>{Math.min(100, lessons.length*7)}%</strong></div>
   <div className="lesson-list">{lessons.map((l,i)=><button className="lesson-row" key={l.title} onClick={()=>onLesson(l)}><span className="lesson-number">{i+1}</span><span><b>{l.title}</b><small>{l.summary}</small></span><em>{i<2?"✓":"›"}</em></button>)}</div>
 </div>
}

function LessonModal({lesson,onClose,onReward}){
 const [q,setQ]=useState(0); const [selected,setSelected]=useState(null); const [done,setDone]=useState(false);
 const question=lesson.questions?.[q];
 function choose(i){if(done)return;setSelected(i);if(question && i===question[2])setTimeout(()=>{},0)}
 function next(){if(!question || selected===question[2]){if(q<(lesson.questions?.length||1)-1){setQ(q+1);setSelected(null)}else{setDone(true);onReward(100)}}}
 return <div className="overlay"><div className="lesson-sheet">
   <div className="lesson-top"><button onClick={onClose}>←</button><span>{lesson.type||"Lesson"}</span><span>✦ +100</span></div>
   {!done ? <><div className="lesson-art">{lesson.emoji||"🌟"}</div><span className="eyebrow">{lesson.type||"Lesson"}</span><h1>{lesson.title}</h1><p className="lesson-summary">{lesson.summary}</p>
   {question && <div className="question"><b>{question[0]}</b>{question[1].map((opt,i)=><button className={"option "+(selected===i?"chosen":"")} key={opt} onClick={()=>choose(i)}>{opt}</button>)}</div>}
   <button className="primary-btn" disabled={question && selected!==question[2]} onClick={next}>{q<(lesson.questions?.length||1)-1?"Next":"Finish"} <span>→</span></button></>
   : <div className="complete"><div>🎉</div><h1>Great job!</h1><p>You earned <b>100 coins</b> and more XP.</p><button className="primary-btn" onClick={onClose}>Back to learning</button></div>}
 </div></div>
}

function Profile({child,setChild}){
 const [name,setName]=useState(child.name);
 return <div className="profile-page">
   <div className="profile-head"><button className="back">←</button><h1>Kids Profile</h1></div>
   <div className="profile-avatar"><KidAvatar/></div><button className="camera">⌑</button>
   <h2>{child.name}</h2><div className="profile-coins">✦ {child.coins}</div>
   <div className="tiers">{["Bronze","Silver","Gold","Platinum","Diamond"].map(x=><span className={child.level===x?"on":""} key={x}>{x}</span>)}</div>
   <section className="profile-section"><h2>My Badges</h2><div className="badges">{["🏆","🎁","👑","💚","🎯","🏅","💎"].map((x,i)=><span key={i}>{x}</span>)}</div></section>
   <section className="profile-section buy"><h2>Buy Coin</h2><div className="coin-pack"><div><b>✦ 100 Coins</b><small>Starter Pack Only $5</small></div><button>Buy ✦</button></div></section>
   <section className="profile-section settings"><h2>Child settings</h2><label>Name<input value={name} onChange={e=>setName(e.target.value)} /></label><label>Grade<select value={child.grade} onChange={e=>setChild({...child,grade:e.target.value})}>{grades.map(g=><option key={g}>{g}</option>)}</select></label><button className="primary-btn" onClick={()=>setChild({...child,name:name||"Learner"})}>Save profile</button></section>
 </div>
}

function Chat({child}){
 const [messages,setMessages]=useState([{role:"ai",text:`Hi ${child.name.split(" ")[0]}! I’m your learning helper. Ask me about math, reading, science, or homework.`}]);
 const [input,setInput]=useState("");
 function send(){if(!input.trim())return; const text=input.trim();setMessages(m=>[...m,{role:"me",text},{role:"ai",text:"Great question! Let’s break it into a small step. Try explaining what you already know, and I’ll help with the next part."}]);setInput("")}
 return <div className="chat-page"><div className="page-head"><div><span className="eyebrow">Safe learning helper</span><h1>AI Chat</h1></div><span className="status-dot">● Online</span></div><div className="chat-messages">{messages.map((m,i)=><div className={"bubble "+m.role} key={i}>{m.text}</div>)}</div><div className="chat-box"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask a learning question…"/><button onClick={send}>↑</button></div></div>
}

const root=createRoot(document.getElementById("root"));
root.render(<App/>);