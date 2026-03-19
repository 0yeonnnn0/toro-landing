"use client";

import { useEffect, useState, useRef } from "react";

/* ─── Chat Demo Data ─── */
const chatMessages = [
  { sender: "user", name: "영준", text: "토로야 오늘 뭐해" },
  {
    sender: "bot",
    name: "TORO",
    text: "뭐하긴 뭐해... 여기서 너네 채팅이나 구경하고 있었다냥 😼",
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
    text: "후... 이 몸이 직접 모델이 되어주겠다냥 🎨✨",
  },
];

/* ─── Features Data ─── */
const features = [
  {
    icon: "🧠",
    title: "컨텍스트 기억",
    desc: "채널별 최근 대화를 기억하고 RAG 시스템으로 과거 대화까지 검색해 자연스러운 맥락을 유지합니다.",
    accent: "cyan",
  },
  {
    icon: "🎭",
    title: "캐릭터 프리셋",
    desc: "실제 2만 4천건 이상의 대화 데이터로 학습된 개성 넘치는 캐릭터를 즉시 전환할 수 있습니다.",
    accent: "magenta",
  },
  {
    icon: "🎨",
    title: "이미지 생성",
    desc: "/draw 명령어 하나로 Gemini 기반 이미지를 즉시 생성합니다.",
    accent: "yellow",
  },
  {
    icon: "🔀",
    title: "멀티 AI",
    desc: "Claude, GPT, Gemini를 자유롭게 전환. 상황에 맞는 최적의 AI를 선택하세요.",
    accent: "violet",
  },
  {
    icon: "📊",
    title: "대시보드",
    desc: "실시간 모니터링, 유저 통계, 키워드 분석, RAG 관리까지 웹 UI로 제어합니다.",
    accent: "cyan",
  },
  {
    icon: "💬",
    title: "자동 참여",
    desc: "설정한 확률로 대화에 자연스럽게 끼어들어 진짜 친구처럼 대화합니다.",
    accent: "magenta",
  },
];

/* ─── Characters Data ─── */
const characters = [
  {
    id: "nyang",
    name: "TORO 냥체",
    nameKr: "기본 모드",
    emoji: "😼",
    gradient: "from-accent-cyan to-accent-violet",
    borderGradient:
      "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
    traits: ["도도한 고양이", "자신감 MAX", "냥체 말투"],
    sample: "뭐 보는 거다냥... 이 몸한테 할 말 있으면 빨리 하라냥 >w<",
    bgGlow: "rgba(0, 229, 255, 0.06)",
  },
  {
    id: "dongyeon",
    name: "동연이",
    nameKr: "동연이 말투",
    emoji: "😊",
    gradient: "from-accent-magenta to-accent-yellow",
    borderGradient:
      "linear-gradient(135deg, var(--accent-magenta), var(--accent-yellow))",
    traits: ["공감왕", "히히 장인", "다정한 친구"],
    sample: "아 진짜?? 히히 그거 완전 좋은데!! 나도 해보고 싶다 ㅎㅎ",
    bgGlow: "rgba(255, 45, 135, 0.06)",
  },
  {
    id: "youngjun",
    name: "영준이",
    nameKr: "영준이 말투",
    emoji: "😏",
    gradient: "from-accent-violet to-accent-cyan",
    borderGradient:
      "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
    traits: ["드라이한 유머", "ㄱㄱ 장인", "짧고 굵게"],
    sample: "하\n그거 ㄱㄱ\n근데 좀 귀찮은데",
    bgGlow: "rgba(124, 92, 252, 0.06)",
  },
];

/* ─── Typing Indicator ─── */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent-violet"
          style={{
            animation: "typing 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Chat animation
  useEffect(() => {
    if (visibleMessages >= chatMessages.length) return;

    const nextMsg = chatMessages[visibleMessages];
    const delay = nextMsg.sender === "bot" ? 1200 : 600;

    if (nextMsg.sender === "bot") {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((v) => v + 1);
      }, delay);
      return () => clearTimeout(typingTimer);
    }

    const timer = setTimeout(() => {
      setVisibleMessages((v) => v + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [visibleMessages]);

  // Auto scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  return (
    <div className="relative grid-bg">
      {/* ═══ Ambient Orbs ═══ */}
      <div
        className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full animate-float animate-pulse-glow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-[-300px] right-[-200px] w-[700px] h-[700px] rounded-full animate-float pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />
      <div
        className="fixed top-[40%] right-[10%] w-[400px] h-[400px] rounded-full animate-float pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,45,135,0.06) 0%, transparent 70%)",
          animationDelay: "5s",
        }}
      />

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg-primary/70 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-sm font-bold font-display text-white">
              T
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              TORO
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              기능
            </a>
            <a
              href="#characters"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              캐릭터
            </a>
            <a
              href="#invite"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-discord text-white text-sm font-medium hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              서버에 초대
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text */}
          <div
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-violet/20 bg-accent-violet/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-xs font-medium text-accent-violet tracking-wide font-display">
                v2.0 출시
              </span>
            </div>

            <h1 className="font-display font-900 text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
              <span className="text-gradient-hero">친구같은</span>
              <br />
              <span className="text-text-primary">AI가 디스코드에</span>
              <br />
              <span className="text-text-primary">살고 있다</span>
            </h1>

            <p className="text-text-secondary text-lg leading-relaxed max-w-lg mb-10">
              실제 대화 데이터를 학습한 캐릭터 AI가 자연스럽게 대화에 참여합니다.
              <br />
              봇이 아닌, 진짜 친구처럼.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#invite"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-violet to-accent-cyan text-white font-display font-semibold text-base transition-all hover:shadow-[0_0_30px_rgba(124,92,252,0.3)] hover:scale-[1.02]"
              >
                시작하기
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-text-secondary font-display font-medium text-base transition-all hover:border-white/20 hover:text-text-primary hover:bg-white/[0.02]"
              >
                더 알아보기
              </a>
            </div>
          </div>

          {/* Right - Chat Demo */}
          <div
            className="animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative rounded-3xl bg-bg-secondary/80 border border-white/[0.06] backdrop-blur-sm overflow-hidden glow-violet">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                <span className="text-lg">💬</span>
                <div>
                  <div className="text-sm font-medium font-display">
                    # 일반-채팅
                  </div>
                  <div className="text-xs text-text-secondary">
                    3명 온라인
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatRef}
                className="px-5 py-4 space-y-4 h-[360px] overflow-y-auto"
              >
                {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 animate-slide-up ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    style={{ animationDelay: "0s" }}
                  >
                    {msg.sender === "bot" ? (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-xs font-bold flex-shrink-0">
                        T
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0">
                        {msg.name[0]}
                      </div>
                    )}
                    <div>
                      <div
                        className={`text-xs mb-1 ${msg.sender === "bot" ? "text-accent-violet" : "text-text-secondary"} ${msg.sender === "user" ? "text-right" : ""}`}
                      >
                        {msg.name}
                      </div>
                      <div
                        className={`chat-bubble ${msg.sender === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-xs font-bold flex-shrink-0">
                      T
                    </div>
                    <div>
                      <div className="text-xs mb-1 text-accent-violet">
                        TORO
                      </div>
                      <div className="chat-bubble chat-bubble-bot">
                        <TypingDots />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative py-32 px-6">
        <div className="section-divider max-w-4xl mx-auto mb-32" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display font-800 text-4xl sm:text-5xl tracking-tight mb-4">
              <span className="text-gradient-cyan">강력한 기능</span>들
            </h2>
            <p className="text-text-secondary text-lg max-w-md mx-auto">
              단순한 챗봇이 아닙니다. 진짜 친구가 되기 위한 모든 것.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card rounded-2xl bg-bg-card/60 backdrop-blur-sm p-7"
              >
                <div className="text-3xl mb-5">{f.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">
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
      <section id="characters" className="relative py-32 px-6">
        <div className="section-divider max-w-4xl mx-auto mb-32" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display font-800 text-4xl sm:text-5xl tracking-tight mb-4">
              세 가지 <span className="text-accent-magenta">캐릭터</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-md mx-auto">
              실제 사람의 말투를 학습한 AI 캐릭터를 만나보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {characters.map((c) => (
              <div
                key={c.id}
                className="character-card"
                style={{ background: c.borderGradient }}
              >
                <div
                  className="character-card-inner"
                  style={{ background: `${c.bgGlow}` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{c.emoji}</span>
                    <div>
                      <h3 className="font-display font-bold text-lg">
                        {c.name}
                      </h3>
                      <p className="text-xs text-text-secondary">{c.nameKr}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.traits.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-white/[0.04] border border-white/[0.08] text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-xl bg-bg-primary/60 p-4 border border-white/[0.04]">
                    <p className="text-sm text-text-primary/80 leading-relaxed whitespace-pre-line">
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
      <section className="relative py-32 px-6">
        <div className="section-divider max-w-4xl mx-auto mb-32" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-800 text-4xl sm:text-5xl tracking-tight mb-4">
              간단한 <span className="text-accent-yellow">명령어</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                cmd: "/ask",
                desc: "TORO에게 직접 질문하기",
                tag: "대화",
              },
              {
                cmd: "/draw",
                desc: "AI 이미지 생성",
                tag: "생성",
              },
              {
                cmd: "/mode set",
                desc: "캐릭터 프리셋 변경",
                tag: "설정",
              },
              {
                cmd: "/summary",
                desc: "최근 대화 요약",
                tag: "유틸",
              },
              {
                cmd: "/chance",
                desc: "자동 응답 확률 조절",
                tag: "설정",
              },
              {
                cmd: "/status",
                desc: "봇 상태 및 통계",
                tag: "정보",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-xl bg-bg-card/40 border border-white/[0.04] hover:border-accent-violet/20 transition-colors"
              >
                <code className="text-accent-cyan font-mono text-sm font-semibold whitespace-nowrap">
                  {item.cmd}
                </code>
                <span className="text-text-secondary text-sm flex-1">
                  {item.desc}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-text-secondary uppercase tracking-wider font-display">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        id="invite"
        className="relative py-32 px-6"
      >
        <div className="section-divider max-w-4xl mx-auto mb-32" />
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div
              className="absolute inset-0 blur-3xl opacity-30"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
              }}
            />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-4xl font-display font-black text-white shadow-2xl">
              T
            </div>
          </div>

          <h2 className="font-display font-900 text-4xl sm:text-5xl tracking-tight mb-6">
            지금 바로
            <br />
            <span className="text-gradient-hero">TORO를 만나보세요</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            서버에 초대하고 @TORO를 멘션하면 끝. 설정 없이 바로 대화를
            시작하세요.
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-discord text-white font-display font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(88,101,242,0.4)] hover:scale-[1.03]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            디스코드에 추가하기
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-[10px] font-bold font-display text-white">
              T
            </div>
            <span className="text-sm text-text-secondary font-display">
              TORO v2.0
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <span>Claude / GPT / Gemini</span>
            <span className="w-1 h-1 rounded-full bg-text-secondary/40" />
            <span>Made with AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
