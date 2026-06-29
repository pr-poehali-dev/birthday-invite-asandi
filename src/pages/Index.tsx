import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const EVENT_DATE = new Date('2026-08-23T00:00:00').getTime();
const HERO_IMG = 'https://cdn.poehali.dev/projects/8b450fac-d3b7-4362-98c8-dede2f991198/bucket/8dc2b7a4-bf4b-4383-b443-104219ce20a4.png';

const useCountdown = () => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const dist = EVENT_DATE - Date.now();
      if (dist < 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(dist / 864e5),
        h: Math.floor((dist % 864e5) / 36e5),
        m: Math.floor((dist % 36e5) / 6e4),
        s: Math.floor((dist % 6e4) / 1e3),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={show ? 'animate-fade-up' : 'opacity-0'}
    >
      {children}
    </div>
  );
};

const SakuraPetal = ({ style }: { style: React.CSSProperties }) => (
  <svg viewBox="0 0 40 40" style={style} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="12" rx="9" ry="13" fill="#f9b8cc" opacity="0.85" transform="rotate(0 20 20)" />
    <ellipse cx="20" cy="12" rx="9" ry="13" fill="#f4a0bb" opacity="0.7" transform="rotate(72 20 20)" />
    <ellipse cx="20" cy="12" rx="9" ry="13" fill="#f9b8cc" opacity="0.85" transform="rotate(144 20 20)" />
    <ellipse cx="20" cy="12" rx="9" ry="13" fill="#f4a0bb" opacity="0.75" transform="rotate(216 20 20)" />
    <ellipse cx="20" cy="12" rx="9" ry="13" fill="#f9b8cc" opacity="0.85" transform="rotate(288 20 20)" />
    <circle cx="20" cy="20" r="4" fill="#fce4ec" />
    <circle cx="20" cy="20" r="2" fill="#f48fb1" />
  </svg>
);

const PETALS_CONFIG = Array.from({ length: 24 }, (_, i) => ({
  left: ((i * 4.3) % 108) - 4,
  dur: 18 + (i * 2.7) % 14,
  delay: (i * 1.9) % 20,
  size: 20 + (i * 3) % 22,
  rotStart: (i * 47) % 360,
  type: i % 3,
}));

const Petals = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {PETALS_CONFIG.map((p, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${p.left}vw`,
          top: '-60px',
          animation: `sp-fall-${p.type} ${p.dur}s cubic-bezier(0.37,0,0.63,1) -${p.delay}s infinite`,
          willChange: 'transform, opacity',
        }}
      >
        <SakuraPetal
          style={{
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur * 0.7}s`,
            animationDelay: `-${p.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animation: `sp-spin ${p.dur * 0.8}s ease-in-out -${p.delay * 0.5}s infinite`,
            filter: 'drop-shadow(0 3px 6px rgba(244,160,187,0.25))',
          }}
        />
      </div>
    ))}
    <style>{`
      @keyframes sp-fall-0 {
        0%   { transform: translateY(-5vh) translateX(0px);   opacity: 0; }
        6%   { opacity: 0.85; }
        45%  { transform: translateY(50vh)  translateX(35px);  opacity: 0.8; }
        100% { transform: translateY(112vh) translateX(-15px); opacity: 0; }
      }
      @keyframes sp-fall-1 {
        0%   { transform: translateY(-5vh) translateX(0px);   opacity: 0; }
        6%   { opacity: 0.75; }
        35%  { transform: translateY(38vh)  translateX(-45px); opacity: 0.7; }
        70%  { transform: translateY(72vh)  translateX(25px);  opacity: 0.65; }
        100% { transform: translateY(112vh) translateX(-10px); opacity: 0; }
      }
      @keyframes sp-fall-2 {
        0%   { transform: translateY(-5vh) translateX(0px);   opacity: 0; }
        8%   { opacity: 0.8; }
        30%  { transform: translateY(30vh)  translateX(50px);  opacity: 0.75; }
        60%  { transform: translateY(65vh)  translateX(10px);  opacity: 0.7; }
        100% { transform: translateY(112vh) translateX(30px);  opacity: 0; }
      }
      @keyframes sp-spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const CONFETTI_CONFIG = Array.from({ length: 40 }, (_, i) => {
  const colors = ['#f9b8cc', '#fad4e4', '#fce4ec', '#ffe082', '#b2dfdb', '#f48fb1', '#fff9c4', '#f8bbd0'];
  const shapes = ['circle', 'rect', 'balloon'];
  return {
    left: (i * 2.55) % 100,
    dur: 6 + (i * 0.7) % 7,
    delay: (i * 0.55) % 8,
    size: 8 + (i * 1.3) % 14,
    color: colors[i % colors.length],
    shape: shapes[i % 3],
    rot: (i * 37) % 360,
  };
});

const ConfettiBalloons = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {CONFETTI_CONFIG.map((c, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${c.left}vw`,
          top: c.shape === 'balloon' ? '110vh' : '-30px',
          animation: c.shape === 'balloon'
            ? `balloon-rise ${c.dur + 4}s cubic-bezier(0.25,0.46,0.45,0.94) -${c.delay}s infinite`
            : `confetti-fall ${c.dur}s cubic-bezier(0.37,0,0.63,1) -${c.delay}s infinite`,
          willChange: 'transform, opacity',
        }}
      >
        {c.shape === 'balloon' ? (
          <svg width={c.size + 12} height={c.size + 20} viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg"
            style={{ animation: `balloon-sway ${3 + i % 3}s ease-in-out -${c.delay}s infinite` }}>
            <ellipse cx="14" cy="13" rx="12" ry="13" fill={c.color} opacity="0.85" />
            <ellipse cx="10" cy="8" rx="4" ry="3" fill="white" opacity="0.3" />
            <polygon points="12,26 14,30 16,26" fill={c.color} opacity="0.7" />
            <line x1="14" y1="30" x2="14" y2="40" stroke={c.color} strokeWidth="1.2" opacity="0.6" />
          </svg>
        ) : c.shape === 'circle' ? (
          <div style={{
            width: c.size, height: c.size,
            borderRadius: '50%',
            background: c.color,
            opacity: 0.8,
            transform: `rotate(${c.rot}deg)`,
          }} />
        ) : (
          <div style={{
            width: c.size * 0.6, height: c.size * 1.2,
            borderRadius: 2,
            background: c.color,
            opacity: 0.75,
            transform: `rotate(${c.rot}deg)`,
          }} />
        )}
      </div>
    ))}
    <style>{`
      @keyframes confetti-fall {
        0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
        5%   { opacity: 1; }
        50%  { transform: translateY(50vh) translateX(30px) rotate(180deg); opacity: 0.85; }
        100% { transform: translateY(110vh) translateX(-20px) rotate(360deg); opacity: 0; }
      }
      @keyframes balloon-rise {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        8%   { opacity: 0.9; }
        100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
      }
      @keyframes balloon-sway {
        0%, 100% { transform: rotate(-6deg); }
        50%       { transform: rotate(6deg); }
      }
    `}</style>
  </div>
);

const Index = () => {
  const { d, h, m, s } = useCountdown();
  const units = [
    { v: d, l: 'дней' },
    { v: h, l: 'часов' },
    { v: m, l: 'минут' },
    { v: s, l: 'секунд' },
  ];

  return (
    <div className="grain relative min-h-screen overflow-x-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,hsl(340_60%_94%),transparent_45%),radial-gradient(circle_at_85%_70%,hsl(38_70%_92%),transparent_45%)]" />
      <Petals />
      <ConfettiBalloons />

      <main className="relative z-10">
        {/* HERO */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <Reveal>
            <p className="mb-6 font-hand text-2xl text-[hsl(var(--rose))] animate-fade-in">
              Первый день рождения
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative mx-auto mb-8 h-52 w-52 animate-breathe sm:h-64 sm:w-64">
              <div className="absolute inset-0 rounded-full bg-[hsl(var(--blush))] blur-2xl opacity-50" />
              <img
                src={HERO_IMG}
                alt="Аделина"
                className="relative h-full w-full rounded-full object-cover shadow-[0_20px_60px_-15px_hsl(340_50%_70%/0.6)] ring-8 ring-white/70"
              />
              <Icon
                name="Sparkles"
                size={28}
                className="absolute -right-2 -top-1 text-[hsl(var(--gold))] animate-sway"
              />
            </div>
          </Reveal>
          <Reveal delay={300}>
            <h1 className="text-shimmer animate-shimmer font-display text-6xl font-semibold leading-tight sm:text-8xl">
              Аделина Ким
            </h1>
          </Reveal>
          <Reveal delay={450}>
            <p className="mx-auto mt-6 max-w-md font-body text-base font-light text-[hsl(var(--foreground))]/80">
              С любовью приглашаем вас разделить с нами этот особенный день — наш светлый праздник Асянди.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <Icon name="ChevronDown" size={26} className="mt-12 animate-bounce text-[hsl(var(--rose))]" />
          </Reveal>
        </section>

        {/* INVITE */}
        <section className="px-6 py-24 text-center">
          <Reveal>
            <Icon name="Flower2" size={36} className="mx-auto mb-6 text-[hsl(var(--blush))] animate-sway" />
            <h2 className="mb-8 font-display text-4xl font-medium text-[hsl(var(--rose))] sm:text-5xl">
              Дорогие родные и друзья!
            </h2>
            <p className="mx-auto max-w-xl font-body text-lg font-light leading-relaxed text-[hsl(var(--foreground))]/80">
              С радостью приглашаем вас на Асянди — первый день рождения нашей любимой
              Аделины. Этот день очень важен для нас, и мы будем счастливы разделить
              его с самыми близкими людьми.
            </p>
          </Reveal>
        </section>

        {/* INFO */}
        <section className="px-6 py-16">
          <Reveal>
            <div className="mx-auto max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-10 text-center shadow-[0_30px_80px_-30px_hsl(340_50%_70%/0.5)] backdrop-blur-md">
              <h2 className="mb-8 font-display text-3xl font-medium text-[hsl(var(--rose))]">
                Информация о празднике
              </h2>
              <div className="space-y-6 font-body">
                {[
                  { icon: 'Calendar', label: 'Дата', val: '23 августа 2026' },
                  { icon: 'Clock', label: 'Время', val: 'будет сообщено позже' },
                  { icon: 'MapPin', label: 'Место', val: 'будет сообщено позже' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--blush))]/30">
                      <Icon name={row.icon} size={20} className="text-[hsl(var(--rose))]" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-widest text-[hsl(var(--foreground))]/50">{row.label}</p>
                      <p className="font-medium text-[hsl(var(--foreground))]">{row.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* TIMER */}
        <section className="px-6 py-24 text-center">
          <Reveal>
            <h2 className="mb-12 font-display text-4xl font-medium text-[hsl(var(--rose))] sm:text-5xl">
              До праздника осталось
            </h2>
          </Reveal>
          <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-4">
            {units.map((u, i) => (
              <Reveal key={u.l} delay={i * 120}>
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/70 shadow-[0_15px_40px_-15px_hsl(340_50%_70%/0.5)] backdrop-blur-md sm:h-28 sm:w-28">
                  <span className="font-display text-4xl font-semibold text-[hsl(var(--rose))] sm:text-5xl tabular-nums">
                    {String(u.v).padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[hsl(var(--foreground))]/50">{u.l}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* RSVP */}
        <section className="px-6 py-24 text-center">
          <Reveal>
            <h2 className="mb-3 font-display text-4xl font-medium text-[hsl(var(--rose))] sm:text-5xl">
              Подтверждение присутствия
            </h2>
            <p className="mb-10 font-body font-light text-[hsl(var(--foreground))]/70">
              Сможете ли вы прийти?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/79000674304?text=${encodeURIComponent('Здравствуйте!\nЯ подтверждаю своё присутствие на празднике Асянди Аделины')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-[hsl(var(--rose))] px-8 py-4 font-body font-medium text-white shadow-lg shadow-[hsl(var(--rose))]/30 transition-transform hover:scale-105"
              >
                <Icon name="Heart" size={18} className="fill-white transition-transform group-hover:scale-125" />
                Я приду
              </a>
              <a
                href={`https://wa.me/79000674304?text=${encodeURIComponent('Здравствуйте!\nК сожалению, не смогу присутствовать на празднике')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[hsl(var(--blush))] bg-white/70 px-8 py-4 font-body font-medium text-[hsl(var(--foreground))]/70 backdrop-blur-md transition-transform hover:scale-105"
              >
                <Icon name="Heart" size={18} className="text-[hsl(var(--blush))]" />
                Не смогу прийти
              </a>
            </div>
          </Reveal>
        </section>

        {/* FINAL */}
        <section className="px-6 pb-32 pt-16 text-center">
          <Reveal>
            <Icon name="Sparkles" size={32} className="mx-auto mb-6 text-[hsl(var(--gold))] animate-breathe" />
            <h2 className="mb-6 font-display text-4xl font-medium text-[hsl(var(--rose))] sm:text-5xl">
              С нетерпением ждём встречи!
            </h2>
            <p className="mx-auto max-w-md font-body font-light leading-relaxed text-[hsl(var(--foreground))]/80">
              Спасибо, что разделите этот особенный день вместе с нашей семьёй.
              Ваше присутствие — самый ценный подарок.
            </p>
            <p className="mt-8 font-hand text-3xl text-[hsl(var(--rose))]">С любовью, семья Ким</p>
          </Reveal>
        </section>
      </main>
    </div>
  );
};

export default Index;