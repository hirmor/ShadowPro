import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const MATERIALS = [
  {
    id: "ted1",
    title: "The Power of Vulnerability",
    speaker: "Brené Brown",
    level: "B2",
    theme: "Leadership",
    tedUrl: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    // Each word has optional devPoint for post-session annotation
    sentences: [
      {
        id: "s1",
        words: [
          { w: "So," }, { w: "I'll" }, { w: "start" }, { w: "with" }, { w: "this:" },
          { w: "a" }, { w: "couple" }, { w: "years" }, { w: "ago," },
          { w: "an" }, { w: "event" }, { w: "planner" }, { w: "called" }, { w: "me" },
          { w: "because" }, { w: "I" }, { w: "was" }, { w: "going" }, { w: "to" },
          { w: "do" }, { w: "a" }, { w: "speaking" }, { w: "event." },
        ],
        durationMs: 5200,
        devPoints: {}, // filled after session
      },
      {
        id: "s2",
        words: [
          { w: "And" }, { w: "she" }, { w: "said," },
          { w: "'I'm" }, { w: "really" },
          { w: "struggling", devPoint: { type: "rhythm", note: "STRUG-gling — 第1音節を強く、2音節目は素早く流す" } },
          { w: "with" }, { w: "how" }, { w: "to" }, { w: "write" }, { w: "about" },
          { w: "you" }, { w: "on" }, { w: "the" }, { w: "little" }, { w: "flyer.'" },
        ],
        durationMs: 4100,
      },
      {
        id: "s3",
        words: [
          { w: "And" }, { w: "I" }, { w: "thought," },
          { w: "'Well," }, { w: "what's" }, { w: "the" }, { w: "struggle?'" },
          { w: "And" }, { w: "she" }, { w: "said," },
          { w: "'Well," }, { w: "I" }, { w: "saw" }, { w: "you" }, { w: "speak," },
          { w: "and" }, { w: "I'm" }, { w: "going" }, { w: "to" }, { w: "call" },
          { w: "you" }, { w: "a" },
          { w: "researcher,", devPoint: { type: "stress", note: "re-SEARCH-er — 第2音節強調。「リサーチャー」ではなく「りSÉÂRcher」" } },
          { w: "I" }, { w: "think,'" },
        ],
        durationMs: 6800,
      },
      {
        id: "s4",
        words: [
          { w: "because" }, { w: "they'll" }, { w: "think" }, { w: "you're" },
          { w: "boring", devPoint: { type: "rhythm", note: "BOR-ing — rを強く巻かずに「ボーリング」に聞こえがち。BÔR-ing と短く切る" } },
          { w: "and" },
          { w: "irrelevant.", devPoint: { type: "stress", note: "ir-REL-e-vant — 第2音節RELを強調。日本人は均等に読みがち" } },
        ],
        durationMs: 2800,
      },
      {
        id: "s5",
        words: [
          { w: "I" }, { w: "was" }, { w: "a" }, { w: "little" }, { w: "—" },
          { w: "I" }, { w: "thought," }, { w: "'Okay.'" }, { w: "And" }, { w: "she" },
          { w: "said," }, { w: "'But" }, { w: "the" }, { w: "thing" }, { w: "I" },
          { w: "liked" }, { w: "about" }, { w: "your" }, { w: "talk" }, { w: "is" },
          { w: "you're" }, { w: "a" },
          { w: "storyteller.'", devPoint: { type: "linking", note: "story-TELL-er — 3音節。'teller' の /l/ をしっかり発音。ストーリーテラーを一息で" } },
        ],
        durationMs: 5600,
      },
      {
        id: "s6",
        words: [
          { w: "So" }, { w: "I" }, { w: "was" }, { w: "like," },
          { w: "'Okay," },
          { w: "let's", devPoint: { type: "hesitation", note: "let's go — /ts/ + /g/ の連音。「レッツ」で止まらず「レッツGO」と一気に続ける" } },
          { w: "go" }, { w: "with" },
          { w: "storyteller.'" },
        ],
        durationMs: 3200,
      },
    ],
  },
  {
    id: "ted2",
    title: "How Great Leaders Inspire Action",
    speaker: "Simon Sinek",
    level: "C1",
    theme: "Presentation",
    tedUrl: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
    sentences: [
      {
        id: "s1",
        words: [
          { w: "How" }, { w: "do" }, { w: "you" }, { w: "explain" },
          { w: "when" }, { w: "things" }, { w: "don't" }, { w: "go" },
          { w: "as" }, { w: "we" }, { w: "assumed?" },
        ],
        durationMs: 3800,
      },
      {
        id: "s2",
        words: [
          { w: "Or" }, { w: "better," }, { w: "how" }, { w: "do" }, { w: "you" },
          { w: "explain" }, { w: "when" }, { w: "others" }, { w: "are" }, { w: "able" },
          { w: "to" }, { w: "achieve" }, { w: "things" }, { w: "that" }, { w: "seem" },
          { w: "to" },
          { w: "defy", devPoint: { type: "stress", note: "de-FY — 第2音節を強く。「デファイ」ではなく短くシャープに「dɪˈfaɪ」" } },
          { w: "all" }, { w: "of" }, { w: "the" },
          { w: "assumptions?", devPoint: { type: "stress", note: "as-SUMP-tions — 第2音節。/p/ を飲み込まず「アSUMPshons」" } },
        ],
        durationMs: 5400,
      },
      {
        id: "s3",
        words: [
          { w: "Year" }, { w: "after" }, { w: "year," }, { w: "after" }, { w: "year," },
          { w: "after" }, { w: "year," }, { w: "they're" }, { w: "more" },
          { w: "innovative", devPoint: { type: "rhythm", note: "in-NO-va-tive — 4音節。日本人は「イノベーティブ」と5音節にしがち。in-NÔ-va-tiv" } },
          { w: "than" }, { w: "all" }, { w: "their" }, { w: "competition." },
        ],
        durationMs: 5100,
      },
    ],
  },
];

const DEV_TYPE = {
  rhythm:     { label: "リズム",   color: "#F472B6", bg: "#F472B615", icon: "〰" },
  stress:     { label: "強勢",     color: "#60A5FA", bg: "#60A5FA15", icon: "↑" },
  hesitation: { label: "言い淀み", color: "#F59E0B", bg: "#F59E0B15", icon: "⏸" },
  linking:    { label: "連音",     color: "#4ADE80", bg: "#4ADE8015", icon: "⟿" },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWING PLAYER — the core screen
// ─────────────────────────────────────────────────────────────────────────────

function ShadowingPlayer({ material, onFinish }) {
  const [mode, setMode]               = useState("shadow"); // shadow | record
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs]     = useState(0);
  const [activeSentIdx, setActiveSentIdx] = useState(0);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [devPopup, setDevPopup]       = useState(null); // { word, rect }
  const [sessionDone, setSessionDone] = useState(false);
  const [scrollTarget, setScrollTarget] = useState(0);

  const timerRef   = useRef(null);
  const startRef   = useRef(0);
  const wordTimers = useRef([]);
  const sentRefs   = useRef({});
  const containerRef = useRef(null);

  // Total duration of all sentences
  const totalMs = material.sentences.reduce((a, s) => a + s.durationMs, 0);

  // Build flat word schedule: [{sentIdx, wordIdx, startMs, endMs}]
  const wordSchedule = useRef([]);
  useEffect(() => {
    const sched = [];
    let t = 0;
    material.sentences.forEach((sent, si) => {
      const wordMs = sent.durationMs / sent.words.length;
      sent.words.forEach((_, wi) => {
        sched.push({ sentIdx: si, wordIdx: wi, startMs: t + wi * wordMs, endMs: t + (wi + 1) * wordMs });
      });
      t += sent.durationMs;
    });
    wordSchedule.current = sched;
  }, [material]);

  const stopAll = useCallback(() => {
    clearInterval(timerRef.current);
    wordTimers.current.forEach(clearTimeout);
    wordTimers.current = [];
  }, []);

  const startPlayback = useCallback(() => {
    stopAll();
    const base = Date.now() - elapsedMs;
    startRef.current = base;
    setIsPlaying(true);

    // Tick elapsed
    timerRef.current = setInterval(() => {
      const now = Date.now() - base;
      setElapsedMs(now);

      // Determine active sentence
      let acc = 0;
      for (let i = 0; i < material.sentences.length; i++) {
        if (now < acc + material.sentences[i].durationMs) {
          setActiveSentIdx(i);
          // Scroll sentence into view
          const el = sentRefs.current[i];
          if (el && containerRef.current) {
            const elTop = el.offsetTop;
            containerRef.current.scrollTo({ top: elTop - 120, behavior: "smooth" });
          }
          break;
        }
        acc += material.sentences[i].durationMs;
      }

      // Determine active word
      const entry = wordSchedule.current.find(e => now >= e.startMs && now < e.endMs);
      if (entry) { setActiveSentIdx(entry.sentIdx); setActiveWordIdx(entry.wordIdx); }
      else setActiveWordIdx(-1);

      if (now >= totalMs) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setSessionDone(true);
        setElapsedMs(totalMs);
        setActiveWordIdx(-1);
      }
    }, 50);
  }, [elapsedMs, material, totalMs, stopAll]);

  const pausePlayback = () => {
    stopAll();
    setIsPlaying(false);
  };

  const resetPlayback = () => {
    stopAll();
    setIsPlaying(false);
    setElapsedMs(0);
    setActiveSentIdx(0);
    setActiveWordIdx(-1);
    setSessionDone(false);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0 });
  };

  const rewind3s = () => {
    const next = Math.max(0, elapsedMs - 3000);
    setElapsedMs(next);
    if (isPlaying) { stopAll(); setTimeout(() => startPlayback(), 10); }
  };

  const forward3s = () => {
    const next = Math.min(totalMs, elapsedMs + 3000);
    setElapsedMs(next);
    if (isPlaying) { stopAll(); setTimeout(() => startPlayback(), 10); }
  };

  const handleWordTap = (word, e) => {
    if (!word.devPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDevPopup({ word, rect });
  };

  const progressPct = Math.min(100, (elapsedMs / totalMs) * 100);
  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  };
  const remaining = totalMs - elapsedMs;

  // Collect all dev points in material
  const allDevPoints = material.sentences.flatMap(s =>
    s.words.filter(w => w.devPoint).map(w => ({ ...w }))
  );

  if (sessionDone) {
    return <SessionResult material={material} devPoints={allDevPoints} onRetry={resetPlayback} onFinish={onFinish} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#FAFAF8", color: "#1A1A1A", fontFamily: "'Noto Serif', 'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 2px; }
        .word-chip { display: inline; cursor: default; border-radius: 4px; padding: 1px 0; transition: background 0.15s; }
        .word-chip.has-dev { cursor: pointer; }
        .word-chip.has-dev:hover { opacity: 0.85; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", borderBottom: "1px solid #E5E7EB",
        background: "#FAFAF8", position: "sticky", top: 0, zIndex: 40,
      }}>
        <button onClick={onFinish} style={{ background: "none", border: "none", fontSize: 22, color: "#9CA3AF", cursor: "pointer" }}>✕</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15 }}>{material.title}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{material.speaker} · TED</div>
        </div>
        <a href={material.tedUrl} target="_blank" rel="noreferrer" style={{
          background: "#E62B1E", color: "#fff", fontWeight: 800, fontSize: 11,
          padding: "4px 10px", borderRadius: 6, letterSpacing: -0.5, textDecoration: "none",
        }}>TED ↗</a>
      </div>

      {/* ── Mode tabs ── */}
      <div style={{
        display: "flex", gap: 0, margin: "0 20px 0",
        borderBottom: "1px solid #E5E7EB",
      }}>
        {[["shadow","練習モード"],["record","録音モード"]].map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "10px 0", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
            background: "transparent",
            color: mode === m ? "#0EA5E9" : "#9CA3AF",
            borderBottom: mode === m ? "2px solid #0EA5E9" : "2px solid transparent",
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      {/* ── Script ── */}
      <div ref={containerRef} style={{ flex: 1, overflowY: "auto", padding: "28px 24px 20px" }}>
        {mode === "shadow" && (
          <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans',sans-serif", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>練習モード</span>
            音声と同時に声を重ねましょう。赤ハイライトの単語をタップで発音ヒントを確認
          </div>
        )}
        {mode === "record" && (
          <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans',sans-serif", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>録音モード</span>
            自分の声を録音してAI分析。音声と同時に発声してください
          </div>
        )}

        {material.sentences.map((sent, si) => {
          const isActiveSent = si === activeSentIdx;
          const isPastSent = si < activeSentIdx;
          return (
            <div
              key={sent.id}
              ref={el => sentRefs.current[si] = el}
              style={{
                marginBottom: 28,
                opacity: isPastSent ? 0.35 : 1,
                transition: "opacity 0.4s",
              }}
            >
              <p style={{
                fontSize: 26,
                lineHeight: 1.75,
                fontWeight: 400,
                color: "#1A1A1A",
                letterSpacing: "-0.2px",
              }}>
                {sent.words.map((word, wi) => {
                  const isActiveWord = isActiveSent && wi === activeWordIdx;
                  const hasDevPoint = !!word.devPoint;
                  return (
                    <span key={wi}>
                      <span
                        className={`word-chip${hasDevPoint ? " has-dev" : ""}`}
                        onClick={hasDevPoint ? (e) => handleWordTap(word, e) : undefined}
                        style={{
                          background: isActiveWord
                            ? "#BFDBFE"
                            : hasDevPoint
                            ? "#FEE2E2"
                            : "transparent",
                          color: isActiveWord ? "#1E40AF" : "#1A1A1A",
                          fontWeight: isActiveWord ? 700 : 400,
                          borderRadius: 4,
                          padding: isActiveWord || hasDevPoint ? "1px 3px" : "1px 0",
                          boxShadow: isActiveWord ? "0 0 0 2px #93C5FD" : "none",
                          transition: "all 0.1s",
                        }}
                      >{word.w}</span>
                      {" "}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}

        {/* Spacer */}
        <div style={{ height: 120 }} />
      </div>

      {/* ── Dev point popup ── */}
      {devPopup && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 60 }} onClick={() => setDevPopup(null)} />
          <div style={{
            position: "fixed",
            bottom: 200,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(360px, 90vw)",
            background: "#FFF7F7",
            border: "1px solid #FECACA",
            borderRadius: 16,
            padding: 18,
            zIndex: 70,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          }}>
            {/* Tag */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: DEV_TYPE[devPopup.word.devPoint.type].color,
                color: "#fff", borderRadius: 20, padding: "3px 10px",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 12,
              }}>
                🔥 Development
              </div>
              <div style={{
                padding: "3px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                background: DEV_TYPE[devPopup.word.devPoint.type].bg,
                color: DEV_TYPE[devPopup.word.devPoint.type].color,
                fontFamily: "'DM Sans',sans-serif",
              }}>
                {DEV_TYPE[devPopup.word.devPoint.type].icon} {DEV_TYPE[devPopup.word.devPoint.type].label}
              </div>
            </div>
            {/* Word */}
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: "#991B1B" }}>
              "{devPopup.word.w.replace(/[',]/g,'')}"
            </div>
            {/* Note */}
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>
              {devPopup.word.devPoint.note}
            </div>
            <button onClick={() => setDevPopup(null)} style={{
              marginTop: 12, width: "100%", padding: "8px", borderRadius: 8,
              background: "#FEE2E2", border: "none", color: "#DC2626",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>閉じる</button>
          </div>
        </>
      )}

      {/* ── Controls ── */}
      <div style={{
        position: "sticky", bottom: 0,
        background: "#FAFAF8",
        borderTop: "1px solid #E5E7EB",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {/* Recording indicator */}
        {mode === "record" && (
          <div style={{ padding: "8px 20px 0" }}>
            <button
              onClick={() => setIsRecording(r => !r)}
              style={{
                width: "100%", padding: "9px", borderRadius: 10,
                background: isRecording ? "#FEE2E2" : "#F3F4F6",
                border: isRecording ? "1px solid #FECACA" : "1px solid #E5E7EB",
                color: isRecording ? "#DC2626" : "#6B7280",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              {isRecording
                ? <><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", display: "inline-block", animation: "pulse 1s infinite" }} />録音中 — タップで停止</>
                : "🎙️ 録音開始"}
            </button>
          </div>
        )}

        {/* Seek bar */}
        <div style={{ padding: "10px 20px 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans',sans-serif", minWidth: 36 }}>{fmt(elapsedMs)}</span>
          <div
            style={{ flex: 1, height: 4, background: "#E5E7EB", borderRadius: 2, cursor: "pointer", position: "relative" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const next = Math.floor(pct * totalMs);
              setElapsedMs(next);
              if (isPlaying) { stopAll(); setTimeout(startPlayback, 10); }
            }}
          >
            <div style={{ width: `${progressPct}%`, height: "100%", background: "#0EA5E9", borderRadius: 2, transition: "width 0.1s" }} />
            <div style={{
              position: "absolute", top: "50%", left: `${progressPct}%`,
              transform: "translate(-50%,-50%)",
              width: 12, height: 12, borderRadius: "50%", background: "#0EA5E9",
              boxShadow: "0 0 0 3px #BFDBFE",
            }} />
          </div>
          <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans',sans-serif", minWidth: 40, textAlign: "right" }}>-{fmt(remaining)}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "6px 20px 16px" }}>
          {/* EN speed toggle placeholder */}
          <div style={{
            width: 38, height: 38, borderRadius: 8, background: "#F3F4F6",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 12, color: "#4B5563", cursor: "pointer",
          }}>EN</div>

          {/* Rewind 3s */}
          <button onClick={rewind3s} style={{
            width: 44, height: 44, borderRadius: "50%", background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 6l-4 4m4-4l4 4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="16" y="19" textAnchor="middle" fontSize="7" fill="#374151" fontFamily="DM Sans" fontWeight="700">3</text>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => isPlaying ? pausePlayback() : startPlayback()}
            style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#0EA5E9",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(14,165,233,0.4)",
              transition: "transform 0.1s",
            }}
          >
            {isPlaying
              ? <svg width="22" height="22" viewBox="0 0 22 22" fill="white"><rect x="3" y="2" width="6" height="18" rx="1"/><rect x="13" y="2" width="6" height="18" rx="1"/></svg>
              : <svg width="22" height="22" viewBox="0 0 22 22" fill="white"><path d="M5 3l14 8-14 8V3z"/></svg>
            }
          </button>

          {/* Forward 3s */}
          <button onClick={forward3s} style={{
            width: 44, height: 44, borderRadius: "50%", background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 6C21.523 6 26 10.477 26 16s-4.477 10-10 10S6 21.523 6 16" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 6l4 4m-4-4l-4 4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="16" y="19" textAnchor="middle" fontSize="7" fill="#374151" fontFamily="DM Sans" fontWeight="700">3</text>
            </svg>
          </button>

          {/* AB repeat toggle */}
          <div style={{
            width: 38, height: 38, borderRadius: 8, background: "#F3F4F6",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 12, color: "#4B5563", cursor: "pointer",
          }}>AB</div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION RESULT with Development Points
// ─────────────────────────────────────────────────────────────────────────────

function SessionResult({ material, devPoints, onRetry, onFinish }) {
  const [drillWord, setDrillWord] = useState(null);

  const grouped = {};
  devPoints.forEach(w => {
    const t = w.devPoint.type;
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(w);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'DM Sans',sans-serif", color: "#1A1A1A" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Noto+Serif:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <button onClick={onFinish} style={{ background: "none", border: "none", fontSize: 18, color: "#9CA3AF", cursor: "pointer" }}>← 戻る</button>
        <div style={{ fontWeight: 800, fontSize: 15 }}>セッション結果</div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
        {/* Score card */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
          borderRadius: 20, padding: 24, marginBottom: 20, color: "#fff",
          display: "flex", gap: 20, alignItems: "center",
        }}>
          <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
            <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="33" fill="none" stroke="#1E293B" strokeWidth="6"/>
              <circle cx="40" cy="40" r="33" fill="none" stroke="#4ADE80" strokeWidth="6"
                strokeDasharray={`${(74/100)*2*Math.PI*33} ${2*Math.PI*33}`} strokeLinecap="round"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20 }}>74</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Total Score</div>
            <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>Good Progress 👍</div>
            <div style={{ fontSize: 13, color: "#60A5FA", marginTop: 6 }}>{devPoints.length}箇所の改善ポイント</div>
          </div>
        </div>

        {/* ★ Development Points */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
          {/* Title */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #F3F4F6",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 20 }}>🔬</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Development Points</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
                ここを直すともっとスムーズに話せます
              </div>
            </div>
          </div>

          {Object.entries(grouped).map(([type, words]) => {
            const cat = DEV_TYPE[type];
            return (
              <div key={type} style={{ borderBottom: "1px solid #F9FAFB" }}>
                {/* Category row */}
                <div style={{
                  padding: "10px 18px",
                  background: cat.bg,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  <span style={{ fontWeight: 800, color: cat.color, fontSize: 13 }}>{cat.label}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>（{words.length}箇所）</span>
                </div>

                {words.map((word, i) => (
                  <div key={i} style={{
                    padding: "14px 18px",
                    borderTop: "1px solid #F3F4F6",
                    display: "flex", gap: 12, alignItems: "flex-start",
                  }}>
                    <div style={{ flex: 1 }}>
                      {/* Highlighted word in context — find the sentence */}
                      {(() => {
                        const sent = material.sentences.find(s => s.words.some(w => w === word));
                        if (!sent) return null;
                        return (
                          <p style={{ fontSize: 15, lineHeight: 1.8, fontFamily: "'Noto Serif', Georgia, serif", marginBottom: 8, color: "#374151" }}>
                            {sent.words.map((w, wi) => (
                              <span key={wi}>
                                <span style={{
                                  background: w === word ? "#FEE2E2" : "transparent",
                                  color: w === word ? "#DC2626" : "inherit",
                                  fontWeight: w === word ? 700 : 400,
                                  borderRadius: 3, padding: w === word ? "0 2px" : 0,
                                }}>{w.w}</span>{" "}
                              </span>
                            ))}
                          </p>
                        );
                      })()}

                      {/* Note */}
                      <div style={{
                        padding: "10px 14px", borderRadius: 10,
                        background: "#F9FAFB", borderLeft: `3px solid ${cat.color}`,
                        fontSize: 13, color: "#374151", lineHeight: 1.6,
                      }}>
                        💡 {word.devPoint.note}
                      </div>
                    </div>

                    {/* Drill button */}
                    <button
                      onClick={() => setDrillWord(word)}
                      style={{
                        padding: "7px 12px", borderRadius: 10,
                        background: cat.bg, color: cat.color,
                        border: `1px solid ${cat.color}40`,
                        fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                    >🔁 Drill</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
          <button onClick={onRetry} style={{
            flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6",
            color: "#374151", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14,
          }}>🔁 もう1回</button>
          <button onClick={onFinish} style={{
            flex: 1, padding: "13px", borderRadius: 12, background: "#0EA5E9",
            color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14,
          }}>次の素材 →</button>
        </div>
      </div>

      {/* Drill modal */}
      {drillWord && <DrillModal word={drillWord} material={material} onClose={() => setDrillWord(null)} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DRILL MODAL — repeat single sentence
// ─────────────────────────────────────────────────────────────────────────────

function DrillModal({ word, material, onClose }) {
  const sent = material.sentences.find(s => s.words.some(w => w === word));
  const cat = DEV_TYPE[word.devPoint.type];
  const [phase, setPhase] = useState("note"); // note | listen | shadow | done
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [reps, setReps] = useState(0);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 100, backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#FAFAF8", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 600,
        padding: "24px 24px 40px",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.2)",
        fontFamily: "'DM Sans',sans-serif",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#D1D5DB", borderRadius: 2, margin: "0 auto 20px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <span style={{ background: cat.color, color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                🔥 Development
              </span>
              <span style={{ background: cat.bg, color: cat.color, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                {cat.icon} {cat.label}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#DC2626" }}>"{word.w.replace(/[',]/g,'')}"</div>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#6B7280" }}>✕</button>
        </div>

        {/* Phase tabs */}
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, marginBottom: 16 }}>
          {[["note","ヒント"],["listen","聴く"],["shadow","練習"],["done","完了"]].map(([ph, label]) => (
            <div key={ph} style={{
              flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 8,
              background: phase === ph ? "#fff" : "transparent",
              color: phase === ph ? "#0EA5E9" : "#9CA3AF",
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              boxShadow: phase === ph ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }} onClick={() => setPhase(ph)}>{label}</div>
          ))}
        </div>

        {/* Target sentence */}
        <div style={{ background: "#FFF7F7", border: "1px solid #FECACA", borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <p style={{ fontSize: 16, lineHeight: 1.8, fontFamily: "'Noto Serif',Georgia,serif", color: "#374151" }}>
            {sent?.words.map((w, i) => (
              <span key={i}>
                <span style={{
                  background: w === word ? "#FEE2E2" : "transparent",
                  color: w === word ? "#DC2626" : "inherit",
                  fontWeight: w === word ? 700 : 400,
                  borderRadius: 3, padding: w === word ? "0 2px" : 0,
                }}>{w.w}</span>{" "}
              </span>
            ))}
          </p>
        </div>

        {phase === "note" && (
          <>
            <div style={{ background: cat.bg, borderLeft: `3px solid ${cat.color}`, padding: "12px 16px", borderRadius: 10, fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
              💡 {word.devPoint.note}
            </div>
            <button onClick={() => setPhase("listen")} style={{
              width: "100%", padding: "12px", borderRadius: 12, background: "#0EA5E9",
              color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14,
            }}>次へ: ネイティブ音声を聴く →</button>
          </>
        )}

        {phase === "listen" && (
          <>
            <div style={{
              background: "#F3F4F6", borderRadius: 12, padding: 16, marginBottom: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              {/* Mini waveform */}
              {Array.from({length:20},(_,i)=>Math.abs(Math.sin(i*0.7))*0.8+0.2).map((h,i)=>(
                <div key={i} style={{ width: 4, height: `${h*36}px`, borderRadius: 2, background: isPlaying ? "#0EA5E9" : "#D1D5DB", transition: "background 0.2s" }} />
              ))}
            </div>
            <button onClick={() => setIsPlaying(p=>!p)} style={{
              width: "100%", padding: "12px", borderRadius: 12, background: isPlaying ? "#F3F4F6" : "#0EA5E9",
              color: isPlaying ? "#374151" : "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14, marginBottom: 10,
            }}>{isPlaying ? "⏸ 停止" : "▶ ネイティブ音声を聴く"}</button>
            <button onClick={() => setPhase("shadow")} style={{
              width: "100%", padding: "11px", borderRadius: 12, background: "#F3F4F6",
              color: "#374151", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13,
            }}>シャドーイングへ →</button>
          </>
        )}

        {phase === "shadow" && (
          <>
            <div style={{
              background: isRecording ? "#FEF2F2" : "#F3F4F6", borderRadius: 12, padding: 16, marginBottom: 14,
              border: isRecording ? "2px solid #FECACA" : "1px solid transparent",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              {Array.from({length:20},(_,i)=>Math.abs(Math.sin(i*1.2+Date.now()/200))*0.8+0.2).map((h,i)=>(
                <div key={i} style={{ width: 4, height: `${(isRecording?h:0.3)*36}px`, borderRadius: 2, background: isRecording ? "#DC2626" : "#D1D5DB", transition: "height 0.1s" }} />
              ))}
            </div>
            {reps > 0 && <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginBottom: 8 }}>{reps}回練習済み</div>}
            <button onClick={() => {setIsRecording(r=>!r); if(isRecording) setReps(r=>r+1);}} style={{
              width: "100%", padding: "12px", borderRadius: 12,
              background: isRecording ? "#FEE2E2" : "#DC2626",
              color: isRecording ? "#DC2626" : "#fff",
              border: isRecording ? "1px solid #FECACA" : "none",
              fontWeight: 700, cursor: "pointer", fontSize: 14, marginBottom: 10,
            }}>{isRecording ? "⏹ 停止" : "🎙️ 録音してシャドーイング"}</button>
            {reps >= 1 && (
              <button onClick={() => setPhase("done")} style={{
                width: "100%", padding: "11px", borderRadius: 12, background: "#0EA5E9",
                color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13,
              }}>完了 ✓</button>
            )}
          </>
        )}

        {phase === "done" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Drillクリア！</div>
            <div style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 20 }}>このフレーズを復習キューに追加しました</div>
            <button onClick={onClose} style={{
              padding: "12px 32px", borderRadius: 12, background: "#0EA5E9",
              color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14,
            }}>結果画面に戻る</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME / MATERIAL LIST
// ─────────────────────────────────────────────────────────────────────────────

function HomePage({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Noto+Serif:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;}`}</style>

      {/* Header */}
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #E5E7EB",
      }}>
        <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px" }}>
          Shadow<span style={{ color: "#E62B1E" }}>Pro</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "4px 10px", borderRadius: 20, fontWeight: 700, fontSize: 13 }}>🔥 7</div>
          <div style={{ background: "#F3F4F6", color: "#374151", padding: "4px 10px", borderRadius: 20, fontWeight: 700, fontSize: 13 }}>⭐ 2,460</div>
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>

        {/* How-to banner */}
        <div style={{
          background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
          borderRadius: 16, padding: 18, marginBottom: 20, color: "#fff",
        }}>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>シャドーイングの基本</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.9 }}>
            ネイティブ音声を<strong>聴きながら</strong>、0.5秒遅れで声を<strong>重ねて</strong>発声します。<br/>
            音声を止めてから読むのは「音読」— シャドーイングは<strong>同時進行</strong>が本質です。
          </div>
        </div>

        {/* Feature callout */}
        <div style={{
          background: "#FFF7F7", border: "1px solid #FECACA",
          borderRadius: 14, padding: 14, marginBottom: 20,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 24 }}>🔬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3, color: "#DC2626" }}>Development Points</div>
            <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
              赤ハイライトの単語をタップすると発音の改善ヒントが表示されます。セッション後は単語単位でDrillが可能。
            </div>
          </div>
        </div>

        {/* Material list */}
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 14 }}>TED Talks</div>
        {MATERIALS.map(mat => {
          const devCount = mat.sentences.flatMap(s => s.words).filter(w => w.devPoint).length;
          const lvColor = mat.level === "C1" ? "#F472B6" : "#60A5FA";
          return (
            <div key={mat.id} style={{
              background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
              padding: 18, marginBottom: 12,
              transition: "box-shadow 0.2s, transform 0.15s",
              cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              onClick={() => onStart(mat)}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 10, flexShrink: 0,
                  background: "#E62B1E", display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", letterSpacing: -1,
                }}>TED</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${lvColor}20`, color: lvColor }}>{mat.level}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#F3F4F6", color: "#6B7280" }}>{mat.theme}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626" }}>🔥 {devCount} Dev Points</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{mat.title}</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>{mat.speaker}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); onStart(mat); }} style={{
                  padding: "8px 16px", borderRadius: 8, background: "#0EA5E9",
                  color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", flexShrink: 0,
                }}>開始 →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home"); // home | player
  const [material, setMaterial] = useState(null);

  return screen === "home"
    ? <HomePage onStart={mat => { setMaterial(mat); setScreen("player"); }} />
    : <ShadowingPlayer material={material} onFinish={() => setScreen("home")} />;
}
