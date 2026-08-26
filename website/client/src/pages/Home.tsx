/* Design: Orbital ustaxona — asimmetrik kosmik editorial layout, Orbita violeti va tactile 3D sayyoralar. */
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Menu,
  MessageCircleQuestion,
  Rocket,
  ShieldCheck,
  Sparkles,
  Stars,
  Trophy,
  X,
  GraduationCap,
  Award,
  MessageSquare,
  Clock,
} from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import { toast } from "sonner";
import { Planet } from "@/components/Planet";
import { planetService, teamService } from "@/api";

type Locale = "uz" | "ru" | "en";

// Apple-signature cubic-bezier spring deceleration curve
const PRO_EASE = [0.16, 1, 0.3, 1] as const;

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 35, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c45dd] via-[#d54381] to-[#f6c94f] origin-left z-50 shadow-[0_2px_12px_rgba(213,67,129,0.5)] pointer-events-none"
    />
  );
}

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  direction = "up",
  distance = 32,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: distance, scale: 0.98 };
      case "down": return { opacity: 0, y: -distance, scale: 0.98 };
      case "left": return { opacity: 0, x: distance };
      case "right": return { opacity: 0, x: -distance };
      case "scale": return { opacity: 0, scale: 0.9 };
      case "fade": return { opacity: 0 };
      default: return { opacity: 0, y: distance };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case "scale": return { opacity: 1, scale: 1 };
      default: return { opacity: 1, y: 0, x: 0, scale: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={inView ? getAnimate() : getInitial()}
      transition={{ duration, delay, ease: PRO_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGroup({
  children,
  className = "",
  staggerDelay = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.96 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: PRO_EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BlurText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const words = text.split(" ");

  return (
    <motion.span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, wIndex) => {
        const charOffset = words.slice(0, wIndex).join("").length;
        return (
          <span key={wIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {Array.from(word).map((letter, lIndex) => {
              const charIndex = charOffset + lIndex;
              return (
                <motion.span
                  key={lIndex}
                  initial={{ opacity: 0, filter: "blur(12px)", y: 12, scale: 0.88 }}
                  animate={
                    inView
                      ? { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
                      : { opacity: 0, filter: "blur(12px)", y: 12, scale: 0.88 }
                  }
                  transition={{
                    duration: 0.65,
                    delay: delay + charIndex * 0.022,
                    ease: PRO_EASE,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "center",
  light = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const alignmentClasses = align === "center" ? "text-center mx-auto" : "text-left";
  const underlineAlignment = align === "center" ? "mx-auto" : "mr-auto";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
      transition={{ duration: 0.85, ease: PRO_EASE }}
      className={`max-w-3xl ${alignmentClasses} ${className}`}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.7, delay: 0.1, ease: PRO_EASE }}
          className={light ? "text-xs font-black uppercase tracking-[0.18em] text-[#f7d978]" : "section-kicker"}
        >
          {eyebrow}
        </motion.p>
      )}

      <h2 className={light ? "mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-[#fffdf5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "section-title mt-4"}>
        <BlurText text={title} delay={0.15} />
      </h2>

      {/* Dynamic Expanding Underline Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.85, delay: 0.32, ease: PRO_EASE }}
        className={`mt-4 h-1 w-16 rounded-full ${light ? "bg-gradient-to-r from-[#f7d978] to-[#6c45dd]" : "bg-gradient-to-r from-[#d54381] via-[#6c45dd] to-[#f6c94f]"} origin-left ${underlineAlignment}`}
      />

      {copy && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.8, delay: 0.42, ease: PRO_EASE }}
          className={light ? "mt-5 text-base font-medium leading-8 text-[#d1e0d7] sm:text-lg" : "mt-5 text-base font-bold leading-8 text-[#5d4c78] sm:text-lg"}
        >
          {copy}
        </motion.p>
      )}
    </motion.div>
  );
}

function ChalkboardOpeningFrame({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Left Door 3D Rotation: Closed (0deg) -> Open (-98deg) -> Open (-98deg) -> Closed (0deg)
  const leftRotateY = useTransform(
    scrollYProgress,
    [0.12, 0.42, 0.68, 0.94],
    [0, -98, -98, 0]
  );

  // Right Door 3D Rotation: Closed (0deg) -> Open (98deg) -> Open (98deg) -> Closed (0deg)
  const rightRotateY = useTransform(
    scrollYProgress,
    [0.12, 0.42, 0.68, 0.94],
    [0, 98, 98, 0]
  );

  return (
    <div ref={containerRef} className="relative [perspective:1600px] overflow-visible">
      {/* Left 3D Chalkboard Door - Opens on scroll down, closes when scrolling past */}
      <motion.div
        style={{ rotateY: leftRotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-y-0 left-0 w-1/2 origin-left z-20 pointer-events-none rounded-l-[36px] sm:rounded-l-[44px] border-r-2 border-[#331c0e] bg-gradient-to-r from-[#244734] via-[#1c3b2b] to-[#173324] border-[10px] sm:border-[16px] border-[#5e3b22] shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden will-change-transform"
      >
        <div className="text-[#f7d978]/40 font-mono text-xs tracking-widest">★ MAKTAB DOSKASI ★</div>
        {/* Brass Lock Handle */}
        <div className="self-end my-auto flex flex-col items-center gap-1">
          <div className="h-16 w-3.5 rounded-r-md bg-gradient-to-r from-[#d4af37] to-[#f6c94f] shadow-lg border border-[#a6821d]" />
          <div className="h-2 w-2 rounded-full bg-[#f6c94f] shadow" />
        </div>
        <div className="text-white/20 font-mono text-[10px]">KICHIK ALLOMA</div>
      </motion.div>

      {/* Right 3D Chalkboard Door - Opens on scroll down, closes when scrolling past */}
      <motion.div
        style={{ rotateY: rightRotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-y-0 right-0 w-1/2 origin-right z-20 pointer-events-none rounded-r-[36px] sm:rounded-r-[44px] border-l-2 border-[#331c0e] bg-gradient-to-l from-[#244734] via-[#1c3b2b] to-[#173324] border-[10px] sm:border-[16px] border-[#5e3b22] shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden will-change-transform"
      >
        <div className="text-[#f7d978]/40 font-mono text-xs tracking-widest text-right">★ KICHIK ALLOMA ★</div>
        {/* Brass Lock Handle */}
        <div className="self-start my-auto flex flex-col items-center gap-1">
          <div className="h-16 w-3.5 rounded-l-md bg-gradient-to-l from-[#d4af37] to-[#f6c94f] shadow-lg border border-[#a6821d]" />
          <div className="h-2 w-2 rounded-full bg-[#f6c94f] shadow" />
        </div>
        <div className="text-white/20 font-mono text-[10px] text-right">NAZORAT</div>
      </motion.div>

      {/* The inner chalkboard content */}
      {children}
    </div>
  );
}

function CosmicBackgroundAnimation({ variant = "light" }: { variant?: "light" | "dark" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 250);
    mouseY.set(e.clientY - rect.top - 250);
  };

  const stars = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        id: i,
        top: `${(i * 13 + 7) % 94}%`,
        left: `${(i * 19 + 5) % 94}%`,
        size: (i % 4) + 2,
        duration: (i % 4) + 2.5,
        delay: (i % 6) * 0.4,
        opacity: i % 3 === 0 ? 0.9 : 0.5,
      })),
    []
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="pointer-events-auto absolute inset-0 overflow-hidden z-0 select-none"
    >
      {/* Mouse Following Cosmic Light Aura */}
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className={`pointer-events-none absolute h-[500px] w-[500px] rounded-full ${
          variant === "light"
            ? "bg-gradient-to-r from-[#8d6ee0]/20 via-[#f6c94f]/18 to-[#d54381]/15 blur-3xl"
            : "bg-gradient-to-r from-[#6c45dd]/35 via-[#f6c94f]/25 to-[#d54381]/25 blur-3xl"
        }`}
      />

      {/* Rotating Concentric Galaxy Orbit Rings */}
      <div className="pointer-events-none absolute left-[-15%] top-[-20%] h-[750px] w-[750px] rounded-full border border-dashed border-[#8d6ee0]/25 animate-spin-slow opacity-60" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-25%] h-[850px] w-[850px] rounded-full border border-dashed border-[#f6c94f]/20 animate-spin-slow opacity-50" />

      {/* Aurora Ambient Nebulas */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.65, 0.4],
          x: [-35, 35, -35],
          y: [-25, 25, -25],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full ${
          variant === "light" ? "bg-[#8d6ee0]/30 blur-3xl" : "bg-[#6c45dd]/40 blur-3xl"
        }`}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.35, 0.6, 0.35],
          x: [35, -35, 35],
          y: [25, -25, 25],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className={`pointer-events-none absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full ${
          variant === "light" ? "bg-[#f6c94f]/28 blur-3xl" : "bg-[#d54381]/30 blur-3xl"
        }`}
      />

      {/* Constellation Grid Pattern Overlay */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-45 ${
          variant === "light"
            ? "[background-image:radial-gradient(rgba(108,69,221,0.28)_1.3px,transparent_1.3px)] [background-size:26px_26px]"
            : "[background-image:radial-gradient(rgba(255,255,255,0.30)_1.3px,transparent_1.3px)] [background-size:26px_26px]"
        }`}
      />

      {/* Floating Twinkling Stars */}
      {stars.map((star: { id: number; top: string; left: string; size: number; duration: number; delay: number; opacity: number }) => (
        <motion.div
          key={star.id}
          initial={{ opacity: star.opacity, y: 0 }}
          animate={{
            opacity: [star.opacity * 0.25, star.opacity, star.opacity * 0.25],
            y: [-10, 10, -10],
            scale: [0.85, 1.35, 0.85],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          className={`pointer-events-none rounded-full ${
            variant === "light"
              ? "bg-[#6c45dd] shadow-[0_0_10px_rgba(108,69,221,0.8)]"
              : "bg-[#f6c94f] shadow-[0_0_12px_rgba(246,201,79,0.9)]"
          }`}
        />
      ))}

      {/* Primary Shooting Star Comet Effect */}
      <motion.div
        animate={{
          x: ["-100%", "240%"],
          y: ["-100%", "240%"],
          opacity: [0, 0.9, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          repeatDelay: 4.5,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-1/5 left-0 h-[2.5px] w-48 bg-gradient-to-r from-transparent via-[#f6c94f] to-transparent -rotate-[35deg] blur-[0.4px] shadow-[0_0_15px_rgba(246,201,79,0.8)]"
      />

      {/* Secondary Counter Shooting Star Comet */}
      <motion.div
        animate={{
          x: ["240%", "-100%"],
          y: ["-100%", "240%"],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          repeatDelay: 7,
          ease: "easeInOut",
          delay: 2.2,
        }}
        className="pointer-events-none absolute top-2/5 right-0 h-[2px] w-40 bg-gradient-to-r from-transparent via-[#8d6ee0] to-transparent rotate-[35deg] blur-[0.4px]"
      />
    </div>
  );
}

function SectionDepthWrapper({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });

  // Stay 100% crisp and full size while reading inside section (0 -> 0.70).
  // ONLY as section exits off the top screen edge (0.70 -> 1.0), it smoothly recedes into 3D carousel depth, blurs, and fades out cleanly!
  const opacity = useTransform(scrollYProgress, [0, 0.70, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.70, 1], [1, 1, 0.94]);
  const blurValue = useTransform(scrollYProgress, [0, 0.70, 1], [0, 0, 12]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);
  const y = useTransform(scrollYProgress, [0, 0.70, 1], [0, 0, -35]);

  return (
    <div ref={containerRef} className="carousel-page-snap relative z-10 w-full [perspective:1400px]">
      <motion.div
        id={id}
        style={{
          opacity,
          scale,
          filter,
          y,
          transformStyle: "preserve-3d",
        }}
        className={`will-change-transform gpu-accelerated ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

function PlanetModal({
  planet,
  onClose,
  onTry,
}: {
  planet: {
    id: string;
    name: string;
    desc: string;
    image: string;
    ageGroup: string;
    modulesCount: number;
    skills: string[];
  } | null;
  onClose: () => void;
  onTry: () => void;
}) {
  if (!planet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[36px] border border-white/20 bg-gradient-to-b from-[#1e133d] via-[#160d30] to-[#0c061e] p-7 sm:p-9 text-white shadow-[0_30px_90px_rgba(108,69,221,0.4)]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Glow & Planet 3D Image */}
        <div className="relative mx-auto mb-4 grid h-32 w-32 place-items-center sm:h-40 sm:w-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c45dd] via-[#d54381] to-[#f6c94f] opacity-40 blur-2xl animate-pulse" />
          <img
            src={planet.image}
            alt={planet.name}
            className="relative z-10 h-full w-full object-contain drop-shadow-[0_10px_35px_rgba(246,201,79,0.35)]"
          />
        </div>

        {/* Planet Kicker & Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6c94f]/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#f6c94f] border border-[#f6c94f]/30">
            <Sparkles className="h-3.5 w-3.5 text-[#f6c94f]" />
            KOINOT KO'NIKMASI
          </div>
          <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">{planet.name}</h3>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-white/75 max-w-md mx-auto">{planet.desc}</p>
        </div>

        {/* Skills & Badges Grid */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
            <span className="text-xs font-bold text-white/60">Tavsiya etilgan yosh:</span>
            <span className="text-xs font-black text-[#f6c94f]">{planet.ageGroup}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
            <span className="text-xs font-bold text-white/60">Dars modullari soni:</span>
            <span className="text-xs font-black text-[#6c45dd]">{planet.modulesCount} ta interaktiv topshiriq</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {planet.skills.map((skill) => (
            <span key={skill} className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/90">
              ✓ {skill}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onTry();
          }}
          className="mt-7 flex w-full h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f6c94f] to-[#ffe38a] text-base font-black text-[#1e133d] shadow-[0_12px_30px_rgba(246,201,79,0.3)] transition hover:scale-[1.02] active:scale-[0.98]"
        >
          Boshlash <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CertificateDetailsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const masteredSkills = [
    { name: "Mantiqiy & Deduktiv Fikrlash", planet: "Logic Planet", score: "100%", desc: "Mantiqiy masalalar, ketma-ketliklar va muqobil yechimlar topish ko'nikmasi." },
    { name: "Vizual & Assotsiativ Xotira", planet: "Memory Planet", score: "100%", desc: "Katta hachmdagi vizual axborotlarni tezkor va uzoq muddatga eslab qolish." },
    { name: "Fazoviy 3D Geometriya", planet: "Space Planet", score: "100%", desc: "3D obyektlarni xayolan aylantirish va fazoviy konstruksiyalash." },
    { name: "Matematik Tahlil & Hisob", planet: "Math Planet", score: "100%", desc: "Tezkor mantiqiy hisob-kitob va sonlar bilan ishlash strategiyalari." },
    { name: "Sensomotorika & Reaksiya", planet: "Speed Planet", score: "100%", desc: "Fikr va harakat uyg'unligi, tezkor qaror qabul qilish tezligi." },
    { name: "Kreativ Dizayn & G'oyalar", planet: "Creative Planet", score: "100%", desc: "Nostandart fikrlash, ijodkorlik va original g'oyalar yaratish." },
    { name: "Nutq Boyligi & Muloqot", planet: "Verbal Planet", score: "100%", desc: "Fikrni aniq va tushunarli bayon etish, boy lug'at zaxirasi." },
    { name: "Diqqat va Konsentratsiya", planet: "Focus Planet", score: "100%", desc: "Chalg'ituvchi omillarsiz uzoq vaqt bir topshiriqqa konsentratsiya qilish." },
  ];

  const handleCopyVerification = () => {
    navigator.clipboard.writeText("https://kichikalloma.uz/verify/KA-98420");
    toast.success("Sertifikatni tekshirish havolasi nusxalandi!");
  };

  const handleDownloadPDF = () => {
    toast.success("Rasmiy sertifikat PDF formatida yuklanmoqda...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[36px] border border-white/20 bg-gradient-to-b from-[#1c1136] via-[#150c2c] to-[#0b0518] p-6 sm:p-9 text-white shadow-[0_30px_90px_rgba(108,69,221,0.5)] scrollbar-thin">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#f6c94f] to-[#ffe38a] text-[#1c1136]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6c94f]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#f6c94f] border border-[#f6c94f]/30">
              ✓ TEKSHIRILGAN SHAHODATNOMA
            </div>
            <h3 className="mt-1 text-xl sm:text-2xl font-black text-white">Sertifikatning Batafsil Ma'lumotlari</h3>
          </div>
        </div>

        {/* Student & Course Details */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Ega Bolgan O'quvchi</p>
            <p className="mt-1 text-sm font-black text-[#f6c94f]">Allomabek va Allomaxon</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Sertifikat Seriyasi</p>
            <p className="mt-1 text-sm font-mono font-black text-white">KA-98420</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">O'zlashtirish Darajasi</p>
            <p className="mt-1 text-sm font-black text-[#d54381]">100% (8/8 Sayyora)</p>
          </div>
        </div>

        {/* 8 Mastered Planet Skills List */}
        <div className="mt-7">
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-[#f6c94f]">
            ★ O'ZLASHTIRILGAN 8 TA KOINOT KO'NIKMASI
          </h4>
          <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
            {masteredSkills.map((skill) => (
              <div key={skill.name} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{skill.name}</span>
                  <span className="rounded-md bg-[#6c45dd]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#f6c94f]">
                    {skill.score}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-white/65">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Verification QR & Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/15 pt-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Haqiqiylikni Tekshirish Havolasi:</p>
            <p className="mt-0.5 font-mono text-xs font-bold text-[#f6c94f]">https://kichikalloma.uz/verify/KA-98420</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyVerification}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-black text-white transition hover:bg-white/20 active:scale-95"
            >
              Nusxalash
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6c94f] to-[#ffe38a] px-5 text-xs font-black text-[#1c1136] shadow-md transition hover:scale-105 active:scale-95"
            >
              PDF Yuklash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HolographicCertificate() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Raw MotionValues for continuous 3D mouse tilt & drag rotation
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const sheenOpacity = useMotionValue(0.2);

  // Smooth Springs initialized with MotionValues
  const springRotX = useSpring(rawRotX, { stiffness: 220, damping: 24 });
  const springRotY = useSpring(rawRotY, { stiffness: 220, damping: 24 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: rawRotY.get(),
      startY: rawRotX.get(),
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (isDragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      const newY = dragStart.current.startX + dx * 0.85;
      const newX = Math.max(-55, Math.min(55, dragStart.current.startY - dy * 0.85));

      rawRotY.set(newY);
      rawRotX.set(newX);
      sheenOpacity.set(0.5);
    } else {
      // Dynamic mouse hover 3D tilt tracking
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;

      const tiltY = (offsetX / (rect.width / 2)) * 30 + (isFlipped ? 180 : 0);
      const tiltX = -(offsetY / (rect.height / 2)) * 26;

      rawRotY.set(tiltY);
      rawRotX.set(tiltX);
      sheenOpacity.set(0.4);
    }
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      const currentY = rawRotY.get();
      const normY = ((currentY % 360) + 360) % 360;
      setIsFlipped(normY > 90 && normY < 270);
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    rawRotX.set(0);
    rawRotY.set(isFlipped ? 180 : 0);
    sheenOpacity.set(0.18);
  };

  const toggleCardFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    rawRotY.set(nextFlipped ? 180 : 0);
  };

  // Determine if showing back side based on current rotation angle
  const normY = ((rawRotY.get() % 360) + 360) % 360;
  const isBackVisible = normY > 90 && normY < 270;

  const masteredSkills = [
    { name: "Mantiqiy Fikrlash", desc: "Ketma-ketliklar va yechimlar", score: "100%" },
    { name: "Vizual Xotira", desc: "Axborotlarni tezkor eslab qolish", score: "100%" },
    { name: "Fazoviy 3D Geometriya", desc: "3D obyektlarni xayolan boshqarish", score: "100%" },
    { name: "Matematik Tahlil", desc: "Tezkor hisob va strategiya", score: "100%" },
    { name: "Sensomotorika", desc: "Fikr va harakat uyg'unligi", score: "100%" },
    { name: "Kreativ Dizayn", desc: "Original g'oyalar yaratish", score: "100%" },
    { name: "Nutq Boyligi", desc: "Erkin va ravon muloqot", score: "100%" },
    { name: "Diqqat Jamlash", desc: "Uzoq muddatli konsentratsiya", score: "100%" },
  ];

  return (
    <div className="relative my-16 [perspective:1400px]">
      <motion.div
        ref={cardRef}
        onClick={toggleCardFlip}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: "preserve-3d",
        }}
        className={`group relative mx-auto w-full max-w-2xl overflow-hidden rounded-[40px] border-[5px] border-[#fff2b3] bg-gradient-to-br from-[#ffe788] via-[#f6c94f] to-[#e6a81e] p-8 sm:p-12 text-[#240e44] shadow-[0_35px_90px_rgba(230,168,30,0.35)] cursor-grab active:cursor-grabbing select-none transition-shadow duration-300 touch-none`}
      >
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/40 blur-[80px] z-0" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#ffb700]/30 blur-[80px] z-0" />

        {/* 4D Specular Reflection Sheen */}
        <motion.div
          style={{ opacity: sheenOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent mix-blend-overlay transition-opacity duration-300 z-30"
        />

        {/* Outer Dotted Space Border Line */}
        <div className="pointer-events-none absolute inset-3.5 rounded-[30px] border-2 border-dashed border-[#734305]/30 z-30" />

        {/* FRONT FACE (Shown at 0deg) */}
        <div
          style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
          className={`relative z-10 transition-opacity duration-300 h-full flex flex-col justify-between ${isBackVisible ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          {/* Header Ribbon & Brand Stamp */}
          <div className="flex items-center justify-between border-b border-white/25 pb-5 pt-1" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-md border border-white/40 shadow-md">
                <img src="/logo-a.png" alt="Kichik Alloma" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-sm">KOSMIK SERTIFIKAT</div>
                <div className="text-sm font-black text-white drop-shadow-md">KICHIK ALLOMA ACADEMY</div>
              </div>
            </div>
            {/* Holographic Badge */}
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-[#240e44] via-[#6c45dd] to-[#d54381] p-1 shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110" style={{ transform: "translateZ(50px)" }}>
              <div className="grid h-full w-full place-items-center rounded-full border-2 border-[#ffe894] bg-[#240e44] text-[10px] font-black text-[#ffe894] text-center leading-tight shadow-inner">
                ★ 100% ★<br />TAMOM
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="mt-8 text-center" style={{ transform: "translateZ(40px)" }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#240e44] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white border border-white/30 shadow-md mb-4">
               🚀 SUPER QAHRAMON 🚀
            </div>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.4)] uppercase">
              ALLOMABEK VA ALLOMAXON
            </h3>
            <p className="mt-4 text-sm sm:text-base font-extrabold leading-relaxed text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] max-w-md mx-auto">
              8 ta koinot modulini 100% muvaffaqiyatli tamomlab, haqiqiy koinot kashfiyotchisi unvoniga ega bo'ldi!
            </p>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2.5 justify-center" style={{ transform: "translateZ(25px)" }}>
              <span className="rounded-xl border border-white/40 bg-white/20 backdrop-blur-md px-4 py-1.5 text-[11px] font-black text-white shadow-sm">
                🧠 Mantiq ustasi
              </span>
              <span className="rounded-xl border border-white/40 bg-white/20 backdrop-blur-md px-4 py-1.5 text-[11px] font-black text-white shadow-sm">
                🛸 Fazoviy geometriya
              </span>
              <span className="rounded-xl border border-white/40 bg-white/20 backdrop-blur-md px-4 py-1.5 text-[11px] font-black text-white shadow-sm">
                ⚡ Chaqqon reaksiya
              </span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="mt-10 flex items-end justify-between border-t border-white/25 pt-5 text-xs" style={{ transform: "translateZ(25px)" }}>
            <div>
              <div className="text-[10px] font-black text-white/85 uppercase mb-1 drop-shadow-sm">Berilgan sana:</div>
              <div className="font-mono font-black text-white drop-shadow-sm">2026 // ID: KA-98420</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-white/85 uppercase mb-1 drop-shadow-sm">Haqiqiyligini tekshirish:</div>
              <div className="font-mono font-black text-white drop-shadow-sm">kichikalloma.uz/verify</div>
            </div>
          </div>
        </div>

        {/* BACK FACE (Rotated 180deg) */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
          }}
          className={`absolute inset-0 p-8 sm:p-12 flex flex-col justify-between transition-opacity duration-300 ${isBackVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {/* Back Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/25 pb-4 pt-2" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-white" />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white drop-shadow-sm">O'ZLASHTIRILGAN KUCHLAR</span>
            </div>
            <span className="font-mono text-xs font-black text-white/90">KA-98420</span>
          </div>

          {/* 8 Skills Grid on Back Side */}
          <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-4 pt-6" style={{ transform: "translateZ(40px)" }}>
            {masteredSkills.map((skill, idx) => (
              <div key={idx} className="flex flex-col gap-1 rounded-xl bg-white/20 p-3 backdrop-blur-md border border-white/40 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-white uppercase drop-shadow-sm">{skill.name}</span>
                  <span className="text-[10px] font-black text-[#240e44] bg-[#ffe894] px-1.5 py-0.5 rounded-md">{skill.score}</span>
                </div>
                <div className="text-[10px] font-bold text-white/90 leading-tight">
                  {skill.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-4 text-center text-[10px] font-bold text-white/80" style={{ transform: "translateZ(20px)" }}>
            * Ushbu ko'nikmalar AI tomonidan tahlil qilinib, amaliy tasdiqlangan.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return Math.round(latest).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  });

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, value, duration, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const assets = {
  heroVideo: "/video_2026-08-20_10-54-38.mp4",
  logo: "/logo.png",
  sun: "/sun.png",
  labImage: "/dashboard-ui.jpg",
  constellationImage: "/constellation.jpg",
  earth: "/earth.png",
  mars: "/mars.png",
  uran: "/uran.png",
  venus: "/venus.png",
  saturn: "/saturn.png",
  jupiter: "/jupiter.png",
};

const content = {
  uz: {
    nav: {
      orbit: "O'rganish koinoti",
      method: "Qanday ishlaydi",
      advantages: "Afzalliklari",
      path: "Ota-onalar uchun",
      team: "Jamoamiz",
      contact: "Biz haqimizda",
      shortOrbit: "Koinot",
      shortMethod: "Ishlashi",
      shortAdvantages: "Afzallik",
      shortPath: "Ota-onalar",
      shortContact: "Aloqa",
      shortStats: "Raqamlar",
    },
    hero: {
      eyebrow: "O'zbekistonda tug'ilgan · Dunyo uchun yaratilgan",
      title: "O'rganishni sarguzashtga aylantiring.",
      copy: "Kichik Alloma bolalarga mustaqil fikrlash va o'sishga yordam beradi — AI bilan kosmik o'rganish sayohati orqali.",
      primary: "Sayohatni boshlash",
      secondary: "Koinotni kashf eting",
      note: "8 ta o'sish dunyosi · 7–10 yosh uchun · 100% bolalar uchun xavfsiz AI",
    },
    orbit: {
      eyebrow: "O'rganish koinoti",
      title: "8 ta dunyo. Bitta o'sayotgan aql.",
      copy: "Har bir sayyora bolaga turli ko'nikmani rivojlantirishga yordam beradi — tanqidiy fikrlashdan muloqotgacha, ijodkorlikdan o'z-o'zini boshqarishgacha.",
      detail: "Sakkiz sayyora bola rivojining sakkiz muhim tomonini bir xaritada jamlaydi.",
      names: {
        mars: "Jismoniy va motorika",
        neptune: "Ijtimoiy",
        saturn: "Axloqiy",
        earth: "Kognitiv",
        uran: "Nutq va til",
        venus: "Emotsional",
        jupiter: "Ijodkorlik",
        mercury: "O'z-o'zini boshqarish",
      },
      descriptions: {
        mars: "Harakat va sog'lom tanaffus",
        neptune: "Hamkorlik va ijtimoiy ko'nikmalar",
        saturn: "Qadriyat, mas'uliyat va tanlov",
        earth: "Fikrlash, o'rganish va muammo yechish",
        uran: "Muloqot, lug'at va talaffuz",
        venus: "Hissiyotlarni anglash va boshqarish",
        jupiter: "Tasavvur va divergent fikrlash",
        mercury: "Rejalashtirish, diqqat va intizom",
      },
    },
    method: {
      eyebrow: "Qanday ishlaydi",
      title: "To'rt qadam qiziqishdan taraqqiyotgacha.",
      copy: "Oddiy jarayon — bolalar birinchi kundanoq tushunadi, ota-onalar esa birinchi haftadan ishonadi.",
      cards: [
        {
          label: "01",
          title: "Dunyoni tanlang",
          copy: "Bola Quyosh tizimi panelini ochadi va bugun kashf etmoqchi bo'lgan sayyorasini tanlaydi.",
        },
        {
          label: "02",
          title: "Fikrlab o'rganing",
          copy: "AI hamroh javob berish o'rniga, yo'l ko'rsatuvchi savollar beradi.",
        },
        {
          label: "03",
          title: "Missiyalarni bajaring",
          copy: "Qisqa va maqsadli missiyalar mashqni kunlik odatga aylantiradi.",
        },
      ],
    },
    steps: {
      eyebrow: "Ota-onalar uchun",
      route: "Nazorat",
      title: "Qulayliklar va Nazorat.",
      copy: "Farzandingizning kunlik va haftalik faolligini, o'rganishga sarflayotgan vaqtini va qaysi sayyoralarga ko'proq qiziqayotganini real vaqt rejimida kuzatib boring.",
      items: [
        { title: "Haftalik rivojlanish hisoboti", copy: "Barcha 8 ta ko'nikma bo'yicha taraqqiyotni bir ko'rinishda." },
        { title: "Ochiq vaqit ma'lumoti", copy: "O'rganish daqiqalari, diqqat seanslari va tanaffuslar." },
        { title: "AI tavsiyalari", copy: "Aniq, mehribon takliflar — ertagayoq amal qilishingiz mumkin." },
      ],
      button: "Boshlash",
    },
    contact: {
      eyebrow: "Xavfsizlik",
      formKicker: "Bolalar uchun mo'ljallangan",
      title: "Bolalar uchun yaratilgan. Ota-onalar uchun ishlab chiqilgan.",
      copy: "Ishonch — birinchi xususiyat. Bolaning ko'rgan narsasining hammasi ota-ona nazoratidagi himoya orbitalaridan o'tadi.",
      imageLabel: "Xavfsizlik rasmi",
      name: "Ismingiz",
      phone: "Telefon raqamingiz",
      message: "Xabaringiz",
      submit: "Yuborish",
      privacy: "Ma'lumotlaringiz faqat so'rovingizga javob berish uchun ishlatiladi.",
    },
    footer: {
      copy: "Kichik savollardan katta olamlargacha.",
      rights: "Barcha huquqlar himoyalangan.",
      email: "hello@kichikalloma.uz",
      col1: "KOINOT",
      col2: "KOMPANIYA",
      col3: "ALOQA",
    },
    toast: {
      contact: "Xabaringiz qabul qilindi. Tez orada siz bilan bog'lanamiz.",
      try: "Sinov yo'nalishiga o'tdingiz. Bu yerda MVP imkoniyatlari bilan tanishasiz.",
    },
    stats: {
      students: "O'quvchilar",
      courses: "Kurslar soni",
      specialists: "Mutaxassislar",
    },
    advantages: {
      title: "Afzalliklari",
      cards: [
        { title: "Professional o'qituvchilar", copy: "Soha ekspertlaridan to'g'ri-dan-to'g'ri o'rganing" },
        { title: "Sertifikatlar", copy: "Kursni tugatgandan so'ng rasmiy sertifikat oling" },
        { title: "Hamjamiyat bilan ishlash", copy: "Tengdoshlar va mentorlar bilan bog'laning" },
        { title: "Qulay jadval", copy: "O'z vaqtingizda, o'z sur'atingizda o'rganing" },
      ],
    },
    team: {
      eyebrow: "Bizning jamoa",
      title: "Jamoamiz",
      copy: "Bolalar ta'limi va kelajagi uchun qayg'uradigan mutaxassislar.",
    },
    cta: {
      title: "Bugun boshlang!",
      copy: "1 060 800 dan ortiq o'quvchilar allaqachon o'z kelajagini qurishmoqda. Siz ham ularga qo'shiling.",
      button: "Bepul ro'yxatdan o'tish",
    },
  },
  ru: {
    nav: {
      orbit: "Учебная вселенная",
      method: "Как это работает",
      advantages: "Преимущества",
      path: "Для родителей",
      team: "Команда",
      contact: "О нас",
      shortOrbit: "Вселенная",
      shortMethod: "Как работает",
      shortAdvantages: "Плюсы",
      shortPath: "Родителям",
      shortContact: "О нас",
      shortStats: "Цифры",
    },
    hero: {
      eyebrow: "Родом из Узбекистана. Создано для мира.",
      title: "Превратите обучение в приключение.",
      copy: "Kichik Alloma помогает детям учиться мыслить самостоятельно и расти через космическое учебное путешествие с ИИ.",
      primary: "Начать путешествие",
      secondary: "Исследовать вселенную",
      note: "8 миров роста · Для детей 7–10 лет · 100% безопасный ИИ для детей",
    },
    orbit: {
      eyebrow: "Учебная вселенная",
      title: "8 миров. Один растущий ум.",
      copy: "Каждая планета помогает ребёнку развивать новый навык — от критического мышления и общения до творчества и самодисциплины.",
      detail: "Восемь планет собирают восемь важных сторон развития ребёнка в одну карту.",
      names: {
        mars: "Физика и моторика",
        neptune: "Социальные навыки",
        saturn: "Этика",
        earth: "Когнитивное развитие",
        uran: "Речь и язык",
        venus: "Эмоциональный интеллект",
        jupiter: "Креативность",
        mercury: "Самодисциплина",
      },
      descriptions: {
        mars: "Движение и активная пауза",
        neptune: "Сотрудничество и социальные навыки",
        saturn: "Ценности, ответственность и выбор",
        earth: "Мышление, обучение и решение задач",
        uran: "Общение, словарь и произношение",
        venus: "Понимание и управление эмоциями",
        jupiter: "Воображение и дивергентное мышление",
        mercury: "Планирование, внимание и дисциплина",
      },
    },
    method: {
      eyebrow: "Как это работает",
      title: "Четыре шага от любопытства к прогрессу.",
      copy: "Простой цикл, который дети понимают с первого дня — и которому родители доверяют с первой недели.",
      cards: [
        { label: "01", title: "Выберите мир", copy: "Ребёнок открывает панель солнечной системы и выбирает планету, которую хочет исследовать сегодня." },
        { label: "02", title: "Учитесь думать", copy: "AI-спутник задаёт направляющие вопросы вместо того, чтобы давать ответы." },
        { label: "03", title: "Выполняйте миссии", copy: "Короткие целевые миссии превращают практику в ежедневную привычку." },
      ],
    },
    steps: {
      eyebrow: "Для родителей",
      route: "Панель управления",
      title: "Удобство и контроль.",
      copy: "Отслеживайте ежедневную и еженедельную активность ребёнка, время обучения и какие планеты его больше всего интересуют — в реальном времени.",
      items: [
        { title: "Еженедельный отчёт о развитии", copy: "Прогресс по всем восьми навыкам в одном взгляде." },
        { title: "Честные данные о времени", copy: "Минуты обучения, сессии фокусировки и перерывы." },
        { title: "Рекомендации ИИ", copy: "Конкретные, доброжелательные советы, которые можно применить сегодня вечером." },
      ],
      button: "Начать",
    },
    contact: {
      eyebrow: "Безопасность",
      formKicker: "Создано для детей",
      title: "Создано для детей. Построено для родителей.",
      copy: "Доверие — первая функция. Всё, что видит ребёнок, проходит через защитную орбиту, которой управляют родители.",
      imageLabel: "Изображение безопасности",
      name: "Ваше имя",
      phone: "Номер телефона",
      message: "Ваше сообщение",
      submit: "Отправить",
      privacy: "Ваши данные используются только для ответа на ваш запрос.",
    },
    footer: {
      copy: "От маленьких вопросов к большим мирам.",
      rights: "Все права защищены.",
      email: "hello@kichikalloma.uz",
      col1: "ВСЕЛЕННАЯ",
      col2: "КОМПАНИЯ",
      col3: "СВЯЗЬ",
    },
    toast: { contact: "Сообщение получено. Мы скоро свяжемся с вами.", try: "Вы перешли к пробному маршруту и можете изучить возможности MVP." },
    stats: {
      students: "Ученики",
      courses: "Количество курсов",
      specialists: "Специалисты",
    },
    advantages: {
      title: "Преимущества",
      cards: [
        { title: "Профессиональные учителя", copy: "Учитесь напрямую у экспертов отрасли" },
        { title: "Сертификаты", copy: "Получите официальный сертификат после окончания курса" },
        { title: "Работа в сообществе", copy: "Общайтесь со сверстниками и менторами" },
        { title: "Удобный график", copy: "Учитесь в удобное для вас время и в своем темпе" },
      ],
    },
    team: {
      eyebrow: "Наша команда",
      title: "Команда",
      copy: "Специалисты, которые заботятся об образовании и будущем детей.",
    },
    cta: {
      title: "Начните сегодня!",
      copy: "Более 1 060 800 учеников уже строят свое будущее. Присоединяйтесь к ним.",
      button: "Бесплатная регистрация",
    },
  },
  en: {
    nav: { orbit: "Learning Universe", method: "How It Works", advantages: "Advantages", path: "For Parents", team: "Team", contact: "About", shortOrbit: "Universe", shortMethod: "How It Works", shortAdvantages: "Perks", shortPath: "Parents", shortContact: "About", shortStats: "Stats" },
    hero: {
      eyebrow: "Born in Uzbekistan · Designed for the world",
      title: "Turn Learning Into an Adventure.",
      copy: "Kichik Alloma helps children learn, think independently and grow through an AI-powered cosmic learning journey.",
      primary: "Start the Journey",
      secondary: "Explore the Universe",
      note: "8 Worlds of growth · Ages 7–10 · 100% Child-safe AI",
    },
    orbit: {
      eyebrow: "The universe of learning",
      title: "8 Worlds. One Growing Mind.",
      copy: "Every planet helps children develop a different skill — from critical thinking and communication to creativity, emotional intelligence and self-management.",
      detail: "Eight planets bring eight important dimensions of a child's development into one map.",
      names: {
        mars: "Physical & Motor Skills",
        neptune: "Social Skills",
        saturn: "Ethics & Values",
        earth: "Cognitive Development",
        uran: "Speech & Language",
        venus: "Emotional Intelligence",
        jupiter: "Creativity",
        mercury: "Self-Management",
      },
      descriptions: {
        mars: "Movement and active breaks",
        neptune: "Collaboration and social skills",
        saturn: "Values, responsibility and choices",
        earth: "Thinking, learning and problem solving",
        uran: "Communication, vocabulary and pronunciation",
        venus: "Understanding and managing emotions",
        jupiter: "Imagination and divergent thinking",
        mercury: "Planning, focus and discipline",
      },
    },
    method: {
      eyebrow: "How it works",
      title: "Four steps from curiosity to progress.",
      copy: "A simple loop children understand on their first day — and parents trust from the first week.",
      cards: [
        { label: "01", title: "Choose a world", copy: "The child opens the solar-system dashboard and picks the planet they want to explore today." },
        { label: "02", title: "Learn by thinking", copy: "The AI companion asks guiding questions instead of handing over answers." },
        { label: "03", title: "Complete missions", copy: "Short focused missions turn practice into a daily habit worth returning to." },
      ],
    },
    steps: {
      eyebrow: "For Parents",
      route: "Dashboard",
      title: "Convenience and Oversight.",
      copy: "Track your child's daily and weekly activity, time spent learning, and which planets they are most curious about — in real time.",
      items: [
        { title: "Weekly development report", copy: "Progress across all eight skills in one glance." },
        { title: "Honest time data", copy: "Learning minutes, focus sessions and breaks." },
        { title: "AI recommendations", copy: "Concrete, kind suggestions you can act on tonight." },
      ],
      button: "Get Started",
    },
    contact: {
      eyebrow: "Safety",
      formKicker: "Designed for children",
      title: "Designed for Children. Built for Parents.",
      copy: "Trust is the first feature. Everything a child sees passes through a protective orbit that parents control.",
      imageLabel: "Safety image",
      name: "Your name",
      phone: "Phone number",
      message: "Your message",
      submit: "Send",
      privacy: "Your details are used only to reply to your request.",
    },
    footer: {
      copy: "From small questions to expansive worlds.",
      rights: "All rights reserved.",
      email: "hello@kichikalloma.uz",
      col1: "UNIVERSE",
      col2: "COMPANY",
      col3: "CONTACT",
    },
    toast: { contact: "Your message has been received. We will be in touch soon.", try: "Journey started. Explore what Kichik Alloma can do." },
    stats: {
      students: "Students",
      courses: "Courses",
      specialists: "Specialists",
    },
    advantages: {
      title: "Advantages",
      cards: [
        { title: "Professional Teachers", copy: "Learn directly from industry experts" },
        { title: "Certificates", copy: "Get an official certificate after completing the course" },
        { title: "Community Interaction", copy: "Connect with peers and mentors" },
        { title: "Flexible Schedule", copy: "Learn at your own time, at your own pace" },
      ],
    },
    team: {
      eyebrow: "Our Team",
      title: "Team",
      copy: "Experts who care about children's education and future.",
    },
    cta: {
      title: "Start Today!",
      copy: "Over 1,060,800 students are already building their future. Join them now.",
      button: "Register for Free",
    },
  },
} as const;

const planets = [
  { id: "neptune", from: "oklch(0.7 0.13 258)", to: "oklch(0.45 0.15 268)", tone: "cool" },
  { id: "mercury", from: "oklch(0.8 0.03 90)", to: "oklch(0.52 0.04 85)", tone: "sand" },
  { id: "venus", from: "oklch(0.9 0.08 85)", to: "oklch(0.68 0.12 60)", tone: "cool" },
  { id: "earth", from: "oklch(0.72 0.13 205)", to: "oklch(0.48 0.14 245)", tone: "earth" },
  { id: "mars", from: "oklch(0.75 0.14 40)", to: "oklch(0.5 0.15 30)", tone: "warm" },
  { id: "jupiter", from: "oklch(0.87 0.1 78)", to: "oklch(0.62 0.13 55)", tone: "rust" },
  { id: "saturn", from: "oklch(0.88 0.08 92)", to: "oklch(0.63 0.11 72)", ring: true, tone: "sand" },
  { id: "uran", from: "oklch(0.88 0.09 195)", to: "oklch(0.62 0.12 210)", tone: "ice" },
] as const;

const teamRoles = {
  uz: {
    "Muhammadali Baxtiyorov": "Dasturchi",
    "Oyatillo Mahmudjonov": "Grafik dizayner",
    "Muhammadsodiq Kozimov": "Mobil dasturchi",
    "Sergey Solovyov": "Dasturchi",
    "Shoxrux Komiljonov": "Founder, project manager",
    "Jasurbek Egamberdiyev": "Filologiya fanlari doktori DSc, Professor",
  },
  ru: {
    "Muhammadali Baxtiyorov": "Full-Stack разработчик",
    "Oyatillo Mahmudjonov": "Графический дизайнер",
    "Muhammadsodiq Kozimov": "Мобильный разработчик",
    "Sergey Solovyov": "Инженер-программист",
    "Shoxrux Komiljonov": "Основатель, руководитель проекта",
    "Jasurbek Egamberdiyev": "Доктор филологических наук DSc, профессор",
  },
  en: {
    "Muhammadali Baxtiyorov": "Full-Stack Software Engineer",
    "Oyatillo Mahmudjonov": "Lead Graphic Designer",
    "Muhammadsodiq Kozimov": "Mobile App Developer",
    "Sergey Solovyov": "Senior Software Engineer",
    "Shoxrux Komiljonov": "Founder, Project Manager",
    "Jasurbek Egamberdiyev": "Doctor of Philological Sciences DSc, Professor",
  }
} as const;

const teamContributions = {
  uz: {
    "Muhammadali Baxtiyorov": "Veb platforma, backend API va ma'lumotlar bazasi arxitekturasini ishlab chiqqan.",
    "Oyatillo Mahmudjonov": "Loyiha brendingi, grafik dizayn va vizual identifikatsiyasini yaratgan.",
    "Muhammadsodiq Kozimov": "Kichik Alloma mobil ilovasi va foydalanuvchi interfeysini ishlab chiqqan.",
    "Sergey Solovyov": "Dasturiy ta'minot, tizim xavfsizligi va integratsiyalarni amalga oshirgan.",
    "Shoxrux Komiljonov": "Loyiha konsepsiyasi, boshqaruvi va strategik rivojlanishini yo'lga qo'ygan.",
    "Jasurbek Egamberdiyev": "Bolalar tili va nutqini rivojlantirish bo'yicha ilmiy-metodik asoslarni yaratgan.",
    default: "Loyiha rivojlanishiga va Kichik Alloma koinotini yaratishga o'z hissasini qo'shgan mutaxassis."
  },
  ru: {
    "Muhammadali Baxtiyorov": "Разработал веб-платформу, бэкенд API и архитектуру базы данных.",
    "Oyatillo Mahmudjonov": "Создал брендинг проекта, графический дизайн и визуальную айдентику.",
    "Muhammadsodiq Kozimov": "Разработал мобильное приложение Kichik Alloma и интерфейс пользователя.",
    "Sergey Solovyov": "Реализовал программное обеспечение, безопасность системы и интеграции.",
    "Shoxrux Komiljonov": "Определил концепцию, управление и стратегическое развитие проекта.",
    "Jasurbek Egamberdiyev": "Создал научно-методические основы развития детской речи и языка.",
    default: "Специалист, внесший вклад в развитие проекта и создание вселенной Kichik Alloma."
  },
  en: {
    "Muhammadali Baxtiyorov": "Developed web platform, backend API and database architecture.",
    "Oyatillo Mahmudjonov": "Created project branding, graphic design and visual identity.",
    "Muhammadsodiq Kozimov": "Developed the Kichik Alloma mobile app and user interface.",
    "Sergey Solovyov": "Implemented software architecture, system security and high-speed integrations.",
    "Shoxrux Komiljonov": "Led project concept, management and strategic development.",
    "Jasurbek Egamberdiyev": "Created scientific-methodological foundations for child speech and language development.",
    default: "Specialist who contributed to the development and success of the Kichik Alloma universe."
  }
} as const;

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type ApiPlanet = {
  id: string;
  name: string;
  skill: string;
  description: string;
  status: "active" | "soon";
  image: string;
};

type ApiStats = {
  planetsCount: number;
  activeChildren: number;
  totalModules: number;
  unreadMessages: number;
};

type ApiTeam = {
  id: number;
  firstName: string;
  lastName: string;
  direction: string;
  description: string;
  image: string;
};

const PLANET_API = "/api/planets";
const STATS_API = "/api/website/stats";
const TEAMS_API = "/api/website/teams";
const PLANET_ID_MAP = ["earth", "mars", "uran", "neptune", "venus", "saturn", "jupiter", "mercury", "sun"];

const DEFAULT_PLANET_IMAGES: Record<string, string> = {
  neptune: "/planets/neptune.png",
  mercury: "/planets/mercury.png",
  venus: "/planets/venus.png",
  earth: "/planets/earth.png",
  mars: "/planets/mars.png",
  jupiter: "/planets/jupiter.png",
  saturn: "/planets/saturn.png",
  uran: "/planets/uran.png",
  sun: "/planets/sun.png",
};

function fixImageUrl(url: string | null): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/[^/]+(?=\/images\/|\/audio_cache\/|\/assets\/)/, "");
}

// FastAPI'dan keladigan id yoki title ga qarab qaysi sayyoraga tushishini aniqlash
function mapDbIdToPlanetId(dbValue: string): string {
  const v = dbValue.toLowerCase();
  
  if (v.includes("kognitiv") || v === "earth") return "earth";
  if (v.includes("jismoniy") || v === "mars" || v.includes("tanqidiy")) return "mars";
  if (v.includes("ijodkorlik") || v === "jupiter" || v.includes("kreativ")) return "jupiter";
  if (v.includes("axloqiy") || v === "saturn" || v.includes("muloqot")) return "saturn";
  if (v.includes("nutq") || v === "uran" || v.includes("moslashuv")) return "uran";
  if (v.includes("ijtimoiy") || v === "neptune" || v.includes("hamkorlik")) return "neptune";
  if (v.includes("emotsional") || v === "venus") return "venus";
  if (v.includes("oz-ozini") || v.includes("o'z-o'zini") || v === "mercury" || v.includes("diqqat")) return "mercury";
  if (v.includes("quyosh") || v === "sun") return "sun";
  
  return "";
}

const DEFAULT_PLANETS_INITIAL: ApiPlanet[] = [
  { id: "earth", name: "Kognitiv", skill: "Kognitiv", description: "Fikrlash, o'rganish va muammo yechish", status: "active", image: "/images/uploads/8b6cbd6f97184342a70030b6158de39a.png" },
  { id: "mars", name: "Jismoniy va motorika", skill: "Jismoniy va motorika", description: "Harakat va sog'lom tanaffus", status: "active", image: "/images/uploads/626835a96045495da55fc03c79067817.png" },
  { id: "uran", name: "Nutq va til", skill: "Nutq va til", description: "Muloqot, lug'at va talaffuz", status: "active", image: "/images/uploads/44ef27031cba4f5284b159e2872d64a7.png" },
  { id: "neptune", name: "Ijtimoiy", skill: "Ijtimoiy", description: "Hamkorlik va ijtimoiy ko'nikmalar", status: "active", image: "/images/uploads/74b5ea4003174423a9415afe79a9a3de.png" },
  { id: "venus", name: "Emotsional", skill: "Emotsional", description: "Hissiyotlarni anglash va boshqarish", status: "active", image: "/images/uploads/43a284015af842a3afae7bd11ae3d152.png" },
  { id: "saturn", name: "Axloqiy", skill: "Axloqiy", description: "Qadriyat, mas'uliyat va tanlov", status: "active", image: "/images/uploads/01f08df4f9fc431e8f2a7d46c9acece3.png" },
  { id: "jupiter", name: "Ijodkorlik", skill: "Ijodkorlik", description: "Tasavvur va divergent fikrlash", status: "active", image: "/images/uploads/4b77c5aa5ef348a6a8017e5d55ce1d0f.png" },
  { id: "mercury", name: "O'z-o'zini boshqarish", skill: "O'z-o'zini boshqarish", description: "Rejalashtirish, diqqat va intizom", status: "active", image: "/images/uploads/9de36f920ee042c8832b256bc9d87055.png" },
  { id: "sun", name: "Quyosh", skill: "Quyosh", description: "Ai chat", status: "active", image: "/images/uploads/9db34b97a90c40c9a11f4b7f46da1a0d.png" },
];

const DEFAULT_TEAMS_INITIAL: ApiTeam[] = [
  { id: 1, firstName: "Muhammadali", lastName: "Baxtiyorov", direction: "Dasturchi", description: "Tajriba 2 yil", image: "/images/uploads/94e8bf566898412d924eb64bcf61c8cb.jpg" },
  { id: 2, firstName: "Oyatillo", lastName: "Mahmudjonov", direction: "Grafik dizayner", description: "Tajriba 2 yil", image: "/images/uploads/d16126f8d4f449cf92b3159b96c0e0b1.jpg" },
  { id: 3, firstName: "Muhammadsodiq", lastName: "Kozimov", direction: "Mobil dasturchi", description: "Tajriba 3 yil", image: "/images/uploads/a818643794c745179d8275529f3ebb13.jpg" },
  { id: 4, firstName: "Sergey", lastName: "Solovyov", direction: "Dasturchi", description: "Tajriba 5 yil", image: "/images/uploads/5b02312f5858498db761950b7c171164.jpg" },
  { id: 5, firstName: "Shoxrux", lastName: "Komiljonov", direction: "Founder, project manager", description: "Tajriba 5 yil", image: "/images/uploads/c653d29d5f4a40b99e77cd7be9dd72dd.png" },
  { id: 6, firstName: "Jasurbek", lastName: "Egamberdiyev", direction: "Filologiya fanlari doktori DSc, Professor", description: "Professor", image: "/images/uploads/95eddf28273c4cffaf18399927a30b66.jpg" },
];

export default function Home() {
  const [language, setLanguage] = useState<Locale>("uz");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("bosh");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const [langPos, setLangPos] = useState({ top: 60, right: 100 });
  const [apiPlanets, setApiPlanets] = useState<ApiPlanet[]>(DEFAULT_PLANETS_INITIAL);
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [apiTeams, setApiTeams] = useState<ApiTeam[]>(DEFAULT_TEAMS_INITIAL);
  const [activeModalPlanet, setActiveModalPlanet] = useState<{
    id: string;
    name: string;
    desc: string;
    image: string;
    ageGroup: string;
    modulesCount: number;
    skills: string[];
  } | null>(null);
  const t = content[language];

  useEffect(() => {
    const sections = ["bosh", "raqamlar", "sayyoralar", "yondashuv", "afzalliklar", "bosqichlar", "jamoa", "aloqa"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-30% 0px -70% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Sayyoralar va Teams ni parallel ravishda bir vaqtda yuklaymiz
    Promise.all([
      planetService.getPlanets().catch(() => []),
      teamService.getTeams().catch(() => []),
      fetch(STATS_API).then(r => r.json()).catch(() => null),
    ]).then(([planetsData, teamsData, statsData]) => {
      // Planets
      const planetArr = Array.isArray(planetsData) ? planetsData : (planetsData as any)?.value || [];
      if (planetArr.length > 0) {
        const mapped: ApiPlanet[] = planetArr.map((p: any, i: number) => {
          const rawId = (p.id as string | number | undefined)?.toString() || "";
          const planetTitle = (p.title as string) || (p.name as string) || "";
          const id = mapDbIdToPlanetId(planetTitle) || mapDbIdToPlanetId(rawId) || PLANET_ID_MAP[i] || `planet-${(p.id as number) ?? i}`;
          // Rasm: uploads yo'lidan faqat nisbiy yo'l olamiz (server rasmlar uchun)
          const rawImg = p.image as string | null;
          const img = rawImg
            ? rawImg.replace(/^https?:\/\/[^/]+/, "") // absolute URL dan relative qilish
            : DEFAULT_PLANET_IMAGES[id] || `/planets/${id}.png`;
          return {
            id,
            name: planetTitle,
            skill: planetTitle,
            description: (p.description as string) || "",
            status: (p.status as "active" | "soon") || "soon",
            image: img,
          };
        });
        setApiPlanets(mapped);
      }

      // Teams
      const teamArr = Array.isArray(teamsData) ? teamsData : (teamsData as any)?.value || [];
      if (teamArr.length > 0) {
        setApiTeams(teamArr.map((t: any, i: number) => {
          const rawImg = t.image as string | null;
          const img = rawImg
            ? rawImg.replace(/^https?:\/\/[^/]+/, "") // absolute URL dan relative qilish
            : `/images/team/member${(i % 4) + 1}.svg`;
          return {
            id: t.id as number,
            firstName: (t.firstName as string) || (t.first_name as string) || "",
            lastName: (t.lastName as string) || (t.last_name as string) || "",
            direction: (t.direction as string) || (t.role as string) || "",
            description: (t.description as string) || "",
            image: img,
          };
        }));
      }

      // Stats
      if (statsData) setApiStats(statsData);
    });
  }, []);

  const handleTry = () => {
    toast.success(t.toast.try);
    scrollToSection("sayyoralar");
  };

  const handleContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("/api/website/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          message: formData.get("message")
        })
      });
      
      if (response.ok) {
        toast.success(t.toast.contact);
        form.reset();
      } else {
        toast.error("Xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring.");
      }
    } catch (error) {
      toast.error("Tarmoq xatosi. Iltimos keyinroq qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    ["raqamlar", t.nav.shortStats],
    ["sayyoralar", t.nav.shortOrbit],
    ["yondashuv", t.nav.shortMethod],
    ["afzalliklar", t.nav.shortAdvantages],
    ["bosqichlar", t.nav.shortPath],
    ["aloqa", t.nav.shortContact],
  ] as const;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f8f6ff] text-[#23143f]">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-3 rounded-[26px] liquid-glass-card bg-gradient-to-r from-[#170e38]/92 via-[#22144e]/95 to-[#170e38]/92 px-4 py-3 text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_20px_60px_rgba(10,5,30,0.5)] backdrop-blur-2xl border border-white/35 sm:px-6">
          <a
            href="#bosh"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("bosh");
            }}
            className="flex items-center gap-1.5 sm:gap-2 group"
            aria-label="Kichik Alloma bosh sahifa"
          >
            <img src="/logo-a.png" alt="Kichik Alloma A" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(246,201,79,0.4)]" />
            <img src="/logo-text.png" alt="Kichik Alloma Yozuvi" className="h-6 sm:h-8 w-auto object-contain transition-all duration-300 group-hover:opacity-90" />
          </a>

          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Asosiy navigatsiya">
            {navItems.map(([target, label]) => {
              const isActive = activeSection === target;
              return (
                <button
                  key={`${language}-${target}`}
                  type="button"
                  onClick={() => scrollToSection(target)}
                  className={`relative text-xs sm:text-sm font-black tracking-tight transition-colors duration-200 px-3.5 py-1.5 rounded-xl focus-visible:outline-none ${
                    isActive ? "text-[#1b0e3b]" : "text-[#f6c94f] hover:text-[#ffe894]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="liquidGlassActiveTab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        mass: 0.8,
                      }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f6c94f] via-[#ffd768] to-[#ffe38a] border border-[#fff4c2]/80 shadow-[0_4px_20px_rgba(246,201,79,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.8)] z-0"
                    />
                  )}
                  <span className="relative z-10 drop-shadow-sm">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Custom Language Switcher */}
            <button
              ref={langBtnRef}
              type="button"
              onClick={() => {
                if (langBtnRef.current) {
                  const r = langBtnRef.current.getBoundingClientRect();
                  setLangPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
                }
                setLangDropdownOpen(!langDropdownOpen);
              }}
              className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-3.5 text-xs font-black tracking-[0.12em] text-white transition hover:bg-white/25 active:scale-[0.98] backdrop-blur-md shadow-sm"
            >
              <span>{language.toUpperCase()}</span>
              <svg className={`h-3 w-3 text-white/80 transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleTry}
              className="group hidden h-11 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f6c94f] via-[#ffd978] to-[#ffe38a] px-5 text-xs font-black text-[#1c1038] shadow-[0_8px_25px_rgba(246,201,79,0.35)] transition duration-200 hover:scale-[1.03] active:scale-[0.97] border border-[#fff4c2]/50 sm:flex"
            >
              {t.hero.primary}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.7} />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/25 bg-white/15 text-white lg:hidden backdrop-blur-md"
              aria-label="Menyuni ochish"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-[1380px] rounded-[22px] border border-white/25 liquid-glass-card bg-[#140b2e]/95 p-2 shadow-2xl backdrop-blur-2xl lg:hidden">
            {navItems.map(([target, label]) => (
              <button
                key={target}
                type="button"
                onClick={() => {
                  scrollToSection(target);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-extrabold transition ${
                  activeSection === target ? "bg-[#f6c94f] text-[#27163e]" : "text-[#f6c94f] hover:bg-white/10 hover:text-[#ffe894]"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleTry}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f6c94f] to-[#ffe38a] px-4 py-3 text-sm font-black text-[#1c1038] shadow-md active:scale-[0.97] sm:hidden"
            >
              {t.hero.primary} <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>

      {langDropdownOpen && (
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setLangDropdownOpen(false)} />
          <div
            className="fixed z-[100] w-24 overflow-hidden rounded-xl border border-white/25 bg-[#180e38]/90 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-[fade-in_0.15s_ease-out]"
            style={{ top: langPos.top, right: langPos.right }}
          >
            {(["uz", "ru", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setLanguage(lang);
                  setLangDropdownOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-black tracking-[0.1em] transition ${
                  language === lang ? "bg-[#f6c94f] text-[#27163e]" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{lang.toUpperCase()}</span>
                {language === lang && (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <main>
        <SectionDepthWrapper id="bosh">
          <section className="relative isolate flex min-h-[780px] items-end overflow-hidden bg-[#0b0e27] pb-20 pt-36 sm:min-h-[820px] sm:pb-24 lg:items-center lg:pb-0">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-75"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
          >
            <source src={assets.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_18%,rgba(124,88,247,0.42),transparent_27%),linear-gradient(90deg,rgba(10,7,36,0.96)_4%,rgba(10,7,36,0.78)_44%,rgba(10,7,36,0.28)_100%)]" />
          <div className="absolute -bottom-28 left-[45%] -z-10 h-80 w-80 rounded-full bg-[#6c45dd]/25 blur-[90px]" />
          <div className="absolute right-[14%] top-[32%] hidden h-2 w-2 rounded-full bg-[#f6c94f] shadow-[0_0_24px_10px_rgba(246,201,79,0.3)] lg:block" />

          <div className="container relative z-10">
            <div className="max-w-3xl pt-6">
              <h1 className="max-w-[820px] text-[clamp(3.1rem,7vw,5.4rem)] font-black leading-[0.96] tracking-[-0.065em] text-white">
                <BlurText text={t.hero.title} delay={0.25} />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-7 max-w-2xl text-base font-semibold leading-8 text-white/74 sm:text-lg"
              >
                {t.hero.copy}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={handleTry}
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#f6c94f] px-6 text-base font-black text-[#28163f] shadow-[0_18px_40px_rgba(246,201,79,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffdc77] active:scale-[0.97]"
                >
                  {t.hero.primary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.8} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("raqamlar")}
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 text-base font-black text-white backdrop-blur-sm transition hover:bg-white/18 active:scale-[0.97]"
                >
                  <Rocket className="h-4 w-4 text-[#f6c94f] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  {t.hero.secondary}
                </button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-8 max-w-xl border-l-2 border-[#f6c94f] pl-4 text-sm font-bold leading-6 text-white/60"
              >
                {t.hero.note}
              </motion.p>
            </div>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="raqamlar">
          <section className="relative scroll-mt-24 bg-gradient-to-b from-[#fbfaff] to-[#f2efff] py-16 sm:py-20 overflow-hidden">
          <div className="container max-w-5xl mx-auto">
            <Reveal delay={0.1}>
              <div className="rounded-[36px] liquid-glass-card bg-white/75 p-6 sm:p-10 shadow-[0_20px_60px_rgba(108,69,221,0.08)] backdrop-blur-xl">
                <div className="grid gap-8 md:grid-cols-3 md:gap-0 items-center divide-y md:divide-y-0 md:divide-x divide-[#6c45dd]/15">
                  
                  <div className="text-center px-4 py-4 sm:py-2 group">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-[#6c45dd] to-[#d54381] leading-none pb-1 transition-transform duration-300 group-hover:scale-105">
                      <AnimatedCounter value={apiStats?.totalPlanets ?? 1060844} />
                    </div>
                    <div className="mt-3 text-xs sm:text-sm font-black tracking-[0.16em] text-[#6d5b91] uppercase transition-colors duration-300 group-hover:text-[#6c45dd]">
                      {t.stats.students}
                    </div>
                    <div className="mx-auto mt-3.5 h-[3px] w-8 rounded-full bg-gradient-to-r from-[#6c45dd] to-[#f6c94f] transition-all duration-300 group-hover:w-16" />
                  </div>

                  <div className="text-center px-4 py-4 sm:py-2 group">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-[#6c45dd] to-[#d54381] leading-none pb-1 transition-transform duration-300 group-hover:scale-105">
                      <AnimatedCounter value={apiStats?.activePlanets ?? 30} />
                    </div>
                    <div className="mt-3 text-xs sm:text-sm font-black tracking-[0.16em] text-[#6d5b91] uppercase transition-colors duration-300 group-hover:text-[#6c45dd]">
                      {t.stats.courses}
                    </div>
                    <div className="mx-auto mt-3.5 h-[3px] w-8 rounded-full bg-gradient-to-r from-[#6c45dd] to-[#f6c94f] transition-all duration-300 group-hover:w-16" />
                  </div>

                  <div className="text-center px-4 py-4 sm:py-2 group">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-[#6c45dd] to-[#d54381] leading-none pb-1 transition-transform duration-300 group-hover:scale-105">
                      <AnimatedCounter value={apiStats?.totalTeams ?? 30} />
                    </div>
                    <div className="mt-3 text-xs sm:text-sm font-black tracking-[0.16em] text-[#6d5b91] uppercase transition-colors duration-300 group-hover:text-[#6c45dd]">
                      {t.stats.specialists}
                    </div>
                    <div className="mx-auto mt-3.5 h-[3px] w-8 rounded-full bg-gradient-to-r from-[#6c45dd] to-[#f6c94f] transition-all duration-300 group-hover:w-16" />
                  </div>

                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="sayyoralar">
          <section
            className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/space-bg.jpg')" }}
          >
            <CosmicBackgroundAnimation variant="dark" />
            <div className="absolute inset-0 bg-[#0c061e]/40 pointer-events-none" />
            <div className="container relative z-10">
              <div className="grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
              <Reveal>
                <div>
                  <SectionHeader align="left" light eyebrow={t.orbit.eyebrow} title={t.orbit.title} copy={t.orbit.copy} />
                  <div className="mt-9 flex items-center gap-4 rounded-[24px] border border-white/15 bg-white/10 backdrop-blur-md p-4 shadow-[0_14px_35px_rgba(0,0,0,0.2)]">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-[#f6c94f]">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <p className="text-sm font-extrabold leading-6 text-[#fffdf5]">{t.orbit.detail}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="orbital-board relative mx-auto w-full max-w-[690px] overflow-hidden rounded-[34px] border border-white bg-[linear-gradient(145deg,#7151d7_0%,#5839bb_48%,#2e1a65_100%)] p-2 min-[400px]:p-3 sm:p-6 shadow-[0_25px_70px_rgba(59,36,134,0.28)]">
                <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:radial-gradient(rgba(255,255,255,0.54)_1px,transparent_1px)] [background-size:23px_23px]" />

                {/* Responsive spacer to maintain proper container aspect */}
                <div className="pointer-events-none invisible h-[430px] min-[400px]:h-[480px] min-[500px]:h-[560px] sm:h-[680px] lg:h-[740px]" />

                {/* Orbital dashed ring (dynamically scales with orbit-radius) */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute left-1/2 top-1/2 h-[calc(var(--orbit-radius)*2)] w-[calc(var(--orbit-radius)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20 animate-orbit-cw-slow" />
                </div>

                {/* Sun center (Prominent, clean, larger than all orbiting planets without harsh border lines) */}
                <div
                  onClick={() => {
                    setActiveModalPlanet({
                      id: "sun",
                      name: "Quyosh — Kichik Alloma Markazi",
                      desc: "Barcha 8 ta intellektual va fazoviy ko'nikma modullarini birlashtiruvchi asosiy koinot markazi.",
                      image: apiPlanets.find((p) => p.id === "sun")?.image || DEFAULT_PLANET_IMAGES.sun,
                      ageGroup: "5 - 12 yosh",
                      modulesCount: 24,
                      skills: ["Koinot metodologiyasi", "Intellektual rivojlanish", "Kompakt o'yinlar"],
                    });
                  }}
                  className="group pointer-events-auto cursor-pointer absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none"
                >
                  <div className="relative grid place-items-center h-[88px] w-[88px] min-[400px]:h-[100px] min-[400px]:w-[100px] min-[500px]:h-[120px] min-[500px]:w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[165px] lg:w-[165px]">
                    {/* Solar Corona & Soft Radiant Energy Glow (No harsh border line) */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffc837_0%,#ff8008_65%,transparent_80%)] opacity-60 blur-xl animate-pulse pointer-events-none" />
                    <div className="absolute -inset-3 rounded-full bg-[#ff9900] opacity-25 blur-2xl animate-ping pointer-events-none" style={{ animationDuration: "5s" }} />

                    {/* Sun Core Image */}
                    <img
                      src={apiPlanets.find((p) => p.id === "sun")?.image || DEFAULT_PLANET_IMAGES.sun}
                      alt="Quyosh"
                      className="relative z-10 h-full w-full rounded-full object-contain drop-shadow-[0_0_35px_rgba(255,160,0,0.9)] transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PLANET_IMAGES.sun;
                      }}
                    />
                  </div>
                </div>

                {/* Planets in orbit around the sun */}
                <div className="absolute inset-0 z-10 animate-orbit-cw-slow">
                  {(() => {
                    const planetSkillsDetails: Record<string, { age: string; modules: number; skills: string[] }> = {
                      sun: { age: "5 - 12 yosh", modules: 24, skills: ["Koinot metodologiyasi", "Intellektual rivojlanish", "Diqqat o'yinlari"] },
                      math: { age: "6 - 12 yosh", modules: 16, skills: ["Mantiqiy masalalar", "Matematik hisob", "Tahliliy fikrlash"] },
                      memory: { age: "5 - 11 yosh", modules: 14, skills: ["Vizual xotira", "Assotsiativ eslab qolish", "Diqqat jamlash"] },
                      space: { age: "6 - 12 yosh", modules: 18, skills: ["Fazoviy tasavvur", "3D geometriya", "Vizual konstruksiya"] },
                      logic: { age: "7 - 12 yosh", modules: 15, skills: ["Strategik rejalashtirish", "Deduktiv mantiq", "Muqobil yechimlar"] },
                      speed: { age: "5 - 10 yosh", modules: 12, skills: ["Tezkor javob", "Reaksiya tezligi", "Sensomotorka"] },
                      creative: { age: "5 - 12 yosh", modules: 20, skills: ["Kreativ fikrlash", "Rasm va dizayn", "G'oya yaratish"] },
                      verbal: { age: "6 - 12 yosh", modules: 14, skills: ["Nutq boyligi", "Lug'at zaxirasi", "Muloqot ko'nikmasi"] },
                      focus: { age: "5 - 11 yosh", modules: 16, skills: ["Konsentratsiya", "Diqqat o'ynashmasligi", "Sabr va intizom"] },
                    };

                    return planets.map((planet, i) => {
                      const apiPlanet = apiPlanets.find((p) => p.id === planet.id);
                      const name = apiPlanet?.skill || t.orbit.names[planet.id];
                      const desc = apiPlanet?.description || t.orbit.descriptions[planet.id];
                      const angle = i * 45 - 90; // 8 planets, 45 degrees step, starting at top
                      const angleRad = (angle * Math.PI) / 180;
                      const cos = Math.cos(angleRad);
                      const sin = Math.sin(angleRad);
                      const planetImage = apiPlanet?.image || DEFAULT_PLANET_IMAGES[planet.id];
                      const planetDetails = planetSkillsDetails[planet.id] || { age: "6 - 12 yosh", modules: 15, skills: ["Intellektual rivojlanish", "Mantiq"] };

                      return (
                        <div
                          key={planet.id}
                          className="absolute text-center z-10"
                          style={{
                            left: `calc(50% + var(--orbit-radius) * ${cos.toFixed(4)})`,
                            top: `calc(50% + var(--orbit-radius) * ${sin.toFixed(4)})`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div className="animate-orbit-ccw-slow">
                            <div
                              onClick={() => {
                                setActiveModalPlanet({
                                  id: planet.id,
                                  name,
                                  desc,
                                  image: planetImage,
                                  ageGroup: planetDetails.age,
                                  modulesCount: planetDetails.modules,
                                  skills: planetDetails.skills,
                                });
                              }}
                              className="group transition-transform duration-300 hover:scale-115 cursor-pointer"
                            >
                              <div className="planet-float relative mx-auto grid h-[52px] w-[52px] min-[400px]:h-[60px] min-[400px]:w-[60px] min-[500px]:h-[70px] min-[500px]:w-[70px] sm:h-[92px] sm:w-[92px] lg:h-[102px] lg:w-[102px] place-items-center">
                                <div className="absolute inset-1 rounded-full bg-[#a78cff] opacity-30 blur-lg" />
                                
                                {/* Decoupled hover translate container */}
                                <div className="relative z-10 transition-transform duration-200 group-hover:-translate-y-1.5 w-full h-full flex items-center justify-center">
                                  <img
                                    src={planetImage}
                                    alt={name}
                                    className="h-full w-full rounded-full object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = DEFAULT_PLANET_IMAGES[planet.id];
                                    }}
                                  />
                                </div>
                              </div>
                              <p className="mt-1 max-w-20 min-[400px]:max-w-24 sm:max-w-28 text-[9px] min-[400px]:text-[10px] font-black leading-tight text-white sm:text-xs">{name}</p>
                              <p className="mx-auto mt-0.5 max-w-20 min-[400px]:max-w-24 sm:max-w-28 text-[7.5px] min-[400px]:text-[8px] font-bold leading-3 text-white/65 sm:text-[9px]">{desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="yondashuv">
          <section className="relative scroll-mt-24 bg-[#dcd1ff] py-24 sm:py-32 overflow-hidden">
            <CosmicBackgroundAnimation variant="light" />
            <div className="container relative z-10">
            <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
              <Reveal>
                <div>
                  <SectionHeader align="left" eyebrow={t.method.eyebrow} title={t.method.title} copy={t.method.copy} />
                  <div className="mt-10 space-y-3">
                    {t.method.cards.map((card, index) => {
                      const icons = [Compass, MessageCircleQuestion, Rocket];
                      const Icon = icons[index];
                      const iconClasses = [
                        "transition-transform duration-500 group-hover:rotate-180",
                        "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12",
                        "transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1",
                      ];
                      return (
                        <Reveal key={card.label} delay={index * 0.1}>
                          <article className="group flex gap-4 sm:gap-5 rounded-[26px] liquid-glass-card bg-white/70 p-6 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_16px_40px_rgba(64,39,128,0.12)] backdrop-blur-2xl border border-white/60 transition duration-300 hover:-translate-y-1 hover:bg-white/85">
                            <div className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-[#6c45dd] to-[#8d62f0] text-white shadow-[0_8px_22px_rgba(108,69,221,0.35)] transition-transform duration-300 group-hover:scale-105">
                              <Icon className={`h-6 w-6 ${iconClasses[index]}`} />
                            </div>
                            <div>
                              <div className="text-xs font-black tracking-[0.18em] text-[#714fe0]">{card.label}</div>
                              <h3 className="mt-1 text-xl font-black tracking-tight text-[#221043]">{card.title}</h3>
                              <p className="mt-1.5 text-sm font-bold leading-relaxed text-[#4b356f]">{card.copy}</p>
                            </div>
                          </article>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="relative mx-auto w-full max-w-md lg:pt-8">
                  <div className="absolute -inset-7 -z-0 rounded-[48px] bg-[#8d6be8]/25 blur-2xl" />
                  <div className="relative overflow-hidden rounded-[34px] border-[8px] border-white/60 liquid-glass-card bg-[#38206d]/90 p-3 shadow-[0_30px_70px_rgba(45,21,95,0.28)] backdrop-blur-2xl">
                    <img src={assets.constellationImage} alt="Kichik Alloma kosmik maketi" className="w-full h-auto rounded-[24px] object-cover" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="afzalliklar">
          <section className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-[#dcd1ff] via-[#fff3f7] to-[#fbfaff] py-24 sm:py-32">
          {/* Floating Crystal Top-Left */}
          <div className="absolute left-[8%] top-[15%] h-12 w-8 rotate-12 rounded-lg border border-white/40 bg-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-[2px] hidden md:block opacity-60" />
          {/* Floating Petal Bottom-Right */}
          <div className="absolute right-[6%] bottom-[12%] h-10 w-8 -rotate-45 rounded-br-3xl rounded-tl-3xl bg-gradient-to-tr from-[#d54381]/30 to-[#f6c94f]/20 blur-[1px] hidden md:block opacity-50" />
          
          <div className="container relative z-10">
            <SectionHeader align="center" title={t.advantages.title} />

            {/* Main Horizontal Hanging Wire/String Line Across All Posters */}
            <div className="relative mt-20">
              <div className="absolute -top-10 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#8d6ee0]/40 to-transparent border-b border-dashed border-[#8d6ee0]/60 hidden sm:block z-0" />

              <StaggerGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-start">
                {t.advantages.cards.map((card, index) => {
                  const icons = [GraduationCap, Award, MessageSquare, Clock];
                  const Icon = icons[index];
                  const sphereStyles = [
                    { glow: "from-[#ff79b0]/30 to-[#ff3b80]/10", border: "from-white to-[#ffebf3] bg-[#fff5f8]", icon: "text-[#d54381]" },
                    { glow: "from-[#a78cff]/30 to-[#6c45dd]/10", border: "from-white to-[#f0ebff] bg-[#f8f6ff]", icon: "text-[#6c45dd]" },
                    { glow: "from-[#4ade80]/30 to-[#10b981]/10", border: "from-white to-[#ebfaf0] bg-[#f4fbf7]", icon: "text-[#10b981]" },
                    { glow: "from-[#f6c94f]/30 to-[#e65c00]/10", border: "from-white to-[#fff9eb] bg-[#fffdf9]", icon: "text-[#e65c00]" },
                  ];
                  const styles = sphereStyles[index];

                  // Natural hanging poster tilt angles
                  const hangingAngles = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1.5"];
                  const currentAngle = hangingAngles[index];

                  return (
                    <StaggerItem key={card.title} className="relative pt-6">
                      {/* Hanging Ropes & Clips */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-between w-28 pointer-events-none">
                        {/* Left Rope & Pin */}
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-0.5 bg-gradient-to-b from-[#8d6ee0] to-[#d54381]" />
                          <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-[#f6c94f] to-[#ffe89c] border border-white shadow-md" />
                        </div>
                        {/* Right Rope & Pin */}
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-0.5 bg-gradient-to-b from-[#8d6ee0] to-[#d54381]" />
                          <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-[#f6c94f] to-[#ffe89c] border border-white shadow-md" />
                        </div>
                      </div>

                      {/* Top Wooden Hanger Bar */}
                      <div className="relative mx-auto h-3 w-[88%] rounded-t-lg bg-[#5c3a21] border-b border-[#3d2412] shadow-sm z-10" />

                      {/* Hanging Poster Article Body */}
                      <article className={`group origin-top transform ${currentAngle} transition-all duration-500 hover:rotate-0 hover:scale-105 hover:-translate-y-2 bg-white/95 border border-white/80 rounded-b-[36px] rounded-t-[6px] p-8 text-center shadow-[0_20px_50px_rgba(108,69,221,0.08)] backdrop-blur-md relative z-0 glass-card`}>
                        {/* Subtle Paper Texture Line */}
                        <div className="absolute top-2 left-6 right-6 border-t border-dashed border-[#e2d9f7]" />

                        <div className="relative mx-auto mt-2 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                          {/* Outer glow */}
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${styles.glow} blur-md opacity-80 group-hover:scale-110 transition-transform duration-300`} />
                          {/* Inner Sphere Container */}
                          <div className={`absolute inset-0 rounded-full border border-white/70 bg-gradient-to-tr ${styles.border} shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.03),3px_3px_8px_rgba(0,0,0,0.02)] flex items-center justify-center`} />
                          {/* Icon */}
                          <Icon className={`relative z-10 h-6 w-6 ${styles.icon} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`} />
                        </div>

                        <h3 className="text-lg font-black tracking-tight text-[#2d174e]">{card.title}</h3>
                        <div className="mx-auto mt-2.5 h-0.5 w-6 rounded-full bg-[#ebdffd] transition-all duration-300 group-hover:w-12 group-hover:bg-[#d54381]" />
                        <p className="mt-4 text-xs font-semibold leading-relaxed text-[#6d5b91]">{card.copy}</p>
                      </article>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </div>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="bosqichlar">
          <section className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-[#fbfaff] via-[#f0ebff] to-[#fbfaff] py-20 sm:py-28">
          <div className="container relative z-10">
            {/* School Chalkboard Main Frame with 3D Opening Doors */}
            <ChalkboardOpeningFrame>
              <div className="relative overflow-hidden rounded-[36px] sm:rounded-[44px] border-[12px] sm:border-[18px] border-[#5e3b22] bg-gradient-to-b from-[#264e39] via-[#1e3f2e] to-[#163324] p-8 sm:p-12 lg:p-16 shadow-[inset_0_4px_30px_rgba(0,0,0,0.6),0_25px_60px_rgba(0,0,0,0.35)]">
                
                {/* Chalk Dust Smudges Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_30%_35%,rgba(255,255,255,0.12)_0%,transparent_55%),radial-gradient(ellipse_at_75%_65%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
                
                {/* Subtle Chalkboard Slate Noise Grid Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                
                {/* Chalk Corner Doodles */}
                <div className="absolute top-6 right-8 text-[#f7d978]/40 font-mono text-xs tracking-widest hidden md:block select-none pointer-events-none">
                  ★ KICHIK ALLOMA — MAKTAB DOSKASI ★
                </div>

                <div className="relative z-10 grid gap-12 lg:grid-cols-[0.77fr_1.23fr] lg:gap-16 items-center">
                  <Reveal>
                    <div className="max-w-2xl text-left">
                      <SectionHeader align="left" light eyebrow={t.steps.eyebrow} title={t.steps.title} copy={t.steps.copy} />
                      
                      <div className="mt-8 flex items-end gap-4 border-y border-white/25 py-5">
                        <span className="font-mono text-5xl font-black tracking-[-0.14em] text-[#f7d978]">03</span>
                        <p className="pb-1 text-xs font-black uppercase tracking-[0.14em] text-[#e0ece5]">{t.steps.route} / {t.steps.eyebrow}</p>
                      </div>
                      
                      <button type="button" onClick={handleTry} className="group mt-9 inline-flex h-14 items-center gap-2 rounded-2xl bg-[#f7d978] px-7 text-base font-black text-[#16261d] shadow-[0_14px_30px_rgba(247,217,120,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffe38a] active:scale-[0.97]">
                        {t.steps.button} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.8} />
                      </button>
                    </div>
                  </Reveal>

                  <StaggerGroup className="relative grid gap-5 py-2 lg:py-0">
                    <div className="pointer-events-none absolute bottom-4 left-10 top-4 border-l border-dashed border-[#f7d978]/40 lg:left-[25%]" />
                    {t.steps.items.map((item, index) => {
                      const icons = [Sparkles, MessageCircleQuestion, CheckCircle2];
                      const Icon = icons[index];
                      const offsets = ["lg:mr-12", "lg:ml-14", "lg:mr-6"];
                      const iconClasses = [
                        "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12",
                        "transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12",
                        "transition-transform duration-300 group-hover:scale-125",
                      ];
                      return (
                        <StaggerItem key={item.title}>
                          <article className={`group observation-card relative z-10 grid grid-cols-[4.6rem_1fr] gap-4 sm:gap-6 rounded-[28px] liquid-glass-card bg-gradient-to-r from-[#2a5540]/85 via-[#1e4432]/90 to-[#193a2a]/95 p-6 sm:p-7 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),0_20px_50px_rgba(10,30,20,0.4)] backdrop-blur-2xl border border-white/35 transition duration-300 hover:-translate-y-1.5 hover:border-[#f7d978]/80 hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_25px_60px_rgba(247,217,120,0.25)] sm:grid-cols-[6.5rem_1fr] ${offsets[index]}`}>
                            <div className="relative flex flex-col items-center gap-2.5 border-r border-dashed border-white/30 pr-5">
                              <span className="text-[3rem] font-black leading-none tracking-[-0.1em] text-[#f7d978] drop-shadow-[0_2px_10px_rgba(247,217,120,0.35)]">0{index + 1}</span>
                              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-[#f7d978] border border-white/30 backdrop-blur-md shadow-sm">
                                <Icon className={`h-5 w-5 ${iconClasses[index]}`} />
                              </span>
                            </div>
                            <div className="py-1 text-left">
                              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f7d978]">{t.steps.route} / 0{index + 1}</div>
                              <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#fffdf5]">{item.title}</h3>
                              <p className="mt-2 text-sm font-semibold leading-relaxed text-[#e1f2e6]">{item.copy}</p>
                            </div>
                          </article>
                        </StaggerItem>
                      );
                    })}
                  </StaggerGroup>
                </div>

                {/* Wooden Chalk Tray Shelf at Bottom */}
                <div className="mt-12 relative flex items-center justify-between border-t-4 border-[#331c0e] bg-gradient-to-r from-[#4d2d17] via-[#613b1f] to-[#4d2d17] px-6 py-2.5 rounded-xl shadow-inner">
                  <div className="flex items-center gap-3">
                    {/* Chalk Sticks */}
                    <div className="h-3.5 w-10 rounded-sm bg-[#fffdf5] shadow-md rotate-6 border border-black/10" title="Oq bo'r" />
                    <div className="h-3.5 w-8 rounded-sm bg-[#f7d978] shadow-md -rotate-3 border border-black/10" title="Sariq bo'r" />
                    <div className="h-3.5 w-9 rounded-sm bg-[#ffb3d9] shadow-md rotate-2 hidden sm:block border border-black/10" title="Pushti bo'r" />
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f7d978] drop-shadow-sm">
                    Maktab Doskasi — Kichik Alloma
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sponge Eraser */}
                    <div className="h-4.5 w-14 rounded-md bg-[#8c5a36] border border-[#331c0e] shadow-md text-[9px] font-black text-white/70 flex items-center justify-center select-none tracking-wider" title="O'chirg'ich">
                      ERASER
                    </div>
                  </div>
                </div>

              </div>
            </ChalkboardOpeningFrame>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="jamoa">
          <section className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-[#fbfaff] to-[#f4efff] py-24 sm:py-32">
          {/* Decorative butterfly background element on the right */}
          <div className="absolute right-[4%] top-[10%] h-12 w-16 opacity-30 pointer-events-none hidden md:block">
            <svg className="h-full w-full text-[#d54381]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M 50 50 C 35 20, 10 30, 20 60 C 25 70, 45 60, 50 50 Z" />
              <path d="M 50 50 C 65 20, 90 30, 80 60 C 75 70, 55 60, 50 50 Z" />
              <path d="M 50 40 L 50 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <div className="container relative z-10">
            <SectionHeader align="center" eyebrow={t.team.eyebrow} title={t.team.title} copy={t.team.copy} />
          </div>

          {/* Auto-scrolling marquee row of team cards - Full width across screen */}
          <div className="mt-16 w-full overflow-hidden pb-8 relative z-10">
            <div className="marquee-track gap-6">
              {(() => {
                const baseList = apiTeams.length > 0 ? apiTeams : DEFAULT_TEAMS_INITIAL;

                // Quadruple the sequence if list is short to ensure edge-to-edge full screen coverage without any blank gaps
                const repeatCount = baseList.length < 6 ? 4 : 2;
                const displayList = Array.from({ length: repeatCount }, (_, rIndex) =>
                  baseList.map((member, index) => ({ ...member, id: member.id + rIndex * 100 + index }))
                ).flat();

                return displayList.map((member) => {
                  const bg = member.id % 2 === 0 ? "bg-[#e2e8f0]" : "bg-[#ffdbe8]";
                  const memberKey = `${member.firstName} ${member.lastName}`;
                  const roleName = teamRoles[language][memberKey as keyof typeof teamRoles['uz']] || member.direction;
                  const contribution = teamContributions[language][memberKey as keyof typeof teamContributions['uz']] || teamContributions[language].default;

                  return (
                    <article key={member.id} className="group w-[260px] sm:w-[280px] shrink-0 bg-white/80 border border-white/60 rounded-[32px] p-5 text-center shadow-[0_12px_40px_rgba(108,69,221,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_24px_50px_rgba(108,69,221,0.08)] glass-card">
                      <div className="relative h-[300px] w-full overflow-hidden rounded-[24px] bg-secondary/10">
                        <div className={`h-full w-full flex items-center justify-center ${bg} text-[#2d174e]/60 font-black text-5xl select-none transition-transform duration-500 group-hover:scale-105`}>
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        {member.image && (
                          <img
                            src={member.image}
                            alt={`${member.firstName} ${member.lastName}`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 transition-transform duration-500 group-hover:scale-105"
                            onLoad={(e) => {
                              (e.currentTarget as HTMLImageElement).classList.remove("opacity-0");
                            }}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.onerror = null;
                              img.src = `/images/team/member${(Math.abs(member.id) % 4) + 1}.svg`;
                              img.classList.remove("opacity-0");
                            }}
                          />
                        )}
                      </div>
                      
                      <h3 className="mt-3 text-lg font-black tracking-tight leading-tight text-[#2d174e]">
                        {member.firstName} {member.lastName}
                      </h3>
                      
                      {/* Dynamic sliding role & contribution transition */}
                      <div className="relative mt-2 overflow-hidden h-[76px] w-full">
                        {/* Role title (visible by default) */}
                        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center text-xs font-extrabold leading-normal text-[#d54381]/90 transition-all duration-300 transform group-hover:-translate-y-12 group-hover:opacity-0 px-1 text-center">
                          {roleName}
                        </div>
                        
                        {/* Experience / Description & contribution details (appears on hover) */}
                        <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-center text-[11px] font-semibold leading-tight text-[#5d4c78] opacity-0 transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 px-1 text-center">
                          {member.description && (
                            <span className="mb-1 text-[11px] font-bold text-[#6c45dd] bg-[#6c45dd]/12 px-2.5 py-0.5 rounded-full inline-block">
                              {member.description}
                            </span>
                          )}
                          <span className="line-clamp-2 text-[11px] leading-snug text-[#5d4c78]">
                            {contribution}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                });
              })()}
            </div>
          </div>
        </section>
      </SectionDepthWrapper>

        <SectionDepthWrapper id="aloqa">
        <section className="scroll-mt-24 relative overflow-hidden bg-[#dcd1ff] py-20 sm:py-28">
          <CosmicBackgroundAnimation variant="light" />
          <div className="pointer-events-none absolute left-[-12rem] top-8 h-[38rem] w-[38rem] rounded-full border border-dashed border-white/15 animate-spin-slow" />
          <div className="pointer-events-none absolute bottom-[-11rem] right-[-7rem] h-[30rem] w-[30rem] rounded-full bg-[#8162d4]/30 blur-3xl" />
          <div className="container relative z-10">
            <Reveal>
              <div className="relative grid overflow-hidden rounded-[38px] liquid-glass-card bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_25px_70px_rgba(108,69,221,0.08)] lg:grid-cols-[0.98fr_1.02fr]">
                <motion.div
                  initial={{ opacity: 0, scale: 1.04 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative flex flex-col items-center justify-center min-h-[440px] overflow-hidden bg-gradient-to-br from-white/50 to-[#ebdfff]/40 group p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/60"
                >
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(108,69,221,0.12)] border border-white/80">
                    <img src={assets.labImage} alt={t.contact.imageLabel} className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-105" />
                  </div>
                  
                  <div className="mt-8 text-center max-w-md px-2">
                    <h3 className="text-2xl font-black text-[#2d174e] mb-3 tracking-tight">
                      Ota-onalar uchun to'liq nazorat
                    </h3>
                    <p className="text-[#5d4c78] font-bold leading-relaxed text-sm sm:text-base">
                      Farzandingizning o'zlashtirish ko'rsatkichlari, o'qish odatlari va sarflagan vaqtini maxsus qulay panel (Dashboard) orqali kuzatib boring. Barchasi sizning nazoratingizda!
                    </p>
                  </div>
                </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative overflow-hidden bg-white/60 backdrop-blur-2xl p-7 sm:p-10 lg:p-12"
              >
                <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full border border-dashed border-[#6c45dd]/20 animate-spin-slow" />
                <div className="relative mb-6 flex items-center justify-between border-b border-[#6c45dd]/15 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#6c45dd]">{t.contact.formKicker}</p>
                  <span className="font-mono text-xs font-black text-[#2d174e] bg-[#f6c94f]/25 border border-[#f6c94f]/50 px-2 py-0.5 rounded-lg">REQ—01</span>
                </div>
                <form onSubmit={handleContact} className="space-y-4">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <label htmlFor="name" className="sr-only">{t.contact.name}</label>
                    <input id="name" name="name" required placeholder={t.contact.name} className="liquid-glass-input h-14 w-full rounded-2xl px-5 text-base font-bold text-[#2d174e] outline-none placeholder:text-[#5d4c78]/55 bg-white/70 border border-white/80 transition-all duration-300 focus:bg-white focus:border-[#6c45dd] focus:scale-[1.01] shadow-sm" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <label htmlFor="phone" className="sr-only">{t.contact.phone}</label>
                    <input id="phone" name="phone" type="tel" required placeholder={t.contact.phone} className="liquid-glass-input h-14 w-full rounded-2xl px-5 text-base font-bold text-[#2d174e] outline-none placeholder:text-[#5d4c78]/55 bg-white/70 border border-white/80 transition-all duration-300 focus:bg-white focus:border-[#6c45dd] focus:scale-[1.01] shadow-sm" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <label htmlFor="message" className="sr-only">{t.contact.message}</label>
                    <textarea id="message" name="message" required placeholder={t.contact.message} className="liquid-glass-input min-h-40 w-full resize-y rounded-2xl px-5 py-4 text-base font-bold text-[#2d174e] outline-none placeholder:text-[#5d4c78]/55 bg-white/70 border border-white/80 transition-all duration-300 focus:bg-white focus:border-[#6c45dd] focus:scale-[1.01] shadow-sm" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                    <button disabled={isSubmitting} type="submit" className={`group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f6c94f] via-[#ffd768] to-[#ffe38a] px-6 text-base font-black text-[#28163f] shadow-[0_14px_35px_rgba(246,201,79,0.35)] transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(246,201,79,0.5)] active:scale-[0.97]"}`}>
                      {isSubmitting ? "Yuborilmoqda..." : t.contact.submit} {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.8} />}
                    </button>
                  </motion.div>
                  <p className="px-1 text-center text-xs font-bold leading-5 text-[#5d4c78]/60">{t.contact.privacy}</p>
                </form>
              </motion.div>
            </div>
            </Reveal>

            {/* Interactive 3D Hologram Certificate Showcase directly under OBS Xavfsizlik */}
            <HolographicCertificate />
          </div>
        </section>
        </SectionDepthWrapper>

        {/* CTA Banner — eng pastda, footer oldida */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f2efff] via-[#fff5f8] to-[#dcd1ff] py-16 sm:py-24">
          <div className="container relative z-10">
            <Reveal>
              <div className="mx-auto max-w-[1000px] rounded-[48px] border border-white/60 bg-white/80 p-10 sm:p-16 text-center shadow-[0_24px_60px_rgba(108,69,221,0.05)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_36px_80px_rgba(108,69,221,0.1)] glass-card">
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] via-[#f6c94f] to-[#e6b800] leading-none pb-2 select-none drop-shadow-[0_4px_18px_rgba(246,201,79,0.4)]">
                  {t.cta.title}
                </h2>
                <p className="mt-6 text-sm sm:text-base font-bold leading-relaxed text-[#5d4c78] max-w-2xl mx-auto">
                  {t.cta.copy}
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleTry}
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f6c94f] via-[#ffd768] to-[#ffe38a] px-8 text-base font-black text-[#28163f] shadow-[0_14px_30px_rgba(246,201,79,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(246,201,79,0.5)] active:scale-[0.98]"
                  >
                    {t.cta.button} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.8} />
                  </button>
                </div>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {/* Google Play Button */}
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-black px-5 py-2.5 text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.25391 1.70605C3.08789 1.87988 3 2.13867 3 2.47852V21.5215C3 21.8613 3.08789 22.1201 3.25391 22.2939L3.33398 22.373L13.8828 11.8242V11.6758L3.33398 1.62695L3.25391 1.70605Z" fill="#3bccff"/>
                      <path d="M17.4102 15.3516L13.8828 11.8242V11.6758L17.4102 8.14844L17.4893 8.19336L21.666 10.6025C22.8525 11.2861 22.8525 12.3916 21.666 13.0762L17.4893 15.4854L17.4102 15.3516Z" fill="#ffd600"/>
                      <path d="M17.4893 15.4854L13.8828 11.875L3.33398 22.4238C3.72266 22.8125 4.35449 22.8594 5.08887 22.4365L17.4893 15.4854Z" fill="#ff3366"/>
                      <path d="M17.4893 8.19336L5.08887 1.24219C4.35449 0.819336 3.72266 0.866211 3.33398 1.25488L13.8828 11.8037L17.4893 8.19336Z" fill="#00e676"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[9px] font-black tracking-[0.14em] text-white/50 leading-none uppercase">GET IT ON</p>
                      <p className="mt-1.5 text-sm font-black leading-none">Google Play</p>
                    </div>
                  </a>

                  {/* App Store Button */}
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-black px-5 py-2.5 text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                  >
                    <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[9px] font-black tracking-[0.14em] text-white/50 leading-none uppercase">Download on the</p>
                      <p className="mt-1.5 text-sm font-black leading-none">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SectionDepthWrapper id="footer">
      <footer className="bg-[#0a061b] text-white/60 py-16 border-t border-white/10 min-h-[360px] flex flex-col justify-between relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#6c45dd]/10 blur-[100px]" />
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#f6c94f]/5 blur-[100px]" />

        <div className="container relative z-10">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between pb-12 border-b border-white/10">
            {/* Left side: Brand Logo & Tagline */}
            <div className="flex flex-col items-start text-left max-w-sm">
              <a
                href="#bosh"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("bosh");
                }}
                className="flex items-center gap-1.5 sm:gap-2 group"
                aria-label="Kichik Alloma bosh sahifa"
              >
                <img src="/logo-a.png" alt="Kichik Alloma A" className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(246,201,79,0.4)]" />
                <img src="/logo-text.png" alt="Kichik Alloma Yozuvi" className="h-6 sm:h-7 w-auto object-contain transition-all duration-300 group-hover:opacity-90" />
              </a>
              <p className="mt-4 text-xs sm:text-sm font-semibold leading-relaxed text-white/50">
                {t.footer.copy}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-white/40">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Koinot ta'lim platformasi</span>
              </div>
            </div>

            {/* Right side: Grouped Columns pushed to the right */}
            <div className="flex flex-wrap gap-12 sm:gap-20 lg:gap-28 lg:justify-end">
              {/* Column 1: KOMPANIYA */}
              <div className="text-left min-w-[140px]">
                <h4 className="text-xs font-black tracking-[0.2em] text-white uppercase mb-5 flex items-center gap-2">
                  <span className="h-1 w-3 rounded-full bg-[#f6c94f]" />
                  {t.footer.col2}
                </h4>
                <ul className="space-y-3 text-xs font-bold text-white/60">
                  <li>
                    <button onClick={() => scrollToSection("sayyoralar")} className="hover:text-[#f6c94f] transition-colors duration-200">
                      {language === "uz" ? "Biz haqimizda" : language === "ru" ? "О нас" : "About Us"}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection("jamoa")} className="hover:text-[#f6c94f] transition-colors duration-200">
                      {language === "uz" ? "Jamoamiz" : language === "ru" ? "Команда" : "Our Team"}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection("afzalliklar")} className="hover:text-[#f6c94f] transition-colors duration-200">
                      {language === "uz" ? "Afzalliklari" : language === "ru" ? "Преимущества" : "Advantages"}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection("bosqichlar")} className="hover:text-[#f6c94f] transition-colors duration-200">
                      {language === "uz" ? "Ota-onalar uchun" : language === "ru" ? "Для родителей" : "For Parents"}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: ALOQA */}
              <div className="text-left min-w-[140px]">
                <h4 className="text-xs font-black tracking-[0.2em] text-white uppercase mb-5 flex items-center gap-2">
                  <span className="h-1 w-3 rounded-full bg-[#6c45dd]" />
                  {t.footer.col3}
                </h4>
                <ul className="space-y-3.5 text-xs font-bold">
                  <li>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-200">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#ff0000]/15 group-hover:border-[#ff0000]/30 transition-all duration-300">
                        <svg className="h-4 w-4 text-[#ff0000] fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.04 0 12 0 12s0 3.96.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.96 24 12 24 12s0-3.96-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                      <span>YouTube</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-200">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#e1306c]/15 group-hover:border-[#e1306c]/30 transition-all duration-300">
                        <svg className="h-4 w-4 text-[#e1306c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </div>
                      <span>Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-200">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#0088cc]/15 group-hover:border-[#0088cc]/30 transition-all duration-300">
                        <svg className="h-4 w-4 text-[#0088cc] fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6 1.48-1.52 2.72-2.58 3.99-3.85.57-.57 1.15-1.33 1.15-1.33 0 0-.08.08-.22.22-.52.52-1.48 1.15-2.23 1.65l-2.23 1.47c-.55.37-1.05.55-1.5.53-.49-.02-.96-.29-1.33-.41-.45-.15-.81-.23-.78-.49.02-.14.21-.29.58-.45 2.27-.99 3.79-1.65 4.56-1.97 4.35-1.8 5.25-2.12 5.84-2.13.13 0 .42.03.61.19.16.13.21.32.22.46-.01.1-.01.21-.02.32z" />
                        </svg>
                      </div>
                      <span>Telegram</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs font-semibold text-white/40">
            <span>&copy; 2026 Kichik Alloma. {t.footer.rights}</span>
          </div>
        </div>
      </footer>
      </SectionDepthWrapper>

      {/* Planet Skill Profile Modal */}
      <PlanetModal
        planet={activeModalPlanet}
        onClose={() => setActiveModalPlanet(null)}
        onTry={handleTry}
      />
    </div>
  );
}

function PlanetStrip({
  items,
  t,
  compact = false,
  apiPlanets = [],
}: {
  items: readonly {
    id: "mars" | "neptune" | "saturn" | "earth" | "uran" | "jupiter" | "venus" | "mercury";
    from: string;
    to: string;
    ring?: boolean;
    tone: string;
  }[];
  t: (typeof content)[Locale];
  compact?: boolean;
  apiPlanets?: ApiPlanet[];
}) {
  return (
    <div className={`relative flex w-full items-start justify-center gap-5 sm:gap-28 ${compact ? "max-w-[63%]" : "max-w-[96%]"}`}>
      {items.map((planet, index) => <PlanetMini key={planet.id} planet={planet} t={t} index={index} apiPlanet={apiPlanets.find((p) => p.id === planet.id)} />)}
    </div>
  );
}

function PlanetMini({
  planet,
  t,
  index,
  apiPlanet,
}: {
  planet: {
    id: "mars" | "neptune" | "saturn" | "earth" | "uran" | "jupiter" | "venus" | "mercury";
    from: string;
    to: string;
    ring?: boolean;
    tone: string;
  };
  t: (typeof content)[Locale];
  index: number;
  apiPlanet?: ApiPlanet;
}) {
  const hasApiImage = apiPlanet && apiPlanet.image;
  const planetName = apiPlanet?.skill || t.orbit.names[planet.id];
  const planetDesc = apiPlanet?.description || t.orbit.descriptions[planet.id];

  return (
    <div className="group relative min-w-0 text-center" style={{ animationDelay: `${index * 0.6}s` }}>
      <div className="planet-float relative mx-auto grid h-[74px] w-[74px] place-items-center sm:h-[104px] sm:w-[104px]">
        <div className="absolute inset-1 rounded-full bg-[#a78cff] opacity-40 blur-lg" />
        {hasApiImage ? (
          <>
            <img
              src={apiPlanet!.image}
              alt={planetName}
              loading="lazy"
              decoding="async"
              className="relative z-10 h-[74px] w-[74px] rounded-full object-cover transition duration-200 group-hover:-translate-y-1 group-hover:scale-105 sm:hidden"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `/planets/${planet.id}.png`;
              }}
            />
            <img
              src={apiPlanet!.image}
              alt={planetName}
              loading="lazy"
              decoding="async"
              className="relative z-10 hidden h-[104px] w-[104px] rounded-full object-cover transition duration-200 group-hover:-translate-y-1 group-hover:scale-105 sm:inline-block"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `/planets/${planet.id}.png`;
              }}
            />
          </>
        ) : (
          <>
            <Planet
              size={74}
              from={planet.from}
              to={planet.to}
              ring={planet.ring}
              className="relative z-10 transition duration-200 group-hover:-translate-y-1 group-hover:scale-105 sm:hidden"
            />
            <Planet
              size={104}
              from={planet.from}
              to={planet.to}
              ring={planet.ring}
              className="relative z-10 transition duration-200 group-hover:-translate-y-1 group-hover:scale-105 hidden sm:inline-block"
            />
          </>
        )}
      </div>
      <p className="mt-1 max-w-28 text-[10px] font-black leading-4 text-white sm:text-xs">{planetName}</p>
      <p className="mx-auto mt-0.5 max-w-28 text-[8px] font-bold leading-3 text-white/62 sm:text-[9px]">{planetDesc}</p>
    </div>
  );
}



