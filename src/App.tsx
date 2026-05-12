import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, SubmitEvent as ReactSubmitEvent } from "react";
import "./index.css";

type BubbleSide = "top" | "bottom" | "left" | "right";
type FinalStage = "waiting" | "rose" | "message";

type Flower = {
  id: number;
  title: string;
  message: string;
  start: {
    x: number;
    y: number;
  };
  heart: {
    x: number;
    y: number;
  };
  color: string;
  bubbleSide: BubbleSide;
};

type RosePetalVars = CSSProperties & Record<`--${string}`, string | number>;

type RosePetal = {
  id: string;
  ring: "outer" | "middle" | "inner";
  rotate: number;
  width: number;
  height: number;
  scale: number;
  delay: number;
  z: number;
  shiftX: number;
  shiftY: number;
  curl: number;
  main: string;
  dark: string;
  light: string;
};

type RoseFold = {
  id: string;
  rotate: number;
  width: number;
  height: number;
  delay: number;
  z: number;
  shiftX: number;
  shiftY: number;
};

type BouquetRose = {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  delayOffset: number;
  hueRotate: number;
  saturate: number;
  brightness: number;
  z: number;
  stem: {
    left: number;
    bottom: number;
    height: number;
    rotate: number;
    delay: number;
    z: number;
  };
  dew?: boolean;
};

const MAGIC_WORD = "sunflower";

const flowers: Flower[] = [
  {
    id: 1,
    title: "Little bloom #1",
    message: "You make ordinary days feel decorated.",
    start: { x: 12, y: 72 },
    heart: { x: 50, y: 72 },
    color: "#fb7185",
    bubbleSide: "top",
  },
  {
    id: 2,
    title: "Little bloom #2",
    message: "Your laugh is my favorite background music.",
    start: { x: 28, y: 82 },
    heart: { x: 36, y: 58 },
    color: "#f472b6",
    bubbleSide: "top",
  },
  {
    id: 3,
    title: "Little bloom #3",
    message: "I would pick you in every version of the story.",
    start: { x: 47, y: 68 },
    heart: { x: 64, y: 58 },
    color: "#c084fc",
    bubbleSide: "right",
  },
  {
    id: 4,
    title: "Little bloom #4",
    message: "You are my favorite notification.",
    start: { x: 66, y: 82 },
    heart: { x: 28, y: 44 },
    color: "#facc15",
    bubbleSide: "top",
  },
  {
    id: 5,
    title: "Little bloom #5",
    message: "Somehow, you make even quiet moments feel full.",
    start: { x: 88, y: 72 },
    heart: { x: 72, y: 44 },
    color: "#fb923c",
    bubbleSide: "top",
  },
  {
    id: 6,
    title: "Little bloom #6",
    message: "I like you in a very serious, very silly way.",
    start: { x: 18, y: 36 },
    heart: { x: 39, y: 30 },
    color: "#38bdf8",
    bubbleSide: "right",
  },
  {
    id: 7,
    title: "Little bloom #7",
    message: "You are the soft plot twist I did not know I needed.",
    start: { x: 50, y: 28 },
    heart: { x: 61, y: 30 },
    color: "#34d399",
    bubbleSide: "bottom",
  },
  {
    id: 8,
    title: "Little bloom #8",
    message: "This garden exists because you do.",
    start: { x: 82, y: 36 },
    heart: { x: 50, y: 22 },
    color: "#a3e635",
    bubbleSide: "left",
  },
];

const rosePetals: RosePetal[] = [
  {
    id: "outer-left",
    ring: "outer",
    rotate: -72,
    width: 78,
    height: 126,
    scale: 1.03,
    delay: 1.45,
    z: 10,
    shiftX: -6,
    shiftY: 8,
    curl: -7,
    main: "#b70f3f",
    dark: "#54051d",
    light: "#ff9ab0",
  },
  {
    id: "outer-low-left",
    ring: "outer",
    rotate: -38,
    width: 84,
    height: 132,
    scale: 1.08,
    delay: 1.58,
    z: 12,
    shiftX: -3,
    shiftY: 12,
    curl: -4,
    main: "#c41246",
    dark: "#5d071f",
    light: "#ffa3b6",
  },
  {
    id: "outer-front",
    ring: "outer",
    rotate: 0,
    width: 92,
    height: 132,
    scale: 1.12,
    delay: 1.72,
    z: 16,
    shiftX: 0,
    shiftY: 15,
    curl: 0,
    main: "#d01b4f",
    dark: "#65071f",
    light: "#ffc0cc",
  },
  {
    id: "outer-low-right",
    ring: "outer",
    rotate: 39,
    width: 84,
    height: 130,
    scale: 1.07,
    delay: 1.62,
    z: 13,
    shiftX: 4,
    shiftY: 11,
    curl: 4,
    main: "#b90f3f",
    dark: "#58061f",
    light: "#ff9eb3",
  },
  {
    id: "outer-right",
    ring: "outer",
    rotate: 72,
    width: 76,
    height: 124,
    scale: 1.02,
    delay: 1.5,
    z: 11,
    shiftX: 6,
    shiftY: 7,
    curl: 7,
    main: "#a80c38",
    dark: "#4f061d",
    light: "#ff92aa",
  },
  {
    id: "middle-left",
    ring: "middle",
    rotate: -56,
    width: 62,
    height: 104,
    scale: 0.98,
    delay: 1.95,
    z: 24,
    shiftX: -4,
    shiftY: -4,
    curl: -9,
    main: "#df2455",
    dark: "#6b061f",
    light: "#ffb1c0",
  },
  {
    id: "middle-upper-left",
    ring: "middle",
    rotate: -24,
    width: 66,
    height: 112,
    scale: 1,
    delay: 2.1,
    z: 28,
    shiftX: -3,
    shiftY: -8,
    curl: -5,
    main: "#ee355f",
    dark: "#7f0825",
    light: "#ffc8d2",
  },
  {
    id: "middle-upper-right",
    ring: "middle",
    rotate: 24,
    width: 66,
    height: 112,
    scale: 1,
    delay: 2.18,
    z: 30,
    shiftX: 3,
    shiftY: -8,
    curl: 5,
    main: "#d91d50",
    dark: "#71051f",
    light: "#ffb5c6",
  },
  {
    id: "middle-right",
    ring: "middle",
    rotate: 56,
    width: 62,
    height: 104,
    scale: 0.98,
    delay: 2.0,
    z: 25,
    shiftX: 4,
    shiftY: -4,
    curl: 9,
    main: "#c91546",
    dark: "#63061d",
    light: "#ffa6bb",
  },
  {
    id: "inner-left",
    ring: "inner",
    rotate: -36,
    width: 46,
    height: 82,
    scale: 0.9,
    delay: 2.35,
    z: 42,
    shiftX: -2,
    shiftY: -20,
    curl: -13,
    main: "#f04768",
    dark: "#8a0928",
    light: "#ffd6de",
  },
  {
    id: "inner-center",
    ring: "inner",
    rotate: 0,
    width: 48,
    height: 86,
    scale: 0.94,
    delay: 2.48,
    z: 46,
    shiftX: 0,
    shiftY: -23,
    curl: 0,
    main: "#f43f5e",
    dark: "#920a2b",
    light: "#ffe0e6",
  },
  {
    id: "inner-right",
    ring: "inner",
    rotate: 36,
    width: 46,
    height: 82,
    scale: 0.9,
    delay: 2.4,
    z: 43,
    shiftX: 2,
    shiftY: -20,
    curl: 13,
    main: "#dc224e",
    dark: "#800722",
    light: "#ffc6d4",
  },
];

const roseFolds: RoseFold[] = [
  {
    id: "fold-left",
    rotate: -34,
    width: 30,
    height: 66,
    delay: 2.62,
    z: 68,
    shiftX: -13,
    shiftY: -18,
  },
  {
    id: "fold-center",
    rotate: 3,
    width: 34,
    height: 76,
    delay: 2.76,
    z: 72,
    shiftX: 0,
    shiftY: -23,
  },
  {
    id: "fold-right",
    rotate: 34,
    width: 30,
    height: 66,
    delay: 2.68,
    z: 70,
    shiftX: 13,
    shiftY: -18,
  },
];

const roseThorns = [
  { side: "left", bottom: 74, delay: 1.25 },
  { side: "right", bottom: 118, delay: 1.42 },
  { side: "left", bottom: 166, delay: 1.6 },
] as const;

const roseDewDrops = [
  { left: "42%", top: "39%", size: 8, delay: 3.15 },
  { left: "58%", top: "45%", size: 6, delay: 3.28 },
  { left: "50%", top: "31%", size: 5, delay: 3.42 },
];

const BOUQUET_ROSE_STAGGER_MS = 620;
const BOUQUET_COMPLETE_BUFFER_MS = 5600;

const bouquetRoses: BouquetRose[] = [
  {
    id: "center-rose",
    x: 50,
    y: 10,
    scale: 1,
    rotate: 0,
    delayOffset: 0,
    hueRotate: 0,
    saturate: 1,
    brightness: 1,
    z: 50,
    stem: { left: 50, bottom: 74, height: 248, rotate: 0, delay: 0.3, z: 8 },
    dew: true,
  },
  {
    id: "left-rose",
    x: 32,
    y: 20,
    scale: 0.78,
    rotate: -18,
    delayOffset: 0.22,
    hueRotate: -8,
    saturate: 1.1,
    brightness: 1.05,
    z: 42,
    stem: { left: 47, bottom: 72, height: 228, rotate: -18, delay: 0.45, z: 7 },
  },
  {
    id: "right-rose",
    x: 68,
    y: 21,
    scale: 0.78,
    rotate: 18,
    delayOffset: 0.34,
    hueRotate: -20,
    saturate: 1.2,
    brightness: 0.95,
    z: 43,
    stem: { left: 53, bottom: 72, height: 228, rotate: 18, delay: 0.52, z: 7 },
  },
  {
    id: "top-left-rose",
    x: 41,
    y: -3,
    scale: 0.66,
    rotate: -10,
    delayOffset: 0.48,
    hueRotate: 10,
    saturate: 0.95,
    brightness: 1.12,
    z: 38,
    stem: { left: 49, bottom: 76, height: 274, rotate: -8, delay: 0.62, z: 6 },
  },
  {
    id: "top-right-rose",
    x: 59,
    y: -2,
    scale: 0.66,
    rotate: 10,
    delayOffset: 0.58,
    hueRotate: -32,
    saturate: 1.15,
    brightness: 0.95,
    z: 39,
    stem: { left: 51, bottom: 76, height: 274, rotate: 8, delay: 0.68, z: 6 },
  },
  {
    id: "lower-left-rose",
    x: 39,
    y: 35,
    scale: 0.62,
    rotate: -26,
    delayOffset: 0.7,
    hueRotate: 18,
    saturate: 0.9,
    brightness: 1.08,
    z: 34,
    stem: { left: 48, bottom: 70, height: 190, rotate: -24, delay: 0.76, z: 5 },
  },
  {
    id: "lower-right-rose",
    x: 61,
    y: 36,
    scale: 0.62,
    rotate: 26,
    delayOffset: 0.82,
    hueRotate: -42,
    saturate: 1.18,
    brightness: 0.92,
    z: 35,
    stem: { left: 52, bottom: 70, height: 190, rotate: 24, delay: 0.82, z: 5 },
  },
];

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [wateredFlowerIds, setWateredFlowerIds] = useState<number[]>([]);
  const [activeFlowerId, setActiveFlowerId] = useState<number | null>(null);
  const [finalStage, setFinalStage] = useState<FinalStage>("waiting");

  const allFlowersWatered = wateredFlowerIds.length === flowers.length;
  const isFinalStarted = finalStage !== "waiting";

  function waterFlower(id: number) {
    setWateredFlowerIds((current) => {
      if (current.includes(id)) return current;
      return [...current, id];
    });

    setActiveFlowerId(id);
  }

  function startFinalReveal() {
    setActiveFlowerId(null);
    setFinalStage("rose");
  }

  function showFinalMessage() {
    setFinalStage("message");
  }

  function restartGarden() {
    setWateredFlowerIds([]);
    setActiveFlowerId(null);
    setFinalStage("waiting");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-rose-100 via-pink-100 to-emerald-100 text-slate-800">
      <FloatingPetals />

      <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-emerald-300/70 to-transparent" />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <PasswordGate key="gate" onUnlock={() => setIsUnlocked(true)} />
        ) : (
          <Garden
            key="garden"
            wateredFlowerIds={wateredFlowerIds}
            activeFlowerId={activeFlowerId}
            allFlowersWatered={allFlowersWatered}
            finalStage={finalStage}
            isFinalStarted={isFinalStarted}
            onWaterFlower={waterFlower}
            onStartFinalReveal={startFinalReveal}
            onRoseComplete={showFinalMessage}
            onRestart={restartGarden}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);

  const hints = [
    "The garden is listening, but not impressed yet.",
    "Tiny hint: it is something that loves the sun.",
    "The flowers are whispering: sun... something.",
  ];

  function handleSubmit(event: ReactSubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim().toLowerCase() === MAGIC_WORD) {
      onUnlock();
      return;
    }

    setAttempts((current) => current + 1);
  }

  return (
    <motion.section
      className="relative z-10 flex min-h-screen items-center justify-center px-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md rounded-4xl border border-white/70 bg-white/55 p-7 text-center shadow-2xl shadow-rose-200/70 backdrop-blur-xl">
        <motion.div
          className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-rose-200 text-5xl shadow-inner"
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌷
        </motion.div>

        <h1 className="text-3xl font-black tracking-tight text-rose-900">
          A tiny garden is waiting
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the magic word to wake it up. The flowers are dramatic, so they
          refuse to bloom without a password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-rose-200 bg-white/80 px-5 py-3 text-center text-lg font-semibold outline-none ring-rose-300 transition focus:ring-4"
            placeholder="Magic word"
          />

          <motion.button
            type="submit"
            className="w-full rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white shadow-lg shadow-rose-300 transition hover:bg-rose-600"
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
          >
            Open the garden
          </motion.button>
        </form>

        <AnimatePresence>
          {attempts > 0 && (
            <motion.p
              className="mt-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-800"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {hints[Math.min(attempts - 1, hints.length - 1)]}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-5 text-xs text-slate-500">
          Dev note: change <span className="font-bold">MAGIC_WORD</span> in
          App.tsx later.
        </p>
      </div>
    </motion.section>
  );
}

function Garden({
  wateredFlowerIds,
  activeFlowerId,
  allFlowersWatered,
  finalStage,
  isFinalStarted,
  onWaterFlower,
  onStartFinalReveal,
  onRoseComplete,
  onRestart,
}: {
  wateredFlowerIds: number[];
  activeFlowerId: number | null;
  allFlowersWatered: boolean;
  finalStage: FinalStage;
  isFinalStarted: boolean;
  onWaterFlower: (id: number) => void;
  onStartFinalReveal: () => void;
  onRoseComplete: () => void;
  onRestart: () => void;
}) {
  return (
    <motion.section
      className="relative z-10 min-h-screen px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 rounded-4xl border border-white/70 bg-white/45 p-4 text-center shadow-xl backdrop-blur-xl md:flex-row md:text-left">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-500">
            Secret garden
          </p>
          <h2 className="mt-1 text-2xl font-black text-rose-950 md:text-3xl">
            Water every flower
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Click each flower. The newest bloom will whisper its message.
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 px-5 py-3 shadow-inner">
          <p className="text-sm font-bold text-slate-700">
            Blooms: {wateredFlowerIds.length}/{flowers.length}
          </p>
        </div>
      </header>

      <div className="relative mx-auto mt-6 h-[72vh] max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-linear-to-b from-sky-100/60 via-white/20 to-emerald-200/70 shadow-2xl shadow-emerald-200/70 backdrop-blur-sm">
        <div className="absolute inset-x-0 bottom-0 h-40 rounded-b-[2.5rem] bg-linear-to-t from-emerald-500/30 to-transparent" />

        <AnimatePresence>
          {isFinalStarted && (
            <motion.div
              className="absolute inset-0 z-10 bg-rose-950/10 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {flowers.map((flower) => {
          const isWatered = wateredFlowerIds.includes(flower.id);
          const position = isFinalStarted ? flower.heart : flower.start;

          return (
            <FlowerItem
              key={flower.id}
              flower={flower}
              isWatered={isWatered}
              isActive={activeFlowerId === flower.id}
              position={position}
              isFinalStarted={isFinalStarted}
              onWater={() => onWaterFlower(flower.id)}
            />
          );
        })}

        <AnimatePresence>
          {allFlowersWatered && !isFinalStarted && (
            <FinalFlower onStartFinalReveal={onStartFinalReveal} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {finalStage === "rose" && <RoseBloom onComplete={onRoseComplete} />}
        </AnimatePresence>

        <AnimatePresence>
          {finalStage === "message" && <FinalMessage onRestart={onRestart} />}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function FlowerItem({
  flower,
  isWatered,
  isActive,
  position,
  isFinalStarted,
  onWater,
}: {
  flower: Flower;
  isWatered: boolean;
  isActive: boolean;
  position: { x: number; y: number };
  isFinalStarted: boolean;
  onWater: () => void;
}) {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        scale: isWatered ? 1 : 0.74,
        opacity: isFinalStarted ? 0.75 : 1,
      }}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
    >
      <button
        onClick={onWater}
        disabled={isFinalStarted}
        className="group relative -translate-x-1/2 -translate-y-1/2 outline-none disabled:cursor-default"
        aria-label={`Water ${flower.title}`}
      >
        <motion.div
          className="absolute left-1/2 top-8 h-24 w-2 -translate-x-1/2 rounded-full bg-emerald-600"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isWatered ? 1 : 0.45 }}
          style={{ originY: 0 }}
        />

        <motion.div
          className="relative grid size-24 place-items-center"
          whileHover={isFinalStarted ? undefined : { scale: 1.08 }}
          whileTap={isFinalStarted ? undefined : { scale: 0.92 }}
        >
          {[0, 60, 120, 180, 240, 300].map((rotation) => (
            <motion.span
              key={rotation}
              className="absolute h-10 w-6 rounded-full"
              style={{
                backgroundColor: flower.color,
                transformOrigin: "50% 92%",
                rotate: `${rotation}deg`,
              }}
              initial={{ scale: 0.15, y: 8, opacity: 0.6 }}
              animate={{
                scale: isWatered ? 1 : 0.32,
                y: isWatered ? -14 : 2,
                opacity: isWatered ? 1 : 0.75,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            />
          ))}

          <motion.span
            className="relative z-10 size-7 rounded-full bg-amber-300 shadow-lg shadow-amber-200"
            animate={{
              scale: isWatered ? [1, 1.12, 1] : 0.8,
            }}
            transition={{
              duration: 1.8,
              repeat: isWatered ? Infinity : 0,
            }}
          />
        </motion.div>

        {!isWatered && !isFinalStarted && (
          <span className="absolute left-1/2 top-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-emerald-700 opacity-0 shadow-md transition group-hover:opacity-100">
            water me
          </span>
        )}
      </button>

      <AnimatePresence>
        {isWatered && isActive && !isFinalStarted && (
          <motion.div
            className={getBubbleClasses(flower.bubbleSide)}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
          >
            {flower.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FinalFlower({
  onStartFinalReveal,
}: {
  onStartFinalReveal: () => void;
}) {
  return (
    <motion.button
      onClick={onStartFinalReveal}
      className="absolute left-1/2 top-1/2 z-30 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/70 p-6 text-center shadow-2xl shadow-amber-200 backdrop-blur-xl"
      initial={{ opacity: 0, scale: 0.1, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.7 }}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
    >
      <motion.span
        className="text-7xl"
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        🌻
      </motion.span>

      <span className="mt-3 block max-w-40 text-sm font-black text-amber-700">
        One final flower appeared
      </span>
    </motion.button>
  );
}

function getRosePetalStyle(petal: RosePetal): RosePetalVars {
  return {
    "--petal-width": `${petal.width}px`,
    "--petal-height": `${petal.height}px`,
    "--petal-margin-x": `${petal.width / -2}px`,
    "--petal-margin-y": `${petal.height * -0.9}px`,
    "--petal-scale": petal.scale,
    "--petal-shift-x": `${petal.shiftX}px`,
    "--petal-shift-y": `${petal.shiftY}px`,
    "--petal-curl": `${petal.curl}deg`,
    "--petal-main": petal.main,
    "--petal-dark": petal.dark,
    "--petal-light": petal.light,
    "--petal-z": petal.z,
  };
}

function getRoseFoldStyle(fold: RoseFold): RosePetalVars {
  return {
    "--fold-width": `${fold.width}px`,
    "--fold-height": `${fold.height}px`,
    "--fold-margin-x": `${fold.width / -2}px`,
    "--fold-margin-y": `${fold.height * -0.92}px`,
    "--fold-shift-x": `${fold.shiftX}px`,
    "--fold-shift-y": `${fold.shiftY}px`,
    "--fold-z": fold.z,
  };
}

function RoseBloom({ onComplete }: { onComplete: () => void }) {
  const [visibleRoseCount, setVisibleRoseCount] = useState(0);
  const visibleBouquetRoses = bouquetRoses.slice(0, visibleRoseCount);

  useEffect(() => {
    const revealTimeoutIds = bouquetRoses.map((_, index) =>
      window.setTimeout(() => {
        setVisibleRoseCount(index + 1);
      }, index * BOUQUET_ROSE_STAGGER_MS),
    );

    const completeDelay =
      (bouquetRoses.length - 1) * BOUQUET_ROSE_STAGGER_MS +
      BOUQUET_COMPLETE_BUFFER_MS;
    const completeTimeoutId = window.setTimeout(onComplete, completeDelay);

    return () => {
      revealTimeoutIds.forEach(window.clearTimeout);
      window.clearTimeout(completeTimeoutId);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
    >
      <motion.div
        className="realistic-rose-halo absolute left-1/2 top-10 size-120"
        style={{ marginLeft: "-15rem" }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.12, 1], opacity: [0, 0.95, 0.66] }}
        transition={{ duration: 3.8, ease: "easeOut" }}
      />

      <div className="relative h-136 w-136 max-w-[94vw]">
        <motion.div
          className="realistic-rose-ground absolute bottom-2 left-1/2 h-12 w-80"
          style={{ marginLeft: "-10rem" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1.1, ease: "easeOut" }}
        />

        <div className="absolute inset-0">
          {visibleBouquetRoses.map((rose) => (
            <motion.div
              key={`${rose.id}-stem`}
              className="absolute w-4 rounded-full bg-emerald-700 shadow-lg shadow-emerald-900/20"
              style={{
                left: `${rose.stem.left}%`,
                bottom: rose.stem.bottom,
                height: rose.stem.height,
                marginLeft: "-0.5rem",
                originY: 1,
                zIndex: rose.stem.z,
              }}
              initial={{
                scaleY: 0,
                opacity: 0,
                rotate: rose.stem.rotate - 7,
              }}
              animate={{
                scaleY: 1,
                opacity: 1,
                rotate: rose.stem.rotate,
              }}
              transition={{
                delay: rose.stem.delay,
                duration: 1.25,
                ease: "easeOut",
              }}
            >
              {rose.id === "center-rose" &&
                roseThorns.map((thorn) => (
                  <motion.span
                    key={`${thorn.side}-${thorn.bottom}`}
                    className={`realistic-rose-thorn realistic-rose-thorn-${thorn.side}`}
                    style={{ bottom: thorn.bottom }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: thorn.delay,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                  />
                ))}
            </motion.div>
          ))}
        </div>

        <motion.span
          className="realistic-rose-leaf realistic-rose-leaf-left"
          style={{ zIndex: 15 }}
          initial={{ opacity: 0, scale: 0.1, rotate: -64 }}
          animate={{ opacity: 1, scale: 1.1, rotate: -36 }}
          transition={{ delay: 1.05, duration: 0.8, ease: "easeOut" }}
        />

        <motion.span
          className="realistic-rose-leaf realistic-rose-leaf-right"
          style={{ zIndex: 15 }}
          initial={{ opacity: 0, scale: 0.1, rotate: 64 }}
          animate={{ opacity: 1, scale: 1.1, rotate: 34 }}
          transition={{ delay: 1.22, duration: 0.8, ease: "easeOut" }}
        />

        <motion.span
          className="realistic-rose-leaf realistic-rose-leaf-left"
          style={{
            left: "56%",
            bottom: "10.5rem",
            zIndex: 14,
            transform: "scaleX(-1)",
          }}
          initial={{ opacity: 0, scale: 0.1, rotate: -52 }}
          animate={{ opacity: 1, scale: 0.85, rotate: -18 }}
          transition={{ delay: 1.36, duration: 0.8, ease: "easeOut" }}
        />

        <motion.span
          className="realistic-rose-leaf realistic-rose-leaf-right"
          style={{
            right: "56%",
            bottom: "11.5rem",
            zIndex: 14,
            transform: "scaleX(-1)",
          }}
          initial={{ opacity: 0, scale: 0.1, rotate: 52 }}
          animate={{ opacity: 1, scale: 0.85, rotate: 18 }}
          transition={{ delay: 1.46, duration: 0.8, ease: "easeOut" }}
        />

        <motion.div
          className="absolute bottom-8 left-1/2 z-20 h-60 w-84 -translate-x-1/2"
          initial={{ opacity: 0, y: 34, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.95, duration: 0.95, ease: "easeOut" }}
        >
          <div className="absolute bottom-1 left-7 h-56 w-40 origin-bottom rotate-[-18deg] rounded-t-[4rem] rounded-bl-4xl bg-rose-100/85 shadow-xl shadow-rose-200/40 backdrop-blur-sm" />
          <div className="absolute bottom-1 right-7 h-56 w-40 origin-bottom rotate-18 rounded-t-[4rem] rounded-br-4xl bg-pink-100/85 shadow-xl shadow-rose-200/40 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-1/2 h-52 w-44 -translate-x-1/2 rounded-t-[4rem] rounded-b-3xl bg-white/80 shadow-xl shadow-rose-100/50 backdrop-blur-sm" />

          <div className="absolute bottom-18 left-1/2 z-20 h-11 w-52 -translate-x-1/2 rounded-full bg-rose-500 shadow-lg shadow-rose-300/60" />
          <div className="absolute bottom-12 left-[43%] z-10 h-18 w-10 rotate-12 rounded-b-3xl bg-rose-600 shadow-md" />
          <div className="absolute bottom-12 right-[43%] z-10 h-18 w-10 -rotate-12 rounded-b-3xl bg-rose-600 shadow-md" />

          <motion.div
            className="absolute bottom-[4.35rem] left-1/2 z-30 size-16 -translate-x-1/2 rounded-full bg-rose-400 shadow-inner shadow-rose-700/30"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{ delay: 2.5, duration: 3.5, repeat: Infinity }}
          >
            <span className="absolute left-1/2 top-1/2 h-5 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-rose-200/70" />
            <span className="absolute left-1/2 top-1/2 h-5 w-20 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-rose-200/70" />
          </motion.div>
        </motion.div>

        {visibleBouquetRoses.map((rose) => (
          <BouquetRoseHead key={rose.id} rose={rose} />
        ))}

        <motion.p
          className="absolute bottom-0 left-1/2 z-40 w-80 rounded-full bg-white/75 px-5 py-3 text-center text-sm font-bold text-rose-700 shadow-xl backdrop-blur-md"
          style={{ marginLeft: "-10rem" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
          transition={{ delay: 0.9, duration: 7.4, times: [0, 0.14, 0.88, 1] }}
        >
          A bouquet of roses is blooming...
        </motion.p>
      </div>
    </motion.div>
  );
}

function BouquetRoseHead({ rose }: { rose: BouquetRose }) {
  return (
    <motion.div
      className="absolute h-64 w-64"
      style={{
        left: `${rose.x}%`,
        top: `${rose.y}%`,
        marginLeft: "-8rem",
        filter: `hue-rotate(${rose.hueRotate}deg) saturate(${rose.saturate}) brightness(${rose.brightness})`,
        zIndex: rose.z,
      }}
      initial={{
        opacity: 0,
        y: 46,
        scale: 0.25,
        rotate: rose.rotate - 18,
      }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
        scale: rose.scale,
        rotate: [rose.rotate - 1.5, rose.rotate + 1.5, rose.rotate - 1.5],
      }}
      transition={{
        opacity: {
          delay: 1.05 + rose.delayOffset,
          duration: 0.55,
          ease: "easeOut",
        },
        scale: {
          delay: 1.1 + rose.delayOffset,
          duration: 1.15,
          ease: "easeOut",
        },
        y: {
          delay: 3.25 + rose.delayOffset,
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          delay: 3.25 + rose.delayOffset,
          duration: 5.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <div className="realistic-rose-head">
        <motion.span
          className="rose-calyx"
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.25 + rose.delayOffset,
            duration: 0.65,
            ease: "easeOut",
          }}
        />

        {rosePetals.map((petal) => (
          <motion.span
            key={`${rose.id}-${petal.id}`}
            className="rose-petal-wrap"
            style={getRosePetalStyle(petal)}
            initial={{
              opacity: 0,
              scale: 0.08,
              rotate: petal.rotate * 0.28,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: petal.rotate,
            }}
            transition={{
              delay: petal.delay + rose.delayOffset,
              duration: 0.92,
              type: "spring",
              stiffness: 112,
              damping: 13,
            }}
          >
            <span className={`rose-petal rose-petal-${petal.ring}`} />
          </motion.span>
        ))}

        {roseFolds.map((fold) => (
          <motion.span
            key={`${rose.id}-${fold.id}`}
            className="rose-core-fold-wrap"
            style={getRoseFoldStyle(fold)}
            initial={{ opacity: 0, scale: 0.14, rotate: fold.rotate * 0.5 }}
            animate={{ opacity: 1, scale: 1, rotate: fold.rotate }}
            transition={{
              delay: fold.delay + rose.delayOffset,
              duration: 0.78,
              type: "spring",
              stiffness: 130,
              damping: 14,
            }}
          >
            <span className="rose-core-fold" />
          </motion.span>
        ))}

        <motion.span
          className="rose-center-shadow"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 2.9 + rose.delayOffset,
            duration: 0.5,
            ease: "easeOut",
          }}
        />

        {rose.dew &&
          roseDewDrops.map((drop) => (
            <motion.span
              key={`${rose.id}-${drop.left}-${drop.top}`}
              className="rose-dew"
              style={{
                left: drop.left,
                top: drop.top,
                width: drop.size,
                height: drop.size,
              }}
              initial={{ opacity: 0, y: 8, scale: 0.35 }}
              animate={{ opacity: 1, y: 0, scale: [1, 1.08, 1] }}
              transition={{
                delay: drop.delay + rose.delayOffset,
                duration: 1.9,
                repeat: Infinity,
                repeatDelay: 1.6,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>
    </motion.div>
  );
}

function FinalMessage({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-50 w-[min(92%,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-4xl border border-white/80 bg-white/85 p-7 text-center shadow-2xl shadow-rose-300/60 backdrop-blur-xl"
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-500">
        Final bloom
      </p>

      <h2 className="mt-3 text-3xl font-black text-rose-950">
        Every flower was trying to say the same thing.
      </h2>

      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
        I made this little garden because you deserve something that blooms just
        for you. And because apparently my love language is now web development
        with petals.
      </p>

      <p className="mt-5 text-2xl font-black text-rose-600">I love you. 🌹</p>

      <button
        onClick={onRestart}
        className="mt-6 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
      >
        Bloom again
      </button>
    </motion.div>
  );
}

function FloatingPetals() {
  const petals = useMemo(() => Array.from({ length: 18 }), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((_, index) => (
        <motion.span
          key={index}
          className="absolute text-xl opacity-50"
          style={{
            left: `${(index * 13) % 100}%`,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "115vh"],
            x: [0, index % 2 === 0 ? 50 : -50, 0],
            rotate: [0, 120, 240, 360],
            opacity: [0, 0.55, 0.25, 0],
          }}
          transition={{
            duration: 8 + (index % 6),
            delay: index * 0.35,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {index % 3 === 0 ? "❀" : index % 3 === 1 ? "✿" : "❁"}
        </motion.span>
      ))}
    </div>
  );
}

function getBubbleClasses(side: BubbleSide) {
  const base =
    "absolute z-20 w-56 rounded-3xl border border-white/80 bg-white/85 p-4 text-center text-sm font-semibold leading-5 text-slate-700 shadow-xl backdrop-blur-md";

  const positions: Record<BubbleSide, string> = {
    top: "left-1/2 top-[-5.75rem] -translate-x-1/2",
    bottom: "left-1/2 top-[6.5rem] -translate-x-1/2",
    left: "right-[5.75rem] top-1/2 -translate-y-1/2",
    right: "left-[5.75rem] top-1/2 -translate-y-1/2",
  };

  return `${base} ${positions[side]}`;
}
