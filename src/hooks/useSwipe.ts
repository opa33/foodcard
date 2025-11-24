import { useState } from "react";

export const useSwipe = () => {
  const [startX, setStartX] = useState(0);

  const onTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;

    if (endX - startX > 80) return "right";
    if (startX - endX > 80) return "left";

    return null;
  };

  return { onTouchStart, onTouchEnd };
};
