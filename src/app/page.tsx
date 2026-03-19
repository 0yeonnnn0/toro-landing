"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const chatLines = [
  { who: "user", name: "영준", text: "토로야 오늘 뭐해" },
  { who: "bot", name: "TORO", text: "뭐하긴 뭐해… 여기서 너네 채팅이나 구경하고 있었다냥 😼" },
  { who: "user", name: "동연", text: "ㅋㅋㅋ 토로 요즘 좀 건방져진듯" },
  { who: "bot", name: "TORO", text: "건방진 게 아니라 자신감이라고 하는 거다냥~ 0w0" },
  { who: "user", name: "영준", text: "그림 하나 그려줘 고양이" },
  { who: "bot", name: "TORO", text: "후… 이 몸이 직접 모델이 되어주겠다냥 🎨" },
];

const stats = [
  { value: "3", label: "AI 엔진" },
  { value: "24K+", label: "학습 대화" },
  { value: "3", label: "캐릭터 프리셋" },
  { value: "99.9%", label: "가동률" },
];

const featureSections = [
  {
    tag: "대화",
    title: "진짜 친구처럼\n대화에 끼어든다",
    desc: "설정한 확률에 따라 채팅에 자연스럽게 참여합니다. 채널별 최근 대화를 기억하고, RAG 시스템으로 과거 대화까지 검색해 맥락 있는 응답을 만들어냅니다.",
    visual: "chat",
  },
  {
    tag: "캐릭터",
    title: "실제 사람의 말투를\n그대로 재현",
    desc: "2만 4천건 이상의 실제 카카오톡 대화 데이터에서 학습한 캐릭터 프리셋. 도도한 냥체 모드, 공감왕 동연이, 드라이한 영준이 — 슬래시 커맨드 하나로 즉시 전환됩니다.",
    visual: "characters",
  },
  {
    tag: "AI",
    title: "Claude, GPT, Gemini\n상황에 맞게 전환",
    desc: "하나의 봇에서 세 가지 AI를 자유롭게 전환합니다. 이미지 생성은 /draw 한 줄이면 끝. 대시보드에서 실시간 모니터링, 유저 통계, 키워드 분석까지 웹 UI로 모든 것을 제어하세요.",
    visual: "multi",
  },
];

const commands = [
  { cmd: "/ask", desc: "직접 질문하기" },
  { cmd: "/draw", desc: "이미지 생성" },
  { cmd: "/mode set", desc: "캐릭터 변경" },
  { cmd: "/summary", desc: "대화 요약" },
  { cmd: "/chance", desc: "응답 확률 조절" },
  { cmd: "/status", desc: "상태 확인" },
];

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    el.querySelectorAll(".reveal").forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

/* ── Chat Demo ── */
function ChatDemo() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => { setVisible(0); setTyping(false); }, []);

  useEffect(() => {
    if (visible >= chatLines.length) {
      const t = setTimeout(reset, 3500);
      return () => clearTimeout(t);
    }
    const msg = chatLines[visible];
    if (msg.who === "bot") {
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setVisible((v) => v + 1); }, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 600);
    return () => clearTimeout(t);
  }, [visible, reset]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [visible, typing]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-bg-subtle overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <span className="w-3 h-3 rounded-full bg-white/[0.06]" />
        <span className="w-3 h-3 rounded-full bg-white/[0.06]" />
        <span className="w-3 h-3 rounded-full bg-white/[0.06]" />
        <span className="text-text-muted text-xs font-display ml-2"># 일반-채팅</span>
      </div>
      <div ref={ref} className="px-4 py-4 space-y-4 h-[340px] overflow-y-auto">
        {chatLines.slice(0, visible).map((m, i) => (
          <div key={`${visible}-${i}`} className={`flex gap-2.5 ${m.who === "user" ? "flex-row-reverse" : ""}`} style={{ animation: "fade-up 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-display flex-shrink-0 ${m.who === "bot" ? "bg-accent text-white" : "bg-white/[0.06] text-text-dim"}`}>
              {m.who === "bot" ? "T" : m.name[0]}
            </div>
            <div className={m.who === "user" ? "flex flex-col items-end" : ""}>
              <span className={`text-[10px] mb-0.5 ${m.who === "bot" ? "text-accent" : "text-text-muted"}`}>{m.name}</span>
              <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed max-w-[260px] ${m.who === "bot" ? "bg-accent/[0.08] border border-accent/[0.12] rounded-bl-md" : "bg-white/[0.04] border border-border rounded-br-md"}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5" style={{ animation: "fade-in 0.2s ease forwards" }}>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold font-display text-white flex-shrink-0">T</div>
            <div>
              <span className="text-[10px] text-accent mb-0.5 block">TORO</span>
              <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-accent/[0.08] border border-accent/[0.12] inline-flex gap-1.5">
                {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.15}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Character Visual ── */
function CharacterVisual() {
  const chars = [
    { emoji: "😼", name: "TORO 냥체", sample: "이 몸한테 할 말 있으면 빨리 하라냥", color: "border-accent/30" },
    { emoji: "😊", name: "동연이", sample: "히히 그거 완전 좋은데!!", color: "border-pink-500/30" },
    { emoji: "😏", name: "영준이", sample: "하\n그거 ㄱㄱ", color: "border-emerald-500/30" },
  ];
  return (
    <div className="w-full max-w-md space-y-3">
      {chars.map((c, i) => (
        <div key={i} className={`flex items-start gap-4 p-5 rounded-xl border ${c.color} bg-bg-subtle`}>
          <span className="text-3xl flex-shrink-0">{c.emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-text mb-1">{c.name}</p>
            <p className="text-sm text-text-dim leading-relaxed whitespace-pre-line">&ldquo;{c.sample}&rdquo;</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Multi AI Visual ── */
function MultiAIVisual() {
  const ais = [
    { name: "Claude", sub: "Anthropic", dot: "bg-amber-400" },
    { name: "GPT-4o", sub: "OpenAI", dot: "bg-emerald-400" },
    { name: "Gemini", sub: "Google", dot: "bg-blue-400" },
  ];
  return (
    <div className="w-full max-w-md space-y-3">
      {ais.map((a, i) => (
        <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-border bg-bg-subtle">
          <span className={`w-2.5 h-2.5 rounded-full ${a.dot} flex-shrink-0`} />
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-text">{a.name}</p>
            <p className="text-xs text-text-muted">{a.sub}</p>
          </div>
          <span className="ml-auto text-xs text-text-muted font-mono">활성</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const s1 = useReveal();
  const s2 = useReveal();
  const s3 = useReveal();
  const s4 = useReveal();

  return (
    <div className="overflow-x-hidden">
      {/* ── Gradient glow (subtle) ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(ellipse, var(--accent), transparent 70%)" }} />
      </div>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5" aria-label="TORO 홈">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-xs font-black font-display text-white">T</div>
            <span className="font-display font-bold text-base tracking-tight">TORO</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block">기능</a>
            <a href="#commands" className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block">명령어</a>
            <a href="https://bot.yeonnnn.xyz/chat" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text transition-colors hidden sm:block">체험하기</a>
            <a href="#cta" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:brightness-110 transition-[filter]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.093L2.25 6.75" /></svg>
              <span className="hidden sm:inline">문의하기</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 pt-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-accent/20 bg-accent/[0.05] mb-10" style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-medium text-accent tracking-wide font-display">v2.0</span>
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.5rem,7vw,5rem)] leading-[1.06] tracking-[-0.03em] mb-6" style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
            친구같은 AI가
            <br />
            <span className="text-accent-bright">디스코드에 살고 있다</span>
          </h1>

          <p className="text-text-dim text-lg sm:text-xl leading-relaxed max-w-lg mx-auto mb-12" style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}>
            실제 대화 데이터를 학습한 캐릭터 AI.
            <br />
            봇이 아닌, 진짜 친구처럼.
          </p>

          <div className="flex flex-wrap justify-center gap-4" style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <a href="mailto:yeonnnn.dev@gmail.com?subject=TORO%20사용%20문의" className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent text-white font-display font-semibold text-sm transition-[transform,box-shadow] hover:shadow-[0_0_30px_rgba(129,140,248,0.25)] hover:scale-[1.03]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.093L2.25 6.75" /></svg>
              사용 문의하기
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="https://bot.yeonnnn.xyz/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-text-dim font-display font-medium text-sm transition-[border-color,color] hover:border-white/[0.15] hover:text-text">
              웹에서 체험하기
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 px-6 sm:px-10" ref={s1}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl border border-border bg-border overflow-hidden">
            {stats.map((s, i) => (
              <div key={i} className="bg-bg-subtle px-6 py-8 text-center">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-text mb-1" style={{ animation: "count-glow 3s ease-in-out infinite" }}>{s.value}</div>
                <div className="text-xs text-text-muted tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES (alternating layout) ═══ */}
      <section id="features" className="px-6 sm:px-10" ref={s2}>
        <div className="max-w-5xl mx-auto">
          {featureSections.map((f, i) => (
            <div key={i} className={`reveal py-24 sm:py-32 ${i < featureSections.length - 1 ? "border-b border-border" : ""}`} style={{ animationDelay: `${0.1 * i}s` }}>
              <div className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-16 lg:gap-24 items-center`}>
                {/* Text */}
                <div className="flex-1 max-w-lg">
                  <span className="inline-block text-xs font-display font-semibold text-accent tracking-widest uppercase mb-5">{f.tag}</span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-[1.15] tracking-tight mb-6 whitespace-pre-line">{f.title}</h2>
                  <p className="text-text-dim text-base sm:text-lg leading-relaxed">{f.desc}</p>
                </div>
                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  {f.visual === "chat" && <ChatDemo />}
                  {f.visual === "characters" && <CharacterVisual />}
                  {f.visual === "multi" && <MultiAIVisual />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMMANDS ═══ */}
      <section id="commands" className="py-32 sm:py-40 px-6 sm:px-10" ref={s3}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="inline-block text-xs font-display font-semibold text-accent tracking-widest uppercase mb-4">Commands</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">간단한 명령어</h2>
          </div>

          <div className="reveal grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ animationDelay: "0.1s" }}>
            {commands.map((c, i) => (
              <div key={i} className="group p-5 rounded-xl border border-border bg-bg-subtle text-center transition-[border-color,background-color] hover:border-accent/20 hover:bg-accent/[0.03]">
                <code className="block text-accent font-mono text-sm font-semibold mb-2">{c.cmd}</code>
                <span className="text-text-muted text-xs">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="cta" className="py-32 sm:py-40 px-6 sm:px-10" ref={s4}>
        <div className="reveal max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-3xl font-display font-black text-white mx-auto mb-10 shadow-[0_0_60px_rgba(129,140,248,0.15)]">
            T
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight mb-6">
            지금 바로
            <br />
            <span className="text-accent-bright">TORO를 만나보세요</span>
          </h2>
          <p className="text-text-dim text-lg mb-12 max-w-md mx-auto">
            사용 문의, 커스텀 캐릭터 요청, 협업 제안 등
            <br />
            무엇이든 편하게 연락주세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:yeonnnn.dev@gmail.com?subject=TORO%20사용%20문의" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-display font-bold text-base transition-[transform,box-shadow] hover:shadow-[0_0_40px_rgba(129,140,248,0.3)] hover:scale-[1.03]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.093L2.25 6.75" /></svg>
              이메일 보내기
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="https://bot.yeonnnn.xyz/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-text-dim font-display font-medium text-base transition-[border-color,color] hover:border-white/[0.15] hover:text-text">
              웹에서 체험하기
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-10 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent flex items-center justify-center text-[9px] font-bold font-display text-white">T</div>
            <span className="text-xs text-text-muted font-display">TORO v2.0</span>
          </div>
          <span className="text-xs text-text-muted">Claude · GPT · Gemini</span>
        </div>
      </footer>
    </div>
  );
}
