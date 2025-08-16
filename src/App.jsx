import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Github, Linkedin, Mail, Music2, PlayCircle, PauseCircle,
  ChevronDown, ExternalLink, Sparkles,
  SkipBack, SkipForward   // <— add these
} from "lucide-react";

import Aurora from "./components/ui/Aurora.jsx";
import { Button } from "./components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/Card.jsx";
import { Badge } from "./components/ui/Badge.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/Tabs.jsx";
import { Input, Textarea } from "./components/ui/Input.jsx";
import { Separator } from "./components/ui/Separator.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/Tooltip.jsx";
import AudioVisualizer from "./components/ui/AudioVisualizer.jsx";
import KaandrickLogo from "./components/ui/KaandrickLogo.jsx";
import GlitchText from "./components/ui/GlitchText.jsx";

const Grain = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.08] mix-blend-overlay"
    style={{
      backgroundImage:
        "radial-gradient(circle at 25% 25%, rgba(0,0,0,.5) 0, transparent 40%), radial-gradient(circle at 75% 75%, rgba(0,0,0,.5) 0, transparent 40%)",
      backgroundSize: "12px 12px, 12px 12px",
    }}
  />
);

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <motion.div
      style={{ width }}
      className="fixed left-0 top-0 z-50 h-[3px] bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-400"
    />
  );
};

const useParallax = (offset = 40) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return { ref, y };
};

const NeonWord = ({ text }) => (
  <GlitchText text={text} />
);

const Vinyl = ({ playing, onToggle, trackIndex, setTrackIndex, tracks }) => {
  const currentTrack = tracks?.[trackIndex];

  if (!currentTrack) return null; // safety

  const changeTrack = (direction) => {
    const nextIndex =
      direction === "next"
        ? (trackIndex + 1) % tracks.length
        : (trackIndex - 1 + tracks.length) % tracks.length;

    setTrackIndex(nextIndex);
  };

  return (
    <div className="relative mx-auto h-44 w-44 md:h-56 md:w-56">
      <motion.div
        animate={playing ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 4, ease: "linear", repeat: playing ? Infinity : 1 }}
        className="pointer-events-none absolute inset-0 rounded-full border-[10px] border-black shadow-2xl flex items-center justify-center"
        style={{
          backgroundImage: `
            repeating-radial-gradient(
              circle,
              rgba(0,0,0,0.95) 0%,
              rgba(0,0,0,1) 2%,
              rgba(0,0,0,0.95) 4%
            )
          `,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="h-[36%] w-[36%] rounded-full border border-white/10 shadow-md object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </motion.div>

      {/* Vinyl hole */}
      <div className="absolute inset-[48%] rounded-full bg-black" />

      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => changeTrack("prev")}
          className="rounded-full bg-white/60 text-black hover:bg-white w-8 h-8"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={onToggle}
          className="rounded-full bg-white/60 text-black hover:bg-white w-12 h-12"
        >
          {playing ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={() => changeTrack("next")}
          className="rounded-full bg-white/60 text-black hover:bg-white w-8 h-8"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-14 relative z-20 flex flex-col items-center">
        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-500/80 to-amber-400/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-lg animate-[pulse_5s_ease-in-out_infinite]">
          🎵 Now Playing
        </span>

        <p
          className="text-center font-extrabold tracking-[0.3em] bg-gradient-to-r from-fuchsia-400 via-rose-400 to-amber-300 bg-clip-text text-transparent drop-shadow-md"
          style={{
            WebkitTextStroke: "0.5px rgba(255,255,255,0.1)",
          }}
        >
          {currentTrack.title}
        </p>
      </div>

      <style>
        {`
  @keyframes pulse {
    0%, 100% { transform: scale(1); letter-spacing: 0.3em; }
    50% { transform: scale(1.05); letter-spacing: 0.35em; }
  }
`}
      </style>
    </div>
  );
};



const Hero = () => {
  const { ref, y } = useParallax(60);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const tracks = [
    {
      title: "M.A.A.D. City",
      cover: "/covers/gkmc.jpg",
      audio: "/audio/maad.mp3"
    },
    {
      title: "HUMBLE",
      cover: "/covers/damn.png",
      audio: "/audio/humble.mp3"
    },
    {
      title: "Alright",
      cover: "/covers/tpab.png",
      audio: "/audio/alright.mp3"
    },
  ];

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Auto-play blocked:", err);
      });
    }
  }, [trackIndex, playing]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-4 text-center"
    >

      <Aurora
        colorStops={["#5227FF", "#FF3AB9", "#FFD54F"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="absolute inset-0 -z-20 opacity-20 bg-[url('https://tse4.mm.bing.net/th/id/OIP.l5Zqv_Il0r3pkzEW7RDRqwHaFC?pid=Api&h=1024&w=1024&c=1')] bg-cover bg-center" />

      {/* Headline */}
      <motion.h1
        style={{ y }}
        className="font-display relative z-10 text-5xl font-black tracking-tight md:text-7xl"
      >
        <span className="select-none cursor-default block text-zinc-200">I'M</span>
        <span className="select-none cursor-default block bg-gradient-to-r from-fuchsia-400 via-rose-400 to-amber-300 bg-clip-text text-transparent drop-shadow">
          KAANDRICK
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        style={{ y }}
        className="mt-4 max-w-2xl text-balance text-zinc-300/90"
      >
        Frontend alchemist • React enjoyer • shipping vibes since 20XX. Clean
        code, bold visuals, smooth flows.
      </motion.p>

      {/* Vinyl + Audio Visualizer */}
      <div className="mt-10">
        <Vinyl
          playing={playing}
          onToggle={() => {
            setPlaying((v) => {
              const newState = !v;
              if (newState) audioRef.current?.play();
              else audioRef.current?.pause();
              return newState;
            });
          }}
          trackIndex={trackIndex}
          setTrackIndex={(i) => setTrackIndex(i)}
          tracks={tracks}
        />
        <audio ref={audioRef} src={tracks[trackIndex].audio} preload="auto" />
        <AudioVisualizer audioRef={audioRef} barColor="#f0abfc" />
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 text-zinc-400"
      >
        <ChevronDown />
      </motion.div>

      <style jsx global>{`
    @property --angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --hue {
      syntax: "<number>";
      initial-value: 0;
      inherits: false;
    }
    @keyframes lightRotate {
      to {
        --angle: 360deg;
      }
    }
    @keyframes hueDrift {
      to {
        --hue: 360;
      }
    }
  `}</style>
    </section>

  );
};

const Pill = ({ children }) => (
  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wider text-zinc-300">
    {children}
  </span>
);

const About = () => {
  const { ref, y } = useParallax(30);
  return (
    <section ref={ref} className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <motion.div style={{ y }} className="order-2 md:order-1">
          <h2 className=" select-none cursor-default mb-4 text-3xl font-bold text-zinc-100">
            Who is <NeonWord text="Kaandrick" />?
          </h2>
          <p className="text-zinc-300/90">
            I turn ideas into interactive canvases. My toolkit is React,
            TypeScript, and a taste for motion. If a page doesn’t feel good to
            scroll, I’m not done yet.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {"React TSX Tailwind MUI FramerMotion Node PostgreSQL Mongo Prisma Vite"
              .split(" ")
              .map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              className="bg-white text-black hover:bg-zinc-200"
              onClick={() =>
                document
                  .getElementById("work")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              See Work
            </Button>
            <Button
              variant="secondary"
              className="border-white/10 bg-transparent text-white hover:bg-white/10"
              onClick={() =>
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact
            </Button>
          </div>
        </motion.div>
        <motion.div style={{ y }} className="order-1 md:order-2">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://tse3.mm.bing.net/th/id/OIP.1INDhfWs90VNhvnresCHaQHaI6?pid=Api&h=1024&w=1024&c=1)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
            <div className="absolute bottom-3 right-3">
              <Badge className="rounded-full bg-fuchsia-500/80 px-3 py-1 text-xs text-white backdrop-blur">
                vibe coder
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  title,
  tags = [],
  desc,
  link = "#",
  image,             // e.g. "/images/projects/statforge.png"
  imageAlt,          // e.g. "StatForge UI preview"
  imageSet,          // optional srcset string
}) => (
  <Card className="group relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-white">
        {title}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild title="Open project">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1 hover:bg-white/10"
                aria-label={`Open project: ${title}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent>Open project</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>

    <CardContent>
      <p className="text-sm text-zinc-300/90">{desc}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge key={t} className="rounded-full bg-zinc-800/70 text-zinc-200">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
        <img
          src={image || "/images/projects/placeholder.jpg"}
          srcSet={imageSet}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={imageAlt || `${title} preview`}
          loading="lazy"
          width="640"
          height="360"
          className="block h-32 w-full object-cover"
          onError={(e) => { e.currentTarget.src = "/images/projects/placeholder.jpg"; }}
        />
      </div>
    </CardContent>
  </Card>
);

const Work = () => (
  <section id="work" className="relative isolate py-24">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(253,224,71,0.15),transparent_60%)]" />
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-100">Recent Work</h2>
        <div className="text-sm tracking-[0.3em] text-zinc-400 whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="inline-block animate-[marquee_20s_linear_infinite]">
            KAANDRICK • REACT • MOTION • UI • CREATIVE •
          </div>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <ProjectCard
          title="StatForge – Skill RPG"
          desc="Track and level up real-life skills with a gamified flow. Built with React + Node + Postgres."
          tags={["React", "Node", "PostgreSQL", "Gamified"]}
          link="https://example.com/statforge"
          image="/projectimg/statforge.png"
          imageAlt="StatForge dashboard screen"
        />
        <ProjectCard
          title="WALTER – Voice Assistant"
          desc="Desktop voice assistant with near-real-time TTS/VC experiments. Modular pipeline & hotkeys."
          tags={["Python", "Vosk", "Audio DSP", "Electron-ready"]}
          link="https://example.com/walter"
          image="/projectimg/walter.png"
          imageAlt="WALTER assistant UI"
        />
      </div>
    </div>
    <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-100%)} }`}</style>
  </section>
);

const BarsAndBytes = () => {
  const bars = [
    "map(dreams).filter(hype).reduce(flow)",
    "const hustle = () => requestAnimationFrame(loop)",
    "ui → motion → emotion",
    "ship(ideas, { clean: true, bold: true })",
  ];
  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 overflow-x-hidden">
      <div className="grid items-start gap-8 md:gap-10 md:grid-cols-2">
        {/* Left side */}
        <div>
          <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-zinc-100">
            Bars & Bytes
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-zinc-300/90">
            Snippets and micro-thoughts that capture the way I build: readable,
            reusable, rhythm-first.
          </p>
          <Separator className="my-6" />

          <div className="space-y-3">
            {bars.map((b, i) => (
              <motion.pre
                key={b}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 sm:p-4 text-[12px] sm:text-[13px] text-emerald-300 shadow-inner"
              >
                {`// ${i + 1}`} {b}
              </motion.pre>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div>
          <Tabs defaultValue="stack" className="w-full">
            <TabsList className="grid w-full grid-cols-3 text-[10px] sm:text-xs md:text-sm">
              <TabsTrigger value="stack">Stack</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="values">Values</TabsTrigger>
            </TabsList>
              <TabsContent value="stack" className="space-y-2 mt-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Tailwind</Badge>
                  <Badge>Framer Motion</Badge>
                  <Badge>MUI</Badge>
                </div>
                <p className="text-sm text-zinc-300/90">
                  Also comfy with Node, Express, PostgreSQL, MongoDB, and
                  cloud-ish stuff.
                </p>
              </TabsContent>

              <TabsContent value="process" className="space-y-2 mt-3">
                <p className="text-sm text-zinc-300/90">
                  Design in the browser, iterate fast, instrument UX, and measure
                  delight.
                </p>
                <p className="text-sm text-zinc-300/90">
                  Prefer meaningful motion over flamboyance. Ship minimal, then
                  season.
                </p>
              </TabsContent>

              <TabsContent value="values" className="space-y-2 mt-3">
                <p className="text-sm text-zinc-300/90">
                  Accessibility, performance, clarity—and a touch of play.
                </p>
                <p className="text-sm text-zinc-300/90">
                  Be kind to teammates and ruthless with flaky builds.
                </p>
              </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );

};

const TimelineItem = ({ year, title, body }) => (
  <div className="relative pl-10">
    <div className="absolute left-0 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-300 shadow" />
    <div className="text-xs uppercase tracking-widest text-zinc-400">
      {year}
    </div>
    <div className="text-lg font-semibold text-zinc-100">{title}</div>
    <p className="text-sm text-zinc-300/90">{body}</p>
  </div>
);

const Timeline = () => (
  <section className="relative mx-auto max-w-4xl px-6 py-24">
    <h2 className="mb-8 text-center text-3xl font-bold text-zinc-100">
      Timeline
    </h2>
    <div className="relative">
      <div className="absolute left-3 top-0 h-full w-[2px] bg-gradient-to-b from-rose-400/60 to-amber-300/60" />
      <div className="space-y-8">
        <TimelineItem
          year="2025"
          title="Launched WALTER MVP"
          body="Explored low‑latency voice pipelines and UX for assistants."
        />
        <TimelineItem
          year="2024"
          title="StatForge Accepted (TÜBİTAK 2209‑A)"
          body="Skill leveling engine + web app shipped as a playable prototype."
        />
        <TimelineItem
          year="2023"
          title="React Heavy Projects"
          body="Shipped dashboards and timelines; refined design systems."
        />
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="relative mx-auto max-w-4xl px-6 pb-24">
    <Card className="p-6">
      <h2 className="mb-2 text-3xl font-bold text-zinc-100">
        Let’s build something bold
      </h2>
      <p className="mb-6 text-zinc-300/90">
        Say hi and tell me what you’re dreaming up.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Your name" />
        <Input type="email" placeholder="Email" />
        <Textarea
          placeholder="Project details"
          rows={4}
          className="md:col-span-2"
        />
        <div className="flex items-center gap-3 md:col-span-2">
          <Button className="bg-white text-black hover:bg-zinc-200">
            Send
          </Button>
          <a
            href="mailto:kaancheleby@gmail.com"
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            Or email: kaancheleby@gmail.com
          </a>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
        <a
          className="flex items-center gap-2 hover:text-zinc-100"
          href="https://github.com/Bearism "
          target="_blank"
          rel="noreferrer"
        >
          <Github className="h-4 w-4" /> github.com/Bearism
        </a>
        <a
          className="flex items-center gap-2 hover:text-zinc-100"
          href="https://www.linkedin.com/in/kaan-celebi-bb6641252/"
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin className="h-4 w-4" /> linkedin.com/in/kaan-celebi
        </a>
        <a
          className="flex items-center gap-2 hover:text-zinc-100"
          href="mailto:kaancheleby@gmail.com"
        >
          <Mail className="h-4 w-4" /> kaancheleby@gmail.com
        </a>
      </div>
    </Card>
  </section>
);

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-50">
      <Grain />
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur">
        <nav className="flex w-full items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-amber-300 animate-pulse" />
            <span
              className="text-2xl font-bold tracking-widest relative inline-block text-white transition-all duration-700 ease-out overflow-hidden group"
              style={{
                WebkitTextStroke: "1.5px transparent",
              }}
            >
              <KaandrickLogo />
            </span>
          </div>
          <div className="hidden gap-6 text-sm text-zinc-300 md:flex">
            <a className="hover:text-white" href="#work">Work</a>
            <a className="hover:text-white" href="#contact">Contact</a>
            <a className="hover:text-white" href="#about">About</a>
          </div>
        </nav>

      </header>
      <main>
        <Hero />
        <section id="about">
          <About />
        </section>
        <Work />
        <BarsAndBytes />
        <Timeline />
        <Contact />
      </main>
      <footer className="relative overflow-hidden px-6 py-12 text-center text-xs text-zinc-500">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.06),transparent_60%)]" />
        <p>
          © {new Date().getFullYear()} KAANDRICK — designed in the browser,
          built with love.
        </p>
      </footer>
    </div>
  );
}
