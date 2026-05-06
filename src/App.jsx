import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:       "#0A0E1A",
  surface:  "#111827",
  surface2: "#1A2235",
  border:   "#1E2D45",
  text:     "#E2E8F0",
  muted:    "#64748B",
  accent:   "#38BDF8",
  accentDk: "#0284C7",
  red:      "#E62B1E",
  green:    "#4ADE80",
  amber:    "#FBBF24",
  pink:     "#F472B6",
  purple:   "#A78BFA",
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const IconHome = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const IconMonitorPlay = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
    <polygon points="10,8 15,11 10,14" fill={color} stroke="none"/>
  </svg>
);

const IconRepeat = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17,1 21,5 17,9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7,23 3,19 7,15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

const IconRadio = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a9 9 0 0 1 9 9"/>
    <path d="M12 2a9 9 0 0 0-9 9"/>
    <path d="M12 7a4 4 0 0 1 4 4"/>
    <path d="M12 7a4 4 0 0 0-4 4"/>
    <circle cx="12" cy="11" r="1" fill={color} stroke="none"/>
    <rect x="5" y="19" width="14" height="3" rx="1"/>
    <line x1="12" y1="12" x2="12" y2="19"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "shadowpro_sessions";

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveSession(session) {
  const list = loadSessions();
  list.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 200)));
}
function getLastSession(materialId) {
  return loadSessions().find(s => s.materialId === materialId) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const MATERIALS = [
  {
    id: "ted1",
    title: "The Power of Vulnerability",
    speaker: "Brené Brown",
    level: "B2", theme: "Leadership",
    tedUrl: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    sentences: [
      { id:"s1", durationMs:5200, words:[
        {w:"So,"},{w:"I'll"},{w:"start"},{w:"with"},{w:"this:"},
        {w:"a"},{w:"couple"},{w:"years"},{w:"ago,"},
        {w:"an"},{w:"event"},{w:"planner"},{w:"called"},{w:"me"},
        {w:"because"},{w:"I"},{w:"was"},{w:"going"},{w:"to"},
        {w:"do"},{w:"a"},{w:"speaking"},{w:"event."},
      ]},
      { id:"s2", durationMs:4100, words:[
        {w:"And"},{w:"she"},{w:"said,"},
        {w:"'I'm"},{w:"really"},
        {w:"struggling", devPoint:{type:"rhythm", note:"Pause slightly before 'I'm really struggling' to make the quote feel authentic. Lean on 'really' to carry the emotional weight, then let 'struggling' trail off quickly — don't stop sharply at the end."}},
        {w:"with"},{w:"how"},{w:"to"},{w:"write"},{w:"about"},
        {w:"you"},{w:"on"},{w:"the"},{w:"little"},{w:"flyer.'"},
      ]},
      { id:"s3", durationMs:6800, words:[
        {w:"And"},{w:"I"},{w:"thought,"},
        {w:"'Well,"},{w:"what's"},{w:"the"},{w:"struggle?'"},
        {w:"And"},{w:"she"},{w:"said,"},
        {w:"'Well,"},{w:"I"},{w:"saw"},{w:"you"},{w:"speak,"},
        {w:"and"},{w:"I'm"},{w:"going"},{w:"to"},{w:"call"},
        {w:"you"},{w:"a"},
        {w:"researcher,", devPoint:{type:"stress", note:"Slow down slightly on 'call you a researcher' — it's a label being offered, so give it a moment of weight. Then drop pitch on 'I think' at the end to signal uncertainty or politeness."}},
        {w:"I"},{w:"think,'"},
      ]},
      { id:"s4", durationMs:2800, words:[
        {w:"because"},{w:"they'll"},{w:"think"},{w:"you're"},
        {w:"boring", devPoint:{type:"rhythm", note:"Deliver 'boring and irrelevant' as one quick, dismissive phrase — no pause between the two words. Natives punch 'boring' and keep momentum straight through 'irrelevant.' The rhythm is: BOring and irreLEvant, with 'and' unaccented."}},
        {w:"and"},
        {w:"irrelevant.", devPoint:{type:"stress", note:"Let 'irrelevant' trail off with a slight downward inflection — it's the second punch in a pair. If you pause before it, the dismissive effect is lost. Keep it flowing from 'boring.'"}},
      ]},
      { id:"s5", durationMs:5600, words:[
        {w:"I"},{w:"was"},{w:"a"},{w:"little"},{w:"—"},
        {w:"I"},{w:"thought,"},{w:"'Okay.'"},{w:"And"},{w:"she"},
        {w:"said,"},{w:"'But"},{w:"the"},{w:"thing"},{w:"I"},
        {w:"liked"},{w:"about"},{w:"your"},{w:"talk"},{w:"is"},
        {w:"you're"},{w:"a"},
        {w:"storyteller.'", devPoint:{type:"linking", note:"After 'you're a,' pause just a beat before 'storyteller' — this micro-pause creates a reveal effect. Let 'storyteller' ring out slightly longer than the surrounding words; it's the punchline of the whole setup."}},
      ]},
      { id:"s6", durationMs:3200, words:[
        {w:"So"},{w:"I"},{w:"was"},{w:"like,"},{w:"'Okay,"},
        {w:"let's", devPoint:{type:"hesitation", note:"Run 'let's go with storyteller' as one flowing phrase — no pause after 'let's.' The whole sentence should resolve quickly, matching the tone of someone wrapping up a point and moving on."}},
        {w:"go"},{w:"with"},{w:"storyteller.'"},
      ]},
    ],
  },
  {
    id: "ted2",
    title: "How Great Leaders Inspire Action",
    speaker: "Simon Sinek",
    level: "C1", theme: "Presentation",
    tedUrl: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
    sentences: [
      { id:"s1", durationMs:3800, words:[
        {w:"How"},{w:"do"},{w:"you"},{w:"explain"},
        {w:"when"},{w:"things"},{w:"don't"},{w:"go"},
        {w:"as"},{w:"we"},{w:"assumed?"},
      ]},
      { id:"s2", durationMs:5400, words:[
        {w:"Or"},{w:"better,"},{w:"how"},{w:"do"},{w:"you"},
        {w:"explain"},{w:"when"},{w:"others"},{w:"are"},{w:"able"},
        {w:"to"},{w:"achieve"},{w:"things"},{w:"that"},{w:"seem"},{w:"to"},
        {w:"defy", devPoint:{type:"stress", note:"You can take a natural breath after 'achieve things' before 'that seem to defy' — this pause builds anticipation. Then stress 'DEFY' sharply; it signals contrast and challenge, the emotional center of the sentence."}},
        {w:"all"},{w:"of"},{w:"the"},
        {w:"assumptions?", devPoint:{type:"stress", note:"Let 'all of the assumptions' trail with a rising question inflection — Sinek isn't just asking, he's inviting the audience to wonder. Don't drop pitch too early; hold the question energy until the very end."}},
      ]},
      { id:"s3", durationMs:5100, words:[
        {w:"Year"},{w:"after"},{w:"year,"},{w:"after"},{w:"year,"},
        {w:"after"},{w:"year,"},{w:"they're"},{w:"more"},
        {w:"innovative", devPoint:{type:"rhythm", note:"Pace 'year after year, after year' with a slight rise each repetition — this rhythmic build mimics the relentlessness of the companies he's describing. Then stress 'MORE innovative,' where 'more' carries the contrast with all the competition."}},
        {w:"than"},{w:"all"},{w:"their"},{w:"competition."},
      ]},
    ],
  },
  {
    id: "ted3",
    title: "Your Body Language Shapes Who You Are",
    speaker: "Amy Cuddy",
    level: "B2", theme: "Negotiation",
    tedUrl: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
    sentences: [
      { id:"s1", durationMs:4200, words:[
        {w:"I"},{w:"want"},{w:"to"},{w:"start"},{w:"by"},{w:"offering"},
        {w:"you"},{w:"a"},{w:"free,"},
        {w:"no-tech", devPoint:{type:"rhythm", note:"Pause after 'free,' to let the word land before continuing — that comma is earning its keep. Then deliver 'no-tech life hack' smoothly as one phrase. The contrast between 'free, no-tech' and the audience's high-tech expectations is where the humor lives."}},
        {w:"life"},{w:"hack,"},
      ]},
      { id:"s2", durationMs:3600, words:[
        {w:"and"},{w:"all"},{w:"it"},{w:"requires"},{w:"of"},{w:"you"},{w:"is"},{w:"this:"},
        {w:"that"},{w:"for"},{w:"two"},{w:"minutes,"},
        {w:"you"},{w:"are"},{w:"going"},{w:"to"},{w:"make"},{w:"yourself"},
        {w:"either"},{w:"very"},{w:"big"},{w:"or"},{w:"very"},{w:"small."},
      ]},
      { id:"s3", durationMs:2800, words:[
        {w:"Tiny"},
        {w:"tweaks", devPoint:{type:"stress", note:"Stress both 'TINY' and 'BIG' as a contrast pair — punch the adjectives to make the irony land. Pause briefly between 'tweaks' and 'can lead to' so the listener has a moment before the payoff arrives."}},
        {w:"can"},{w:"lead"},{w:"to"},{w:"big"},{w:"changes."},
      ]},
    ],
  },
  {
    id: "ted4",
    title: "Grit: The Power of Passion and Perseverance",
    speaker: "Angela Lee Duckworth",
    level: "B2", theme: "Motivation",
    tedUrl: "https://www.ted.com/talks/angela_lee_duckworth_grit_the_power_of_passion_and_perseverance",
    sentences: [
      { id:"s1", durationMs:5500, words:[
        {w:"When"},{w:"I"},{w:"was"},{w:"27"},{w:"years"},{w:"old,"},
        {w:"I"},{w:"left"},{w:"a"},{w:"very"},
        {w:"demanding", devPoint:{type:"stress", note:"Pause after '27 years old,' to let the age land before the story unfolds. Then stress 'very DEMANDING job' — 'demanding' carries the emotional weight explaining why leaving was significant."}},
        {w:"job"},{w:"in"},{w:"management"},{w:"consulting"},
      ]},
      { id:"s2", durationMs:4800, words:[
        {w:"to"},{w:"teach"},{w:"math"},{w:"to"},{w:"seventh"},{w:"graders"},
        {w:"in"},{w:"the"},{w:"New"},{w:"York"},{w:"City"},
        {w:"public"},
        {w:"schools.", devPoint:{type:"rhythm", note:"Speak 'New York City public schools' without pausing mid-phrase — it's one location that grounds the story. Put a light stress on 'seventh graders' and let 'schools' close the sentence with a downward pitch."}},
      ]},
      { id:"s3", durationMs:6000, words:[
        {w:"I"},{w:"came"},{w:"to"},{w:"see"},{w:"that"},{w:"grit"},
        {w:"—"},{w:"passion"},{w:"and"},
        {w:"perseverance", devPoint:{type:"stress", note:"The dash (—) after 'grit' signals a formal definition — pause a full beat here. Then speak 'passion and perseverance' at a slightly slower pace, stressing both nouns equally. They're the two pillars of her entire argument."}},
        {w:"for"},{w:"very"},{w:"long-term"},{w:"goals"},
      ]},
      { id:"s4", durationMs:3500, words:[
        {w:"was"},{w:"one"},{w:"of"},{w:"the"},{w:"best"},
        {w:"predictors", devPoint:{type:"stress", note:"Stress 'one of the BEST predictors' — 'best' is the bold, surprising claim. Then let 'of success' trail slightly downward in pitch to signal a complete thought."}},
        {w:"of"},{w:"success."},
      ]},
      { id:"s5", durationMs:5000, words:[
        {w:"Talent"},{w:"doesn't"},{w:"make"},{w:"you"},
        {w:"gritty.", devPoint:{type:"rhythm", note:"Stress 'Talent DOESN'T make you gritty' — the word 'doesn't' carries the contrast and should be held slightly longer than normal to make the negation land."}},
        {w:"Our"},{w:"data"},{w:"show"},{w:"that"},{w:"many"},
        {w:"talented", devPoint:{type:"stress", note:"Pause before 'Our data show' to shift from opinion to evidence — a gear change the listener needs to register. Then let 'many talented individuals' flow evenly; 'talented' here sets up the contrast with grit."}},
        {w:"individuals"},
      ]},
      { id:"s6", durationMs:4000, words:[
        {w:"simply"},{w:"do"},{w:"not"},{w:"follow"},
        {w:"through"},{w:"on"},{w:"their"},
        {w:"commitments.", devPoint:{type:"linking", note:"Stress 'do NOT follow through' — hold 'not' slightly longer to make the negation stick. Then let 'on their commitments' trail off with a falling, slightly sorrowful intonation."}},
      ]},
    ],
  },
];

const DEV_TYPE = {
  rhythm:     { label:"Rhythm",  color:"#F472B6", bg:"#F472B618", icon:"〰" },
  stress:     { label:"Stress",  color:"#38BDF8", bg:"#38BDF818", icon:"↑" },
  hesitation: { label:"Flow",    color:"#FBBF24", bg:"#FBBF2418", icon:"⏸" },
  linking:    { label:"Linking", color:"#4ADE80", bg:"#4ADE8018", icon:"⟿" },
};

// Episode topic colours
const EP_COLOR = {
  bbc:        { color:"#A78BFA", bg:"#A78BFA18", label:"BBC World News", icon:"🌍" },
  guardian:   { color:"#38BDF8", bg:"#38BDF818", label:"The Guardian",   icon:"📰" },
  japantimes: { color:"#FBBF24", bg:"#FBBF2418", label:"Japan Times",    icon:"🗾" },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPEECH
// ─────────────────────────────────────────────────────────────────────────────
function getEnglishVoice() {
  const v = window.speechSynthesis.getVoices();
  return v.find(x=>x.lang==="en-US"&&x.localService) || v.find(x=>x.lang==="en-US") || v.find(x=>x.lang.startsWith("en")) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING
// ─────────────────────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size=64, stroke=5 }) => {
  const r = (size-stroke*2)/2, circ = 2*Math.PI*r;
  const clr = score>=85?C.green:score>=65?C.accent:C.amber;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={clr} strokeWidth={stroke}
        strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round"
        style={{transition:"stroke-dasharray 1s ease"}}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fill={C.text} fontSize={size*0.22} fontWeight="700"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}>
        {score}
      </text>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
function HomePage({ onStart, onNav }) {
  const [sessions, setSessions] = useState(loadSessions);
  useEffect(() => {
    const refresh = () => setSessions(loadSessions());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const streak = 7, xp = 2460;
  const todayMat = MATERIALS[0];
  const devCount = todayMat.sentences.flatMap(s=>s.words).filter(w=>w.devPoint).length;
  const weekData = [55,70,82,90,95,0,0];
  const recentSessions = sessions.slice(0,3);
  const avgScore = sessions.length ? Math.round(sessions.reduce((a,s)=>a+s.score,0)/sessions.length) : 81;
  const totalSessions = sessions.length || 34;

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:C.bg,color:C.text,paddingBottom:80}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(10,14,26,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{fontWeight:900,fontSize:20,letterSpacing:"-0.5px"}}>Shadow<span style={{color:C.red}}>Pro</span></div>
        <div style={{display:"flex",gap:8}}>
          {[["🔥",streak,C.amber],["⭐",xp.toLocaleString(),"#FBBF24"]].map(([icon,val,clr])=>(
            <div key={icon} style={{display:"flex",alignItems:"center",gap:5,background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 12px",fontSize:13,fontWeight:700,color:clr}}>{icon} {val}</div>
          ))}
        </div>
      </div>

      <div style={{padding:"20px",maxWidth:640,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#0F1D35,#162844)",border:"1px solid #1E3A5F",borderRadius:20,padding:22,marginBottom:16,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:"radial-gradient(circle,rgba(56,189,248,0.12) 0%,transparent 70%)",borderRadius:"50%"}}/>
          <div style={{fontSize:11,color:C.accent,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>📅 Today's Lesson</div>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
            <div style={{width:52,height:52,borderRadius:10,flexShrink:0,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",letterSpacing:-1}}>TED</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:15,lineHeight:1.3}}>{todayMat.title}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>{todayMat.speaker} · {todayMat.level}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {[[`🎯 Goal: 2 sessions`,C.accent],[`⏱ 20 min`,C.green],[`🔥 ${devCount} Dev Points`,"#F87171"]].map(([label,clr])=>(
              <div key={label} style={{padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:700,background:`${clr}18`,color:clr,border:`1px solid ${clr}30`}}>{label}</div>
            ))}
          </div>
          <button onClick={()=>onStart(todayMat)} style={{width:"100%",padding:"13px",borderRadius:12,background:`linear-gradient(90deg,${C.accent},${C.accentDk})`,color:"#fff",fontWeight:800,border:"none",cursor:"pointer",fontSize:15,boxShadow:"0 4px 20px rgba(56,189,248,0.3)"}}>
            Start Shadowing Now →
          </button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:16}}>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Current Streak</div>
            <div style={{fontSize:36,fontWeight:900,color:C.amber}}>🔥 {streak}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>days in a row</div>
            <div style={{marginTop:10,fontSize:11,color:C.green}}>✓ Completed yesterday</div>
          </div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:16}}>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>This Week</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:4,height:36}}>
              {weekData.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:"100%",borderRadius:"3px 3px 0 0",height:`${Math.max(v,4)}%`,background:i===4?C.accent:v>0?"#1E3A5F":C.border,minHeight:4}}/>
                  <div style={{fontSize:9,color:i===4?C.accent:C.muted}}>{["M","T","W","T","F","S","S"][i]}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:6}}>Avg score: <span style={{color:C.green,fontWeight:700}}>{avgScore}</span></div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
          {[
            {label:"Total XP",  value:xp.toLocaleString(), icon:"⭐", color:C.amber},
            {label:"Sessions",  value:String(totalSessions), icon:"🎙️", color:C.accent},
            {label:"Avg Score", value:String(avgScore),      icon:"🎯", color:C.green},
          ].map(s=>(
            <div key={s.label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
              <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
              <div style={{fontSize:18,fontWeight:900,color:s.color}}>{s.value}</div>
              <div style={{fontSize:11,color:C.muted}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:15}}>📋 Recent Sessions</div>
            <button onClick={()=>onNav("materials")} style={{background:"transparent",border:"none",color:C.accent,fontSize:12,fontWeight:700,cursor:"pointer"}}>Browse →</button>
          </div>
          {recentSessions.length === 0 ? (
            <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>No sessions yet — start your first one!</div>
          ) : recentSessions.map((h,i)=>(
            <div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<recentSessions.length-1?`1px solid ${C.border}`:"none"}}>
              <ScoreRing score={h.score} size={44} stroke={4}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,lineHeight:1.3}}>{h.materialTitle}</div>
                <div style={{fontSize:12,color:C.muted}}>
                  {new Date(h.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {h.devPointsCount} Dev Points
                </div>
              </div>
              <button onClick={()=>onStart(MATERIALS.find(m=>m.id===h.materialId)||MATERIALS[0])} style={{padding:"5px 12px",borderRadius:8,background:C.surface2,border:`1px solid ${C.border}`,color:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>Retry</button>
            </div>
          ))}
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:16}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🏅 Badges</div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {[
              {icon:"🔥",label:"7-Day Streak",earned:true},
              {icon:"⭐",label:"First 90+",   earned:true},
              {icon:"🦉",label:"Night Owl",   earned:false},
              {icon:"⚡",label:"Speed Master",earned:false},
              {icon:"🌍",label:"Global Voice",earned:false},
            ].map(b=>(
              <div key={b.label} style={{textAlign:"center",opacity:b.earned?1:0.3,filter:b.earned?"none":"grayscale(1)"}}>
                <div style={{fontSize:28}}>{b.icon}</div>
                <div style={{fontSize:10,color:C.muted,maxWidth:54,marginTop:2,lineHeight:1.3}}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MATERIALS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function MaterialsPage({ onStart }) {
  const [sessions] = useState(loadSessions);
  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:C.bg,color:C.text,padding:"20px",maxWidth:640,margin:"0 auto",paddingBottom:80}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:4}}>📺 TED Talks</div>
      <div style={{fontSize:14,color:C.muted,marginBottom:20}}>Native audio · Curated for business English</div>
      {MATERIALS.map(mat=>{
        const devCount = mat.sentences.flatMap(s=>s.words).filter(w=>w.devPoint).length;
        const lvColor = mat.level==="C1"?C.pink:C.accent;
        const lastSession = sessions.find(s=>s.materialId===mat.id);
        return (
          <div key={mat.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:18,marginBottom:12,cursor:"pointer",transition:"border-color 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#38BDF840"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
            onClick={()=>onStart(mat)}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:50,height:50,borderRadius:10,flexShrink:0,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",letterSpacing:-1}}>TED</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:`${lvColor}20`,color:lvColor}}>{mat.level}</span>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:C.surface2,color:C.muted}}>{mat.theme}</span>
                  <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#E62B1E18",color:"#F87171"}}>🔥 {devCount} Dev Points</span>
                  {lastSession&&<span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:"#4ADE8018",color:C.green}}>Last: {lastSession.score}</span>}
                </div>
                <div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{mat.title}</div>
                <div style={{fontSize:13,color:C.muted}}>{mat.speaker}</div>
                {lastSession&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>Last practiced: {new Date(lastSession.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                {lastSession&&<ScoreRing score={lastSession.score} size={40} stroke={4}/>}
                <button onClick={e=>{e.stopPropagation();onStart(mat);}} style={{padding:"8px 16px",borderRadius:8,background:C.accent,color:"#fff",fontWeight:700,fontSize:13,border:"none",cursor:"pointer",flexShrink:0}}>
                  {lastSession?"Retry":"Start →"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ReviewPage({ onStart }) {
  const [filter, setFilter]       = useState("all");
  const [drillWord, setDrillWord] = useState(null);
  const [drillMat, setDrillMat]   = useState(null);
  const [sessions]                = useState(loadSessions);
  const practicedIds = new Set(sessions.map(s=>s.materialId));
  const allItems = MATERIALS.flatMap(mat=>mat.sentences.flatMap(sent=>sent.words.filter(w=>w.devPoint).map(w=>({word:w,material:mat,sent}))));
  const filtered = filter==="all"?allItems:allItems.filter(item=>item.word.devPoint.type===filter);
  const grouped = filtered.reduce((acc,item)=>{
    const k=item.material.id;
    if(!acc[k]) acc[k]={material:item.material,items:[]};
    acc[k].items.push(item);
    return acc;
  },{});
  const filterTabs=[["all","All"],["rhythm","〰 Rhythm"],["stress","↑ Stress"],["linking","⟿ Linking"],["hesitation","⏸ Flow"]];

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:C.bg,color:C.text,paddingBottom:80}}>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(10,14,26,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{fontWeight:900,fontSize:18}}>Review</div>
        <div style={{fontSize:12,color:C.muted,marginTop:2}}>Filter Dev Points for focused practice</div>
      </div>
      <div style={{display:"flex",gap:12,padding:"12px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`}}>
        {[{label:"Dev Points",value:allItems.length,color:C.accent},{label:"Practiced",value:practicedIds.size,color:C.green},{label:"Sessions",value:sessions.length,color:C.amber}].map(s=>(
          <div key={s.label} style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.value}</div>
            <div style={{fontSize:10,color:C.muted}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,padding:"12px 20px",overflowX:"auto",borderBottom:`1px solid ${C.border}`}}>
        {filterTabs.map(([key,label])=>(
          <button key={key} onClick={()=>setFilter(key)} style={{padding:"6px 14px",borderRadius:20,fontWeight:700,fontSize:12,background:filter===key?C.accent:C.surface2,color:filter===key?"#fff":C.muted,border:`1px solid ${filter===key?C.accent:C.border}`,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{label}</button>
        ))}
      </div>
      <div style={{padding:"16px 20px"}}>
        {Object.values(grouped).map(({material,items})=>(
          <div key={material.id} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:32,height:32,borderRadius:6,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:10,color:"#fff",flexShrink:0}}>TED</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{material.title}</div>
                <div style={{fontSize:11,color:C.muted}}>{material.speaker}</div>
              </div>
              {practicedIds.has(material.id)
                ?<span style={{background:"#4ADE8018",color:C.green,padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:700}}>✓ Done</span>
                :<button onClick={()=>onStart(material)} style={{padding:"4px 10px",borderRadius:8,background:C.accent,color:"#fff",fontSize:11,fontWeight:700,border:"none",cursor:"pointer"}}>Start →</button>}
            </div>
            {items.map((item,i)=>{
              const cat=DEV_TYPE[item.word.devPoint.type];
              return (
                <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <span style={{background:cat.bg,color:cat.color,padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{cat.icon} {cat.label}</span>
                      <div style={{fontWeight:800,fontSize:17,color:"#FCA5A5",marginTop:4}}>"{item.word.w.replace(/[',]/g,"")}"</div>
                    </div>
                    <button onClick={()=>{setDrillWord(item.word);setDrillMat(item.material);}} style={{padding:"7px 12px",borderRadius:10,background:cat.bg,color:cat.color,border:`1px solid ${cat.color}40`,fontWeight:700,fontSize:12,cursor:"pointer",flexShrink:0}}>🔁 Drill</button>
                  </div>
                  <p style={{fontFamily:"'Noto Serif',Georgia,serif",fontSize:13,lineHeight:1.7,color:C.muted,marginBottom:8}}>
                    {item.sent.words.map((w,wi)=>(
                      <span key={wi}><span style={{background:w===item.word?"#7F1D1D40":"transparent",color:w===item.word?"#FCA5A5":C.muted,fontWeight:w===item.word?700:400,borderRadius:3,padding:w===item.word?"0 2px":0}}>{w.w}</span>{" "}</span>
                    ))}
                  </p>
                  <div style={{background:C.surface2,borderLeft:`3px solid ${cat.color}`,padding:"9px 12px",borderRadius:8,fontSize:12,color:C.text,lineHeight:1.6}}>💡 {item.word.devPoint.note}</div>
                </div>
              );
            })}
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><div style={{fontSize:40,marginBottom:12}}>🔍</div><div>No Dev Points match this filter.</div></div>}
      </div>
      {drillWord&&drillMat&&<DrillModal word={drillWord} material={drillMat} onClose={()=>{setDrillWord(null);setDrillMat(null);}}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS PAGE  (Daily Podcast — API-driven)
// ─────────────────────────────────────────────────────────────────────────────

// Split script into sentences for sentence-level playback progress
function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function EpisodePlayer({ episode, onBack }) {
  const cat   = EP_COLOR[episode.id] || { color: C.purple, bg: `${C.purple}18`, label: episode.topic, icon: "📻" };
  const sents = splitSentences(episode.script);

  const [isPlaying,   setIsPlaying]   = useState(false);
  const [sentIdx,     setSentIdx]     = useState(-1);
  const stopRef  = useRef(false);
  const scrollRef = useRef(null);
  const sentRefs  = useRef({});

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  function stop() {
    window.speechSynthesis.cancel();
    stopRef.current = true;
    setIsPlaying(false);
    setSentIdx(-1);
  }

  function play(fromIdx = 0) {
    window.speechSynthesis.cancel();
    stopRef.current = false;
    setIsPlaying(true);
    const voice = getEnglishVoice();

    function speakSent(i) {
      if (stopRef.current || i >= sents.length) {
        setIsPlaying(false); setSentIdx(-1); return;
      }
      setSentIdx(i);
      // Scroll active sentence into view
      const el = sentRefs.current[i];
      if (el && scrollRef.current) {
        scrollRef.current.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
      }
      const utter = new SpeechSynthesisUtterance(sents[i]);
      utter.lang = "en-US"; utter.rate = 0.94;
      if (voice) utter.voice = voice;
      utter.onend = () => speakSent(i + 1);
      window.speechSynthesis.speak(utter);
    }
    speakSent(fromIdx);
  }

  const pct = sentIdx < 0 ? 0 : Math.round(((sentIdx + 1) / sents.length) * 100);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(10,14,26,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>{stop();onBack();}} style={{background:"none",border:"none",fontSize:20,color:C.muted,cursor:"pointer",lineHeight:1}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:15}}>{episode.title}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:1}}>
            {cat.icon} {cat.label} · ~{episode.durationMin} min · {episode.wordCount} words
          </div>
        </div>
      </div>

      {/* Script scroll area */}
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"24px 22px 16px"}}>
        {/* Story headlines */}
        {episode.stories?.length > 0 && (
          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Today's Stories</div>
            {episode.stories.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:20,height:20,borderRadius:4,background:cat.bg,border:`1px solid ${cat.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:cat.color,flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,lineHeight:1.4}}>{s.title}</div>
                  {s.link&&<a href={s.link} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.accent,fontWeight:600,textDecoration:"none"}}>Read more ↗</a>}
                </div>
              </div>
            ))}
            <div style={{height:1,background:C.border,margin:"16px 0"}}/>
          </div>
        )}

        {/* Script sentences */}
        <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Script</div>
        {sents.map((s, i) => {
          const isAct = i === sentIdx;
          const isPast = i < sentIdx;
          return (
            <div key={i} ref={el => sentRefs.current[i] = el}
              style={{
                marginBottom:14, padding:"10px 14px", borderRadius:10,
                background:isAct?`${cat.color}18`:"transparent",
                border:`1px solid ${isAct?cat.color:isAct?"transparent":"transparent"}`,
                opacity:isPast?0.3:1,
                transition:"all 0.3s",
                cursor:"pointer",
              }}
              onClick={() => { if (!isPlaying) play(i); }}
            >
              <p style={{
                fontFamily:"'Noto Serif',Georgia,serif",
                fontSize:17, lineHeight:1.85, fontWeight:400,
                color:isAct?cat.color:C.text, margin:0,
                transition:"color 0.3s",
              }}>{s}</p>
            </div>
          );
        })}
        <div style={{height:160}}/>
      </div>

      {/* Player bar */}
      <div style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"10px 20px 16px",paddingBottom:"calc(16px + env(safe-area-inset-bottom))"}}>
        {/* Progress */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:11,color:C.muted,minWidth:28}}>{sentIdx<0?0:sentIdx+1}/{sents.length}</span>
          <div style={{flex:1,height:3,background:C.border,borderRadius:2,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",background:cat.color,borderRadius:2,transition:"width 0.4s ease"}}/>
          </div>
          <span style={{fontSize:11,color:C.muted,minWidth:28,textAlign:"right"}}>{pct}%</span>
        </div>

        {/* Controls */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
          <button onClick={()=>{stop();setSentIdx(-1);}} style={{width:40,height:40,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",fontSize:16}}>⏮</button>
          <button
            onClick={() => isPlaying ? stop() : play(Math.max(0, sentIdx))}
            style={{
              width:64,height:64,borderRadius:"50%",border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,${cat.color},${cat.color}CC)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 4px 24px ${cat.color}40`,
            }}>
            {isPlaying
              ? <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><rect x="3" y="2" width="5" height="16" rx="1.5"/><rect x="12" y="2" width="5" height="16" rx="1.5"/></svg>
              : <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M4 2l14 8-14 8V2z"/></svg>}
          </button>
          <button onClick={()=>{const next=Math.min(sents.length-1,(sentIdx<0?0:sentIdx)+1);if(isPlaying){stop();setTimeout(()=>play(next),80);}else setSentIdx(next);}} style={{width:40,height:40,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",fontSize:16}}>⏭</button>
        </div>

        {isPlaying && (
          <div style={{textAlign:"center",marginTop:10,fontSize:11,color:cat.color,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{display:"flex",gap:2,alignItems:"flex-end",height:12}}>
              {[0,1,2,3].map(j=>(
                <span key={j} style={{display:"inline-block",width:2.5,background:cat.color,borderRadius:1,animation:`soundbar 0.8s ease-in-out ${j*0.15}s infinite`}}/>
              ))}
            </span>
            Now playing — tap any sentence to jump
          </div>
        )}
      </div>
    </div>
  );
}

function NewsPage() {
  const [episodes,    setEpisodes]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [configured,  setConfigured]  = useState(true);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [activeEp,    setActiveEp]    = useState(null);

  useEffect(() => {
    fetch("/api/podcast")
      .then(r => r.json())
      .then(data => {
        if (data.episodes?.length) setEpisodes(data.episodes);
        if (data.generatedAt)      setGeneratedAt(new Date(data.generatedAt));
        if (data.configured === false) setConfigured(false);
      })
      .catch(() => setConfigured(false))
      .finally(() => setLoading(false));
  }, []);

  if (activeEp) return <EpisodePlayer episode={activeEp} onBack={() => setActiveEp(null)}/>;

  const today = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:C.bg,color:C.text,paddingBottom:80}}>
      <style>{`
        @keyframes soundbar{0%,100%{height:4px}50%{height:18px}}
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      `}</style>

      {/* Header */}
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(10,14,26,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{fontWeight:900,fontSize:18}}>Daily Briefing</div>
        <div style={{fontSize:12,color:C.muted,marginTop:2}}>
          {today}
          {generatedAt && (
            <span style={{marginLeft:8,color:C.green}}>
              ✓ Generated {generatedAt.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{textAlign:"center",padding:"80px 20px",color:C.muted}}>
          <div style={{display:"flex",gap:4,justifyContent:"center",alignItems:"flex-end",height:30,marginBottom:14}}>
            {[0,1,2,3,4].map(j=>(
              <div key={j} style={{width:5,background:C.purple,borderRadius:3,animation:`soundbar 1s ease-in-out ${j*0.12}s infinite`}}/>
            ))}
          </div>
          <div style={{fontWeight:600}}>Loading today's briefing…</div>
        </div>
      )}

      {/* Not configured */}
      {!loading && !configured && (
        <div style={{padding:"32px 24px",maxWidth:560,margin:"0 auto"}}>
          <div style={{background:"linear-gradient(135deg,#120D2A,#1A1040)",border:`1px solid ${C.purple}40`,borderRadius:20,padding:24,marginBottom:20}}>
            <div style={{fontSize:28,marginBottom:12}}>🎙️</div>
            <div style={{fontWeight:800,fontSize:17,marginBottom:8}}>Daily Briefing Setup</div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:16}}>
              Every morning at 6:00 AM JST, a Vercel cron job fetches today's news and generates three 3-minute podcast episodes — one each for World, Business, and Tech.
            </div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.8}}>
              To enable it, add these environment variables in your <strong style={{color:C.text}}>Vercel project settings</strong>:
            </div>
            {[
              ["JSONBIN_BIN_ID",  "Your bin ID from jsonbin.io (free account)"],
              ["JSONBIN_API_KEY", "Your master key from jsonbin.io"],
              ["CRON_SECRET",     "Any random string — protects manual triggers"],
              ["ANTHROPIC_API_KEY","(Optional) For AI-quality podcast scripts"],
            ].map(([key, desc]) => (
              <div key={key} style={{marginTop:10,background:C.surface2,borderRadius:10,padding:"10px 14px"}}>
                <code style={{fontSize:12,color:C.accent,fontWeight:700}}>{key}</code>
                <div style={{fontSize:11,color:C.muted,marginTop:3}}>{desc}</div>
              </div>
            ))}
            <div style={{marginTop:16,fontSize:12,color:C.muted,lineHeight:1.7}}>
              Then trigger the first generation manually:<br/>
              <code style={{fontSize:11,color:C.green,background:C.surface2,padding:"2px 8px",borderRadius:4}}>
                POST /api/generate-podcast + Authorization: Bearer &lt;CRON_SECRET&gt;
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Episode cards */}
      {!loading && episodes.length > 0 && (
        <div style={{padding:"16px 20px",animation:"fadein 0.4s ease"}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>
            Today's Episodes · 3 min each
          </div>
          {episodes.map((ep, i) => {
            const cat = EP_COLOR[ep.id] || { color:C.purple, bg:`${C.purple}18`, label:ep.topic, icon:"📻" };
            return (
              <div key={ep.id} onClick={() => setActiveEp(ep)} style={{
                background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,
                padding:20,marginBottom:12,cursor:"pointer",
                transition:"border-color 0.2s, transform 0.15s",
                animation:`fadein 0.4s ease ${i*0.08}s both`,
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=cat.color+"60";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}
              >
                <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                  {/* Icon */}
                  <div style={{
                    width:52,height:52,borderRadius:14,flexShrink:0,
                    background:cat.bg,border:`1px solid ${cat.color}40`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                  }}>{cat.icon}</div>

                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:cat.bg,color:cat.color}}>{cat.label}</span>
                      <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:C.surface2,color:C.muted}}>
                        ~{ep.durationMin} min
                      </span>
                      <span style={{padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:C.surface2,color:C.muted}}>
                        {ep.stories?.length || 0} stories
                      </span>
                    </div>
                    <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{ep.title}</div>
                    <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>
                      {ep.stories?.slice(0,2).map(s=>s.title).join(" · ")}
                    </div>
                  </div>

                  {/* Play arrow */}
                  <div style={{
                    width:36,height:36,borderRadius:"50%",flexShrink:0,
                    background:cat.bg,border:`1px solid ${cat.color}40`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:cat.color,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1l9 6-9 6V1z"/></svg>
                  </div>
                </div>

                {/* Waveform preview */}
                <div style={{display:"flex",gap:2,alignItems:"flex-end",height:16,marginTop:14,paddingLeft:66}}>
                  {Array.from({length:32},(_,j)=>Math.abs(Math.sin(j*0.45+i))*0.8+0.2).map((h,j)=>(
                    <div key={j} style={{flex:1,height:`${h*100}%`,background:`${cat.color}40`,borderRadius:1}}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWING PLAYER
// ─────────────────────────────────────────────────────────────────────────────
function ShadowingPlayer({ material, onFinish }) {
  const [mode, setMode]           = useState("shadow");
  const [isActive, setIsActive]   = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeSentIdx, setActiveSentIdx] = useState(0);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [devPopup, setDevPopup]   = useState(null);
  const [sessionDone, setSessionDone] = useState(false);

  const timerRef     = useRef(null);
  const containerRef = useRef(null);
  const sentRefs     = useRef({});
  const sessionScore = useRef(Math.floor(65 + Math.random() * 30)).current;
  const totalMs      = material.sentences.reduce((a,s)=>a+s.durationMs,0);

  useEffect(()=>{
    if(window.speechSynthesis.getVoices().length===0)
      window.speechSynthesis.addEventListener("voiceschanged",()=>{},{once:true});
  },[]);

  const charMaps = useRef([]);
  useEffect(()=>{
    charMaps.current = material.sentences.map(sent=>{
      const pos=[]; let p=0;
      sent.words.forEach(w=>{ pos.push(p); p+=w.w.length+1; });
      return pos;
    });
  },[material]);

  const stopAll = useCallback(()=>{ clearInterval(timerRef.current); window.speechSynthesis.cancel(); },[]);

  const getSentAt = useCallback((ms)=>{
    let acc=0;
    for(let i=0;i<material.sentences.length;i++){
      if(acc+material.sentences[i].durationMs>ms) return {sentIdx:i,sentStartMs:acc};
      acc+=material.sentences[i].durationMs;
    }
    const last=material.sentences.length-1;
    return {sentIdx:last,sentStartMs:totalMs-material.sentences[last].durationMs};
  },[material,totalMs]);

  const startProgressTimer = useCallback((fromMs)=>{
    clearInterval(timerRef.current);
    const base=Date.now()-fromMs;
    timerRef.current=setInterval(()=>{
      const now=Date.now()-base;
      if(now>=totalMs){ setElapsedMs(totalMs); clearInterval(timerRef.current); }
      else setElapsedMs(now);
    },80);
  },[totalMs]);

  const speakFrom = useCallback((sentIdx)=>{
    window.speechSynthesis.cancel();
    const voice=getEnglishVoice();
    material.sentences.slice(sentIdx).forEach((sent,offset)=>{
      const si=sentIdx+offset;
      const text=sent.words.map(w=>w.w).join(" ");
      const utter=new SpeechSynthesisUtterance(text);
      utter.lang="en-US"; utter.rate=0.95;
      if(voice) utter.voice=voice;
      utter.onboundary=(e)=>{
        if(e.name!=="word") return;
        const pos=charMaps.current[si]||[];
        let wi=0;
        for(let j=0;j<pos.length;j++){ if(pos[j]<=e.charIndex) wi=j; else break; }
        setActiveSentIdx(si); setActiveWordIdx(wi);
        const el=sentRefs.current[si];
        if(el&&containerRef.current) containerRef.current.scrollTo({top:el.offsetTop-130,behavior:"smooth"});
      };
      utter.onend=()=>{
        setActiveWordIdx(-1);
        if(si===material.sentences.length-1){ clearInterval(timerRef.current); setIsActive(false); setSessionDone(true); }
      };
      window.speechSynthesis.speak(utter);
    });
  },[material]);

  useEffect(()=>()=>stopAll(),[stopAll]);

  const toggle=()=>{
    if(isActive){ stopAll(); setIsActive(false); }
    else{ const {sentIdx,sentStartMs}=getSentAt(elapsedMs); setIsActive(true); speakFrom(sentIdx); startProgressTimer(sentStartMs); }
  };
  const reset=()=>{ stopAll(); setIsActive(false); setElapsedMs(0); setActiveSentIdx(0); setActiveWordIdx(-1); setSessionDone(false); containerRef.current?.scrollTo({top:0}); };
  const seek=(delta)=>{
    const next=Math.max(0,Math.min(totalMs,elapsedMs+delta));
    const {sentIdx,sentStartMs}=getSentAt(next);
    setElapsedMs(sentStartMs);
    if(isActive){ speakFrom(sentIdx); startProgressTimer(sentStartMs); }
  };

  const pct=Math.min(100,(elapsedMs/totalMs)*100);
  const fmt=ms=>{ const s=Math.floor(ms/1000); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; };
  const allDevPoints=material.sentences.flatMap(s=>s.words.filter(w=>w.devPoint));

  if(sessionDone) return <SessionResult material={material} devPoints={allDevPoints} score={sessionScore} onRetry={reset} onFinish={onFinish}/>;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Noto+Serif:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1E2D45;border-radius:2px}
        @keyframes recpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
      `}</style>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg,position:"sticky",top:0,zIndex:40}}>
        <button onClick={()=>{stopAll();onFinish();}} style={{background:"none",border:"none",fontSize:22,color:C.muted,cursor:"pointer"}}>✕</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:15}}>{material.title}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:1}}>{material.speaker} · TED</div>
        </div>
        <a href={material.tedUrl} target="_blank" rel="noreferrer" style={{background:C.red,color:"#fff",fontWeight:800,fontSize:11,padding:"4px 10px",borderRadius:6,letterSpacing:-0.5,textDecoration:"none"}}>TED ↗</a>
      </div>

      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        {[["shadow","Shadow"],["record","Record"]].map(([m,label])=>(
          <button key={m} onClick={()=>{setMode(m);reset();}} style={{flex:1,padding:"10px 0",fontWeight:700,fontSize:14,border:"none",cursor:"pointer",background:"transparent",color:mode===m?C.accent:C.muted,borderBottom:mode===m?`2px solid ${C.accent}`:"2px solid transparent"}}>{label}</button>
        ))}
      </div>

      <div style={{padding:"8px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`}}>
        {mode==="shadow"
          ?<div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{background:"#FBBF2418",color:C.amber,padding:"2px 8px",borderRadius:12,fontWeight:700}}>Shadow Mode</span>Speak along with the audio. Tap <span style={{color:"#F87171"}}>red words</span> for coaching tips.</div>
          :<div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{background:"#F4728B18",color:C.pink,padding:"2px 8px",borderRadius:12,fontWeight:700}}>Record Mode</span>One tap starts <strong style={{color:C.text}}>audio + recording</strong> simultaneously.</div>}
      </div>

      <div ref={containerRef} style={{flex:1,overflowY:"auto",padding:"24px 22px 16px"}}>
        {material.sentences.map((sent,si)=>{
          const isPast=si<activeSentIdx;
          return (
            <div key={sent.id} ref={el=>sentRefs.current[si]=el} style={{marginBottom:28,opacity:isPast?0.28:1,transition:"opacity 0.4s"}}>
              <p style={{fontFamily:"'Noto Serif',Georgia,serif",fontSize:24,lineHeight:1.9,fontWeight:400,color:C.text}}>
                {sent.words.map((word,wi)=>{
                  const isAct=si===activeSentIdx&&wi===activeWordIdx, hasDev=!!word.devPoint;
                  return (
                    <span key={wi}>
                      <span onClick={hasDev?(e)=>{setDevPopup({word,rect:e.currentTarget.getBoundingClientRect()});}:undefined}
                        style={{background:isAct?"#1E40AF":hasDev?"#7F1D1D30":"transparent",color:isAct?"#BFDBFE":hasDev?"#FCA5A5":C.text,fontWeight:isAct?700:400,borderRadius:4,padding:(isAct||hasDev)?"1px 3px":"1px 0",boxShadow:isAct?`0 0 0 2px #3B82F6`:"none",cursor:hasDev?"pointer":"default",transition:"all 0.1s",textDecoration:hasDev?"underline dotted #EF4444":"none",textDecorationThickness:hasDev?"1.5px":"0",textUnderlineOffset:"3px"}}
                      >{word.w}</span>{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}
        <div style={{height:140}}/>
      </div>

      {devPopup&&(
        <>
          <div style={{position:"fixed",inset:0,zIndex:60}} onClick={()=>setDevPopup(null)}/>
          <div style={{position:"fixed",bottom:210,left:"50%",transform:"translateX(-50%)",width:"min(360px,90vw)",background:C.surface2,border:"1px solid #7F1D1D60",borderRadius:16,padding:18,zIndex:70,boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{background:"#DC2626",color:"#fff",borderRadius:20,padding:"3px 10px",fontWeight:800,fontSize:12}}>🔥 Dev Point</div>
              {devPopup.word.devPoint&&<div style={{padding:"3px 8px",borderRadius:10,fontSize:11,fontWeight:700,background:DEV_TYPE[devPopup.word.devPoint.type].bg,color:DEV_TYPE[devPopup.word.devPoint.type].color}}>{DEV_TYPE[devPopup.word.devPoint.type].icon} {DEV_TYPE[devPopup.word.devPoint.type].label}</div>}
            </div>
            <div style={{fontWeight:800,fontSize:17,marginBottom:8,color:"#FCA5A5"}}>"{devPopup.word.w.replace(/[',]/g,"")}"</div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{devPopup.word.devPoint.note}</div>
            <button onClick={()=>setDevPopup(null)} style={{marginTop:12,width:"100%",padding:"8px",borderRadius:8,background:"#7F1D1D40",border:"none",color:"#FCA5A5",fontWeight:700,fontSize:13,cursor:"pointer"}}>Close</button>
          </div>
        </>
      )}

      <div style={{background:C.bg,borderTop:`1px solid ${C.border}`,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {mode==="record"&&isActive&&(
          <div style={{margin:"8px 20px 0",padding:"8px 14px",borderRadius:10,background:"#7F1D1D30",border:"1px solid #DC262640",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:"#DC2626",animation:"recpulse 1s ease-in-out infinite",flexShrink:0}}/>
            <span style={{fontSize:12,fontWeight:700,color:"#FCA5A5"}}>Recording</span>
            <div style={{flex:1,height:3,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"#DC2626",transition:"width 0.1s"}}/></div>
          </div>
        )}
        <div style={{padding:"10px 20px 4px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:12,color:C.muted,minWidth:36}}>{fmt(elapsedMs)}</span>
          <div style={{flex:1,height:4,background:C.border,borderRadius:2,cursor:"pointer",position:"relative"}}
            onClick={e=>{
              const rect=e.currentTarget.getBoundingClientRect();
              const next=Math.floor(((e.clientX-rect.left)/rect.width)*totalMs);
              const {sentIdx,sentStartMs}=getSentAt(next);
              setElapsedMs(sentStartMs);
              if(isActive){ speakFrom(sentIdx); startProgressTimer(sentStartMs); }
            }}>
            <div style={{width:`${pct}%`,height:"100%",background:C.accent,borderRadius:2}}/>
            <div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",width:12,height:12,borderRadius:"50%",background:C.accent,boxShadow:`0 0 0 3px ${C.accentDk}50`}}/>
          </div>
          <span style={{fontSize:12,color:C.muted,minWidth:40,textAlign:"right"}}>-{fmt(totalMs-elapsedMs)}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,padding:"6px 20px 16px"}}>
          <button onClick={()=>seek(-3000)} style={{width:44,height:44,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",fontSize:13,fontWeight:700}}>-3</button>
          {mode==="shadow"
            ?<button onClick={toggle} style={{width:66,height:66,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accentDk})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px rgba(56,189,248,0.35)`}}>
              {isActive?<svg width="22" height="22" viewBox="0 0 22 22" fill="white"><rect x="3" y="2" width="6" height="18" rx="1.5"/><rect x="13" y="2" width="6" height="18" rx="1.5"/></svg>:<svg width="22" height="22" viewBox="0 0 22 22" fill="white"><path d="M5 3l14 8-14 8V3z"/></svg>}
            </button>
            :<button onClick={toggle} style={{width:72,height:72,borderRadius:"50%",background:isActive?"#DC2626":"linear-gradient(135deg,#DC2626,#9B1C1C)",border:isActive?"3px solid #FCA5A5":"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isActive?"0 4px 24px rgba(220,38,38,0.5)":"0 4px 24px rgba(220,38,38,0.25)",transition:"all 0.2s"}}>
              {isActive?<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>:<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2" opacity="0.5"/></svg>}
            </button>}
          <button onClick={()=>seek(3000)} style={{width:44,height:44,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",fontSize:13,fontWeight:700}}>+3</button>
        </div>
        {mode==="record"&&<div style={{textAlign:"center",paddingBottom:8,fontSize:12,color:isActive?"#FCA5A5":C.muted,fontWeight:600}}>{isActive?"● Recording — tap to stop":"🎙️ Tap to start audio + recording"}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION RESULT
// ─────────────────────────────────────────────────────────────────────────────
function SessionResult({ material, devPoints, score, onRetry, onFinish }) {
  const [drillWord, setDrillWord] = useState(null);
  const [prevSession, setPrevSession] = useState(null);
  const grouped = {};
  devPoints.forEach(w=>{ const t=w.devPoint.type; if(!grouped[t])grouped[t]=[]; grouped[t].push(w); });

  useEffect(()=>{
    const prev=getLastSession(material.id);
    setPrevSession(prev);
    saveSession({ id:`sess_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, materialId:material.id, materialTitle:material.title, speaker:material.speaker, date:new Date().toISOString(), score, devPointsCount:devPoints.length });
  },[]);

  const diff  = prevSession ? score - prevSession.score : null;
  const label = score>=85?"Excellent! 🎉":score>=75?"Good Progress 👍":score>=65?"Keep Going 💪":"Practice More 📚";

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}>
        <button onClick={onFinish} style={{background:"none",border:"none",fontSize:16,color:C.muted,cursor:"pointer",fontWeight:700}}>← Back</button>
        <div style={{fontWeight:800,fontSize:15}}>Session Result</div>
        <div style={{width:60}}/>
      </div>
      <div style={{padding:"20px",maxWidth:600,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#0F1D35,#162844)",border:"1px solid #1E3A5F",borderRadius:20,padding:24,marginBottom:16,display:"flex",alignItems:"center",gap:20}}>
          <ScoreRing score={score} size={88} stroke={7}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Total Score</div>
            <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>{label}</div>
            {prevSession
              ?<div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:C.muted}}>Last: {prevSession.score}</span>
                <span style={{fontSize:13,fontWeight:800,color:diff>0?C.green:diff<0?"#F87171":C.muted,background:diff>0?"#4ADE8018":diff<0?"#F8717118":"transparent",padding:"2px 8px",borderRadius:10}}>
                  {diff>0?`+${diff}`:diff<0?`${diff}`:"→"} {diff!==0?"pts":"no change"}
                </span>
              </div>
              :<div style={{fontSize:12,color:C.muted}}>First Session! 🎊</div>}
            <div style={{fontSize:13,color:C.accent,marginTop:4}}>{devPoints.length} coaching points</div>
          </div>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",marginBottom:16}}>
          <div style={{padding:"16px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>🔬</span>
            <div>
              <div style={{fontWeight:800,fontSize:16}}>Development Points</div>
              <div style={{fontSize:12,color:C.muted,marginTop:1}}>Work on these to sound more natural</div>
            </div>
            <div style={{marginLeft:"auto",padding:"4px 10px",borderRadius:20,background:"#DC262620",color:"#F87171",fontSize:12,fontWeight:700}}>{devPoints.length} points</div>
          </div>
          {Object.entries(grouped).map(([type,words])=>{
            const cat=DEV_TYPE[type];
            return (
              <div key={type} style={{borderBottom:`1px solid ${C.border}`}}>
                <div style={{padding:"10px 18px",background:cat.bg,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>{cat.icon}</span>
                  <span style={{fontWeight:800,color:cat.color,fontSize:13}}>{cat.label}</span>
                  <span style={{fontSize:11,color:C.muted}}>({words.length})</span>
                </div>
                {words.map((word,i)=>{
                  const sent=material.sentences.find(s=>s.words.some(w=>w===word));
                  return (
                    <div key={i} style={{padding:"14px 18px",borderTop:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        {sent&&<p style={{fontFamily:"'Noto Serif',Georgia,serif",fontSize:14,lineHeight:1.8,marginBottom:8,color:C.muted}}>{sent.words.map((w,wi)=>(
                          <span key={wi}><span style={{background:w===word?"#7F1D1D40":"transparent",color:w===word?"#FCA5A5":C.muted,fontWeight:w===word?700:400,borderRadius:3,padding:w===word?"0 2px":0}}>{w.w}</span>{" "}</span>
                        ))}</p>}
                        <div style={{padding:"9px 12px",borderRadius:10,background:C.surface2,borderLeft:`3px solid ${cat.color}`,fontSize:13,color:C.text,lineHeight:1.6}}>💡 {word.devPoint.note}</div>
                      </div>
                      <button onClick={()=>setDrillWord(word)} style={{padding:"7px 12px",borderRadius:10,background:cat.bg,color:cat.color,border:`1px solid ${cat.color}40`,fontWeight:700,fontSize:12,cursor:"pointer",flexShrink:0}}>🔁 Drill</button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10,marginBottom:40}}>
          <button onClick={onRetry} style={{flex:1,padding:"13px",borderRadius:12,background:C.surface,color:C.text,fontWeight:700,border:`1px solid ${C.border}`,cursor:"pointer",fontSize:14}}>🔁 Try Again</button>
          <button onClick={onFinish} style={{flex:1,padding:"13px",borderRadius:12,background:C.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:14}}>Next →</button>
        </div>
      </div>
      {drillWord&&<DrillModal word={drillWord} material={material} onClose={()=>setDrillWord(null)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DRILL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DrillModal({ word, material, onClose }) {
  const sent=material.sentences.find(s=>s.words.some(w=>w===word));
  const cat=DEV_TYPE[word.devPoint.type];
  const [phase,setPhase]=useState("note");
  const [isPlaying,setIsPlaying]=useState(false);
  const [isActive,setIsActive]=useState(false);
  const [reps,setReps]=useState(0);
  useEffect(()=>()=>window.speechSynthesis.cancel(),[]);

  const speakSentence=(rate=0.9)=>{
    window.speechSynthesis.cancel();
    const utter=new SpeechSynthesisUtterance(sent?.words.map(w=>w.w).join(" ")||"");
    utter.lang="en-US"; utter.rate=rate;
    const v=getEnglishVoice(); if(v)utter.voice=v;
    utter.onend=()=>setIsPlaying(false);
    window.speechSynthesis.speak(utter); setIsPlaying(true);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(6px)"}}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:600,padding:"24px 24px 40px",boxShadow:"0 -20px 60px rgba(0,0,0,0.6)",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
        <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
              <span style={{background:"#DC2626",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:800}}>🔥 Dev Point</span>
              <span style={{background:cat.bg,color:cat.color,padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{cat.icon} {cat.label}</span>
            </div>
            <div style={{fontWeight:800,fontSize:18,color:"#FCA5A5"}}>"{word.w.replace(/[',]/g,"")}"</div>
          </div>
          <button onClick={()=>{window.speechSynthesis.cancel();onClose();}} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",color:C.muted,fontSize:14}}>✕</button>
        </div>
        <div style={{display:"flex",background:C.surface2,borderRadius:10,padding:3,marginBottom:14}}>
          {[["note","Tip"],["listen","Listen"],["shadow","Shadow"],["done","Done"]].map(([ph,label])=>(
            <div key={ph} onClick={()=>setPhase(ph)} style={{flex:1,textAlign:"center",padding:"7px 4px",borderRadius:8,background:phase===ph?C.bg:"transparent",color:phase===ph?C.accent:C.muted,fontWeight:700,fontSize:12,cursor:"pointer"}}>{label}</div>
          ))}
        </div>
        <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
          <p style={{fontFamily:"'Noto Serif',Georgia,serif",fontSize:15,lineHeight:1.8,color:C.text}}>
            {sent?.words.map((w,i)=>(<span key={i}><span style={{background:w===word?"#7F1D1D50":"transparent",color:w===word?"#FCA5A5":C.text,fontWeight:w===word?700:400,borderRadius:3,padding:w===word?"0 2px":0}}>{w.w}</span>{" "}</span>))}
          </p>
        </div>
        {phase==="note"&&(
          <>
            <div style={{background:cat.bg,borderLeft:`3px solid ${cat.color}`,padding:"12px 16px",borderRadius:10,fontSize:14,color:C.text,lineHeight:1.7,marginBottom:14}}>💡 {word.devPoint.note}</div>
            <button onClick={()=>setPhase("listen")} style={{width:"100%",padding:"12px",borderRadius:12,background:C.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:14}}>Next: Listen →</button>
          </>
        )}
        {phase==="listen"&&(
          <>
            <div style={{background:C.surface2,borderRadius:12,padding:14,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              {Array.from({length:20},(_,i)=>Math.abs(Math.sin(i*0.7))*0.7+0.3).map((h,i)=>(<div key={i} style={{width:4,height:`${h*36}px`,borderRadius:2,background:isPlaying?C.accent:C.border,transition:"background 0.2s"}}/>))}
            </div>
            <button onClick={()=>{if(isPlaying){window.speechSynthesis.cancel();setIsPlaying(false);}else speakSentence(0.9);}} style={{width:"100%",padding:"12px",borderRadius:12,background:isPlaying?C.surface2:C.accent,color:isPlaying?C.text:"#fff",fontWeight:700,border:isPlaying?`1px solid ${C.border}`:"none",cursor:"pointer",fontSize:14,marginBottom:10}}>
              {isPlaying?"⏸ Stop":"▶ Listen to Native Audio"}
            </button>
            <button onClick={()=>setPhase("shadow")} style={{width:"100%",padding:"11px",borderRadius:12,background:C.surface2,color:C.muted,fontWeight:700,border:`1px solid ${C.border}`,cursor:"pointer",fontSize:13}}>Start Shadowing →</button>
          </>
        )}
        {phase==="shadow"&&(
          <>
            <div style={{background:C.surface2,borderRadius:12,padding:14,marginBottom:12,border:isActive?`2px solid #DC2626`:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
              {Array.from({length:20}).map((_,i)=>(<div key={i} style={{width:4,height:`${(isActive?Math.abs(Math.sin(i*0.9))*0.7+0.3:0.2)*36}px`,borderRadius:2,background:isActive?"#DC2626":C.border,transition:"height 0.15s"}}/>))}
            </div>
            {reps>0&&<div style={{fontSize:12,color:C.muted,textAlign:"center",marginBottom:8}}>{reps} {reps===1?"rep":"reps"} done</div>}
            <button onClick={()=>{if(isActive){window.speechSynthesis.cancel();setIsActive(false);setReps(r=>r+1);}else{setIsActive(true);speakSentence(0.85);}}} style={{width:"100%",padding:"12px",borderRadius:12,background:isActive?"#7F1D1D40":"#DC2626",color:isActive?"#FCA5A5":"#fff",border:isActive?"1px solid #DC2626":"none",fontWeight:700,cursor:"pointer",fontSize:14,marginBottom:10}}>
              {isActive?"⏹ Stop":"🎙️ Shadow + Record"}
            </button>
            {reps>=1&&<button onClick={()=>setPhase("done")} style={{width:"100%",padding:"11px",borderRadius:12,background:C.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:13}}>Done ✓</button>}
          </>
        )}
        {phase==="done"&&(
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontSize:48,marginBottom:8}}>✅</div>
            <div style={{fontWeight:800,fontSize:18,marginBottom:4}}>Drill Complete!</div>
            <div style={{color:C.muted,fontSize:14,marginBottom:20}}>This phrase has been added to your review queue.</div>
            <button onClick={()=>{window.speechSynthesis.cancel();onClose();}} style={{padding:"12px 32px",borderRadius:12,background:C.accent,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:14}}>Back to Results</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"home",      label:"Home",    Icon:IconHome },
  { id:"materials", label:"TED",     Icon:IconMonitorPlay },
  { id:"review",    label:"Review",  Icon:IconRepeat },
  { id:"news",      label:"Daily",   Icon:IconRadio },
];

export default function App() {
  const [screen,   setScreen]   = useState("home");
  const [material, setMaterial] = useState(null);
  const goStart = mat => { setMaterial(mat); setScreen("player"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Noto+Serif:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;}
      `}</style>

      {screen==="home"      && <HomePage      onStart={goStart} onNav={setScreen}/>}
      {screen==="materials" && <MaterialsPage onStart={goStart}/>}
      {screen==="review"    && <ReviewPage    onStart={goStart}/>}
      {screen==="news"      && <NewsPage/>}
      {screen==="player"    && material && <ShadowingPlayer material={material} onFinish={()=>setScreen("home")}/>}

      {screen!=="player" && (
        <div style={{
          position:"fixed",bottom:0,left:0,right:0,
          background:C.surface,
          borderTop:`1px solid ${C.border}`,
          display:"flex",
          fontFamily:"'DM Sans','Segoe UI',sans-serif",
          zIndex:40,
          paddingBottom:"env(safe-area-inset-bottom)",
        }}>
          {NAV_ITEMS.map(({id,label,Icon})=>{
            const active = screen===id;
            return (
              <button key={id} onClick={()=>setScreen(id)} style={{
                flex:1,padding:"10px 0 12px",background:"none",border:"none",cursor:"pointer",
                color:active?C.accent:C.muted,
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              }}>
                <Icon size={20} color={active?C.accent:C.muted}/>
                <span style={{fontSize:10,fontWeight:active?700:500,letterSpacing:0.2}}>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
