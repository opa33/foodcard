import { useState } from "react";
import { foods, type Food } from "../data/foods";
import Roulette from "../components/Roulette";

export default function Home() {
  const [, setFood] = useState<Food | null>(
    () => foods[Math.floor(Math.random() * foods.length)]
  );
  const tripleChance = 10;

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

      <div className="w-full mt-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Шанс выпадения 3 одинаковых:</label>
          <div className="w-12 text-right font-medium">{tripleChance}%</div>
        </div>

        <Roulette
          tripleChance={tripleChance}
          onFinish={(results) => {
            // show the middle result as selected
            const middle = results[1] ?? results[0];
            setFood(middle);
          }}
        />
      </div>
    </div>
  );
}
