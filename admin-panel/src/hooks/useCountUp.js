import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up from 0 to `value` whenever `value` changes.
 * Used by dashboard stat cards for a lively, attention-grabbing entrance.
 */
export function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    const target = Number(value) || 0;
    const startTime = performance.now();
    const startValue = 0;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValue + (target - startValue) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return display;
}
