"use client";

import { useEffect, useMemo, useState } from "react";

type TypedDescriptionProps = {
  text: string;
  typingSpeedMs?: number; // per character
  startDelayMs?: number;
  endHoldMs?: number; // how long to hold typed state before showing full text
  className?: string;
};

export default function TypedDescription({
  text,
  typingSpeedMs = 40,
  startDelayMs = 250,
  endHoldMs = 600,
  className,
}: TypedDescriptionProps) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  const safeText = useMemo(() => text ?? "", [text]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let stepId: ReturnType<typeof setTimeout> | null = null;

    const run = () => {
      let idx = 0;
      const step = () => {
        if (cancelled) return;
        if (idx <= safeText.length) {
          setTyped(safeText.slice(0, idx));
          idx += 1;
          stepId = setTimeout(step, typingSpeedMs);
        } else {
          // hold the typed state briefly, then reveal full static text
          timeoutId = setTimeout(() => {
            if (!cancelled) setDone(true);
          }, endHoldMs);
        }
      };
      step();
    };

    timeoutId = setTimeout(run, startDelayMs);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (stepId) clearTimeout(stepId);
    };
  }, [safeText, typingSpeedMs, startDelayMs, endHoldMs]);

  if (done) {
    return (
      <span className={className}>{safeText}</span>
    );
  }

  return (
    <span className={className} aria-label={safeText}>
      <span>{typed}</span>
      <span className="caret" aria-hidden>
        
      </span>
      <style jsx>{`
        .caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          margin-left: 2px;
          background-color: currentColor;
          vertical-align: -0.15em;
          animation: caret-blink 1s step-end infinite;
        }
        @keyframes caret-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}


