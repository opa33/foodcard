import { useState } from "react";
import { foods, type Food } from "../data/foods";
import FoodCard from "../components/FoodCard";
import { AnimatePresence } from "framer-motion";
import { useSwipe } from "../hooks/useSwipe";
import Button from "../components/Button";

export default function Home() {
  const [food, setFood] = useState<Food | null>(
    () => foods[Math.floor(Math.random() * foods.length)]
  );
  const { onTouchStart, onTouchEnd } = useSwipe();

  const nextFood = () => {
    const f = foods[Math.floor(Math.random() * foods.length)];
    setFood(f);
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center px-6"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#7c3aed33 0%, #fb718533 100%)",
      }}
    >
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Что сегодня кушаем?</h1>
      </div>
      <div
        style={{ perspective: 1200, width: "100%" }}
        className="flex items-center justify-center mt-10"
        onTouchStart={onTouchStart}
        onTouchEnd={(e) => {
          const direction = onTouchEnd(e);
          if (direction) nextFood();
        }}
      >
        <AnimatePresence mode="wait">
          {food && <FoodCard key={food.name} food={food} />}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center text-center">
        <div className="w-full max-w-xs">
          <Button onClick={nextFood} className="mx-auto">
            Фу...
          </Button>
        </div>
      </div>
    </div>
  );
}
