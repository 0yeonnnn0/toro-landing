"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const chatMessages = [
  { sender: "user", name: "영준", text: "토로야 오늘 뭐해" },
  {
    sender: "bot",
    name: "TORO",
    text: "뭐하긴 뭐해… 여기서 너네 채팅이나 구경하고 있었다냥 😼",
  },
  { sender: "user", name: "동연", text: "ㅋㅋㅋ 토로 요즘 좀 건방져진듯" },
  {
    sender: "bot",
    name: "TORO",
    text: "건방진 게 아니라 자신감이라고 하는 거다냥~ 0w0",
  },
  { sender: "user", name: "영준", text: "그림 하나 그려줘 고양이" },
  {
    sender: "bot",
    name: "TORO",
    text: "후… 이 몸이 직접 모델이 되어주겠다냥 🎨",
  },
];

const features = [
  {
    icon: "🧠",
    title: "컨텍스트 기억",
    desc: "채널별 최근 대화를 기억하고 RAG 시스템으로 과거 대화까지 검색해 자연스러운 맥락을 유지합니다.",
    accent: "#00d4ff",
  },
  {
    icon: "🎭",
    title: "캐릭터 프리셋",
    desc: "실제 2만 4천건 이상의 대화 데이터로 학습된 개성 넘치는 캐릭터를 즉시 전환할 수 있습니다.",
    accent: "#ff2d87",
  },
  {
    icon: "🎨",
    title: "이미지 생성",
    desc: "/draw 명령어 하나로 Gemini 기반 이미지를 즉시 생성합니다.",
    accent: "#ffd32a",
  },
  {
    icon: "🔀",
    title: "멀티 AI",
    desc: "Claude, GPT, Gemini를 자유롭게 전환. 상황에 맞는 최적의 AI를 선택하세요.",
    accent: "#8b5cf6",
  },
  {
    icon: "📊",
    title: "대시보드",
    desc: "실시간 모니터링, 유저 통계, 키워드 분석, RAG 관리까지 웹 UI로 제어합니다.",
    accent: "#a3e635",
  },
  {
    icon: "💬",
    title: "자동 참여",
    desc: "설정한 확률로 대화에 자연스럽게 끼어들어 진짜 친구처럼 대화합니다.",
    accent: "#ff2d87",
  },
];

const characters = [
  {
    id: "nyang",
    name: "TORO 냥체",
    sub: "기본 모드",
    emoji: "😼",
    border: "linear-gradient(135deg, #00d4ff, #8b5cf6)",
    orb: "rgba(0, 212, 255, 0.06)",
    glow: "0 20px 60px rgba(0, 212, 255, 0.12)",
    traits: ["도도한 고양이", "자신감 MAX", "냥체 말투"],
    sample: "뭐 보는 거다냥… 이 몸한테 할 말 있으면 빨리 하라냥 >w<",
  },
  {
    id: "dongyeon",
    name: "동연이",
    sub: "동연이 말투",
    emoji: "😊",
    border: "linear-gradient(135deg, #ff2d87, #ffd32a)",
    orb: "rgba(255, 45, 135, 0.06)",
    glow: "0 20px 60px rgba(255, 45, 135, 0.12)",
    traits: ["공감왕", "히히 장인", "다정한 친구"],
    sample: "아 진짜?? 히히 그거 완전 좋은데!! 나도 해보고 싶다 ㅎㅎ",
  },
  {
    id: "youngjun",
    name: "영준이",
    sub: "영준이 말투",
    emoji: "😏",
    border: "linear-gradient(135deg, #8b5cf6, #a3e635)",
    orb: "rgba(139, 92, 246, 0.06)",
    glow: "0 20px 60px rgba(139, 92, 246, 0.12)",
    traits: ["드라이한 유머", "ㄱㄱ 장인", "짧고 굵게"],
    sample: "하\n그거 ㄱㄱ\n근데 좀 귀찮은데",
  },
];

const commands = [
  { cmd: "/ask", desc: "TORO에게 직접 질문하기", tag: "대화" },
  { cmd: "/draw", desc: "AI 이미지 생성", tag: "생성" },
  { cmd: "/mode set", desc: "캐릭터 프리셋 변경", tag: "설정" },
  { cmd: "/summary", desc: "최근 대화 요약", tag: "유틸" },
  { cmd: "/chance", desc: "자동 응답 확률 조절", tag: "설정" },
  { cmd: "/status", desc: "봇 상태 및 통계", tag: "정보" },
];

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    el.querySelectorAll(".reveal, .reveal-fade").forEach((child) => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full bg-accent-violet"
          style={{
            animation: "typing-dot 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   CHAT DEMO
   ═══════════════════════════════════════════ */

function ChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const resetChat = useCallback(() => {
    setVisibleMessages(0);
    setIsTyping(false);
  }, []);

  // Animate messages one by one, then loop
  useEffect(() => {
    if (visibleMessages >= chatMessages.length) {
      const loopTimer = setTimeout(resetChat, 4000);
      return () => clearTimeout(loopTimer);
    }

    const nextMsg = chatMessages[visibleMessages];
    const delay = nextMsg.sender === "bot" ? 1400 : 700;

    if (nextMsg.sender === "bot") {
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((v) => v + 1);
      }, delay);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setVisibleMessages((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleMessages, resetChat]);

  // Auto-scroll
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleMessages, isTyping]);

  return (
    <div className="relative rounded-3xl bg-bg-secondary/80 border border-border-subtle backdrop-blur-sm overflow-hidden" style={{ boxShadow: "0 0 60px rgba(139, 92, 246, 0.06), 0 0 20px rgba(139, 92, 246, 0.08)" }}>
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle bg-bg-card/40">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white/[0.06]" />
          <span className="w-3 h-3 rounded-full bg-white/[0.06]" />
          <span className="w-3 h-3 rounded-full bg-white/[0.06]" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-text-muted text-sm font-display font-semibold">#</span>
          <span className="text-sm font-medium font-display text-text-secondary">일반-채팅</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-lime" style={{ animation: "beacon 2s ease-in-out infinite" }} />
          <span className="text-[11px] text-text-muted">3명 온라인</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="px-5 py-5 space-y-5 h-[380px] overflow-y-auto">
        {chatMessages.slice(0, visibleMessages).map((msg, i) => (
          <div
            key={`${visibleMessages}-${i}`}
            className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            style={{ animation: "reveal-up 0.45s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            {msg.sender === "bot" ? (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-[11px] font-bold font-display text-white flex-shrink-0 shadow-lg shadow-accent-violet/20">
                T
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-xs text-text-secondary flex-shrink-0">
                {msg.name[0]}
              </div>
            )}
            <div className={msg.sender === "user" ? "flex flex-col items-end" : ""}>
              <div className={`text-[11px] mb-1 font-medium ${msg.sender === "bot" ? "text-accent-violet" : "text-text-muted"}`}>
                {msg.name}
              </div>
              <div className={`chat-bubble ${msg.sender === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3" style={{ animation: "reveal-fade 0.3s ease-out forwards" }}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-[11px] font-bold font-display text-white flex-shrink-0 shadow-lg shadow-accent-violet/20">
              T
            </div>
            <div>
              <div className="text-[11px] mb-1 font-medium text-accent-violet">TORO</div>
              <div className="chat-bubble chat-bubble-bot">
                <TypingDots />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const featuresRef = useScrollReveal();
  const charactersRef = useScrollReveal();
  const commandsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="relative grid-bg">
      {/* ─── Ambient orbs ─── */}
      <div
        className="fixed top-[-250px] left-[-250px] w-[700px] h-[700px] rounded-full animate-float animate-pulse-glow pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-[-350px] right-[-250px] w-[800px] h-[800px] rounded-full animate-float pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", animationDelay: "3s" }}
      />
      <div
        className="fixed top-[35%] right-[5%] w-[500px] h-[500px] rounded-full animate-float pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,45,135,0.05) 0%, transparent 70%)", animationDelay: "6s" }}
      />

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-bg-primary/60 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group" aria-label="TORO 홈">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-sm font-black font-display text-white transition-transform group-hover:scale-110">
              T
            </div>
            <span className="font-display font-bold text-lg tracking-tight">TORO</span>
          </a>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
              기능
            </a>
            <a href="#characters" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
              캐릭터
            </a>
            <a
              href="#invite"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-discord text-white text-sm font-semibold hover:brightness-110 transition-[filter]"
              aria-label="디스코드 서버에 TORO 초대하기"
            >
              <DiscordIcon className="w-4 h-4" />
              <span className="hidden sm:inline">서버에 초대</span>
              <span className="sm:hidden">초대</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-accent-violet/20 bg-accent-violet/[0.06] mb-10"
              style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
            >
              <span className="w-2 h-2 rounded-full bg-accent-cyan" style={{ animation: "beacon 2s ease-in-out infinite" }} />
              <span className="text-xs font-semibold text-accent-violet tracking-wider font-display uppercase">
                v2.0 Released
              </span>
            </div>

            <h1
              className="font-display font-extrabold text-[clamp(2.8rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.02em] mb-7"
              style={{ animation: "reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              <span className="text-gradient-hero">친구같은</span>
              <br />
              <span className="text-text-primary">AI가 디스코드에</span>
              <br />
              <span className="text-text-primary">살고 있다</span>
            </h1>

            <p
              className="text-text-secondary text-lg leading-relaxed max-w-md mb-12"
              style={{ animation: "reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
            >
              실제 대화 데이터를 학습한 캐릭터 AI가
              <br />
              자연스럽게 대화에 참여합니다. 봇이 아닌, 진짜 친구처럼.
            </p>

            <div
              className="flex flex-wrap gap-4"
              style={{ animation: "reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
            >
              <a
                href="#invite"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-violet to-accent-cyan text-white font-display font-semibold text-base transition-[transform,box-shadow] hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:scale-[1.03]"
              >
                시작하기
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/[0.08] text-text-secondary font-display font-medium text-base transition-[border-color,color,background-color] hover:border-white/[0.16] hover:text-text-primary hover:bg-white/[0.02]"
              >
                더 알아보기
              </a>
            </div>
          </div>

          {/* Right - Chat */}
          <div style={{ animation: "reveal-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
            <ChatDemo />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted" style={{ animation: "reveal-fade 1s ease-out 2s both" }}>
          <span className="text-[11px] tracking-widest uppercase font-display">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-muted/40 to-transparent" />
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative py-20 sm:py-28 px-6" ref={featuresRef}>
        <div className="section-divider max-w-4xl mx-auto mb-20 sm:mb-28" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="reveal font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-5">
              <span className="text-gradient-cyan">강력한 기능</span>들
            </h2>
            <p className="reveal text-text-secondary text-lg max-w-md mx-auto" style={{ animationDelay: "0.1s" }}>
              단순한 챗봇이 아닙니다. 진짜 친구가 되기 위한 모든 것.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="reveal feature-card rounded-2xl bg-bg-card/60 backdrop-blur-sm p-8"
                style={{
                  animationDelay: `${0.08 * i}s`,
                  "--card-accent": `${f.accent}40`,
                  "--card-glow": `0 0 40px ${f.accent}10`,
                } as React.CSSProperties}
              >
                <div className="feature-icon text-3xl mb-6 w-14 h-14 flex items-center justify-center rounded-xl" style={{ background: `${f.accent}0a` }}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2.5 text-text-primary">
                  {f.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHARACTERS ═══ */}
      <section id="characters" className="relative py-20 sm:py-28 px-6" ref={charactersRef}>
        <div className="section-divider max-w-4xl mx-auto mb-20 sm:mb-28" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="reveal font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-5">
              세 가지 <span className="text-accent-magenta">캐릭터</span>
            </h2>
            <p className="reveal text-text-secondary text-lg max-w-md mx-auto" style={{ animationDelay: "0.1s" }}>
              실제 사람의 말투를 학습한 AI 캐릭터를 만나보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {characters.map((c, i) => (
              <div
                key={c.id}
                className="reveal character-card"
                style={{
                  background: c.border,
                  "--char-glow": c.glow,
                  animationDelay: `${0.12 * i}s`,
                } as React.CSSProperties}
              >
                <div
                  className="character-card-inner"
                  style={{ "--char-orb": c.orb } as React.CSSProperties}
                >
                  <div className="flex items-center gap-3.5 mb-7">
                    <span className="text-4xl">{c.emoji}</span>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight">
                        {c.name}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">{c.sub}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-7">
                    {c.traits.map((t, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-full text-xs bg-white/[0.03] border border-white/[0.06] text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-xl bg-bg-primary/50 p-4 border border-white/[0.03]">
                    <p className="text-sm text-text-primary/70 leading-relaxed whitespace-pre-line italic">
                      &ldquo;{c.sample}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMANDS ═══ */}
      <section className="relative py-20 sm:py-28 px-6" ref={commandsRef}>
        <div className="section-divider max-w-4xl mx-auto mb-20 sm:mb-28" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-5">
              간단한 <span className="text-accent-yellow">명령어</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {commands.map((item, i) => (
              <div
                key={i}
                className="reveal command-row flex items-center gap-4 p-5 rounded-xl bg-bg-card/30 border border-border-subtle cursor-default"
                style={{ animationDelay: `${0.06 * i}s` }}
              >
                <code className="text-accent-cyan font-mono text-sm font-semibold whitespace-nowrap">
                  {item.cmd}
                </code>
                <span className="text-text-secondary text-sm flex-1 min-w-0 truncate">
                  {item.desc}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.03] text-text-muted uppercase tracking-widest font-display flex-shrink-0">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="invite" className="relative py-20 sm:py-28 px-6" ref={ctaRef}>
        <div className="section-divider max-w-4xl mx-auto mb-20 sm:mb-28" />
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="reveal relative inline-block mb-10">
            <div
              className="absolute inset-[-20px] blur-3xl opacity-25 rounded-full"
              style={{ background: "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))" }}
            />
            <div className="relative w-28 h-28 rounded-[22px] bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-5xl font-display font-black text-white shadow-2xl">
              T
            </div>
          </div>

          <h2 className="reveal font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-7" style={{ animationDelay: "0.1s" }}>
            지금 바로
            <br />
            <span className="text-gradient-hero">TORO를 만나보세요</span>
          </h2>
          <p className="reveal text-text-secondary text-lg mb-12 max-w-md mx-auto" style={{ animationDelay: "0.2s" }}>
            서버에 초대하고 @TORO를 멘션하면 끝.
            <br />
            설정 없이 바로 대화를 시작하세요.
          </p>

          <div className="reveal" style={{ animationDelay: "0.3s" }}>
            <a
              href="#"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-discord text-white font-display font-bold text-lg transition-[transform,box-shadow] hover:shadow-[0_0_50px_rgba(88,101,242,0.45)] hover:scale-[1.04]"
              aria-label="디스코드에 TORO 봇 추가하기"
            >
              <DiscordIcon className="w-6 h-6" />
              디스코드에 추가하기
              <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border-subtle py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-[10px] font-bold font-display text-white">
              T
            </div>
            <span className="text-sm text-text-muted font-display font-medium">
              TORO v2.0
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-text-muted">
            <span className="shimmer-text">Claude / GPT / Gemini</span>
            <span className="w-1 h-1 rounded-full bg-text-muted/30" />
            <span>Made with AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
