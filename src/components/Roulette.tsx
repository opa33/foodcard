import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { Food } from "../data/foods";
import { foods } from "../data/foods";

const DEFAULT_ITEM_HEIGHT = 120;
const VISIBLE_COUNT = 3;
const REPEAT = 8;

function ReelItem({ food }: { food: Food }) {
  return (
    <div
      className="w-full flex items-center justify-center gap-4 px-6"
      style={{ height: DEFAULT_ITEM_HEIGHT }}
    >
      <div className="text-4xl pr-4 ">{food.emoji}</div>
    </div>
  );
}

type Props = {
  onFinish?: (results: Food[]) => void;
  tripleChance?: number;
};

export default function Roulette({ onFinish, tripleChance = 0 }: Props) {
  const [stops, setStops] = useState<number[]>([0, 0, 0]);
  const [distances, setDistances] = useState<number[]>([0, 0, 0]);
  const [key, setKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [confetti, setConfetti] = useState(false);
  type ConfettiPiece = {
    left: number;
    delay: number;
    duration: number;
    rotate: number;
    width: number;
    height: number;
    color: string;
  };
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const reelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reelContainers = useRef<Array<HTMLDivElement | null>>([]);

  // Slightly shorter durations to reduce work on mobile while keeping the feel
  const durations = [4.0, 4.2, 4.4];

  const reelArrays = Array.from({ length: 3 }).map(() => {
    const arr: Food[] = [];
    for (let i = 0; i < REPEAT; i++) arr.push(...foods);
    return arr;
  });
  const start = () => {
    if (spinning) return;

    const forceTriple =
      Math.random() < Math.max(0, Math.min(100, tripleChance)) / 100;

    let newStops: number[];
    if (forceTriple) {
      const pick = Math.floor(Math.random() * foods.length);
      newStops = [pick, pick, pick];
    } else {
      newStops = [
        Math.floor(Math.random() * foods.length),
        Math.floor(Math.random() * foods.length),
        Math.floor(Math.random() * foods.length),
      ];
    }

    let itemHeight = DEFAULT_ITEM_HEIGHT;
    const sampleReel = reelRefs.current[0];
    if (sampleReel && sampleReel.children.length > 0) {
      const el = sampleReel.children[0] as HTMLElement;
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) itemHeight = rect.height;
    }

    const centerOffset = Math.floor(VISIBLE_COUNT / 2);
    const baseIndex = Math.floor(REPEAT / 2) * foods.length;
    const newDistances = newStops.map(
      (stop) => (baseIndex + stop - centerOffset) * itemHeight
    );

    setStops(newStops);
    setDistances(newDistances);
    setKey((k) => k + 1);
    setSpinning(true);

    const results = newStops.map((idx) => foods[idx]);
    const maxDuration = Math.max(...durations);
    setTimeout(() => {
      setSpinning(false);
      if (newStops[0] === newStops[1] && newStops[1] === newStops[2]) {
        setConfetti(true);
        setTimeout(() => {
          setConfetti(false);
          setConfettiPieces([]);
        }, 3000);
      }
      onFinish?.(results);
    }, Math.round(maxDuration * 1000) + 200);

    durations.forEach((d, i) => {
      const snapDelay = Math.round(d * 1000 + 80);
      const dist = newDistances[i];
      setTimeout(() => {
        const motionEl = reelRefs.current[i];
        const containerEl = reelContainers.current[i];
        if (motionEl && containerEl) {
          const targetIndex =
            Math.floor(REPEAT / 2) * foods.length + newStops[i];
          const targetChild = motionEl.children[targetIndex] as
            | HTMLElement
            | undefined;
          if (targetChild) {
            const itemRect = targetChild.getBoundingClientRect();
            const containerRect = containerEl.getBoundingClientRect();
            const desiredTop =
              containerRect.top +
              containerRect.height / 2 -
              itemRect.height / 2;
            const currentTop = itemRect.top;
            const delta = currentTop - desiredTop;
            const finalY = -Math.round(dist - delta);
            (
              motionEl as HTMLElement
            ).style.transform = `translateY(${finalY}px)`;
          } else {
            (
              motionEl as HTMLElement
            ).style.transform = `translateY(-${Math.round(dist)}px)`;
          }
        }
      }, snapDelay);
    });
  };

  const computedDistanceFor = (stop: number) => {
    const itemHeight = DEFAULT_ITEM_HEIGHT;
    const centerOffset = Math.floor(VISIBLE_COUNT / 2);
    const baseIndex = Math.floor(REPEAT / 2) * foods.length;
    return (baseIndex + stop - centerOffset) * itemHeight;
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl grid grid-cols-3 gap-4">
          {reelArrays.map((items, i) => {
            const stop = stops[i] ?? 0;
            const computedDistance = computedDistanceFor(stop);
            const distance = distances[i] ?? computedDistance;

            const outerStyle: React.CSSProperties = {
              height: DEFAULT_ITEM_HEIGHT * VISIBLE_COUNT,
              position: "relative",
            };

            const centerOverlayStyle: React.CSSProperties = {
              position: "absolute",
              left: 6,
              right: 6,
              top: `calc(50% - ${DEFAULT_ITEM_HEIGHT / 2}px)`,
              height: DEFAULT_ITEM_HEIGHT,
              pointerEvents: "none",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
            };

            return (
              <div
                key={i}
                ref={(el) => {
                  reelContainers.current[i] = el;
                }}
                className="reel-outer rounded-lg bg-transparent"
                style={outerStyle}
              >
                <motion.div
                  ref={(el) => {
                    reelRefs.current[i] = el;
                  }}
                  key={key + "-" + i}
                  initial={{ y: 0 }}
                  animate={key > 0 ? { y: -distance } : { y: 0 }}
                  transition={
                    key > 0
                      ? {
                          duration: durations[i],
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : undefined
                  }
                >
                  {items.map((f, idx) => (
                    <div key={idx} className="border-b border-white/6">
                      <ReelItem food={f} />
                    </div>
                  ))}
                </motion.div>

                <div
                  style={centerOverlayStyle}
                  className="flex items-center justify-center"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button
          onClick={start}
          className="px-6 py-4 bg-white text-slate-900 rounded-full shadow-md text-xl font-semibold"
        >
          {spinning ? "Крутится..." : "Крутить рулетку"}
        </button>
      </div>

      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          {confettiPieces.map((p, i) => {
            const style: React.CSSProperties = {
              position: "absolute",
              left: `${p.left}%`,
              top: "-10%",
              width: p.width,
              height: p.height,
              background: p.color,
              transform: `rotate(${p.rotate}deg)`,
              opacity: 0.95,
              animation: `confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
            };
            return <div key={i} style={style} />;
          })}
        </div>
      )}
    </div>
  );
}
