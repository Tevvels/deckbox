import React, { useEffect, useState } from "react";

function TextPhaser({ phrases = [] }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState("visible");

  const current = phrases[index];
  useEffect(() => {
    if (phrases.length <= 1) return;
    const timeout = setTimeout(() => {
      setFade("hidden");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setFade("visible");
      }, 1500);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [index, phrases.length]);
  if (phrases.length === 0) return null;

  return (
    <div className={`phasing-text ${fade}`}>
      {current.type === "symbol" ? (
        <i
          className={`ms ${current.value} ms-cost ms-2x ms-shadow symbols`}
        ></i>
      ) : (
        current.value
      )}
    </div>
  );
}

export default TextPhaser;
