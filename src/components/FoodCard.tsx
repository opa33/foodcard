import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Food } from "../data/foods";

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2; // -1 .. 1
    const py = (y / rect.height - 0.5) * 2;
    const rotateY = px * 10; // degrees
    const rotateX = -py * 10;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0px)`
    );
  };

  const handleLeave = () =>
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: transform }}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -30 }}
      transition={{ duration: 0.28 }}
      className="relative w-full max-w-md md:w-80 md:h-96 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl shadow-[0_30px_60px_rgba(12,12,15,0.45)] rounded-2xl
                 flex flex-col items-center justify-center text-center p-6 will-change-transform"
    >
      <div
        className="rounded-full bg-white/20 p-6 mb-3 flex items-center justify-center"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="text-6xl md:text-7xl leading-none">{food.emoji}</div>
      </div>

      <h2
        className="text-xl md:text-3xl font-semibold text-gray-800"
        style={{ transform: "translateZ(20px)" }}
      >
        {food.name}
      </h2>

      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "inset 0 10px 80px rgba(0,0,0,0.06)" }}
      />
    </motion.div>
  );
}
