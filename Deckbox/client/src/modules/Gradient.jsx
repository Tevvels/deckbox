import React, { useMemo } from "react";

function Gradient({ children, className = "" }) {
  const pos = useMemo(
    () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    }),
    [],
  );
  return (
    <div
      className={`gradient ${className}`}
      style={{ "--gradient-x": `${pos.x}%`, "--gradient-y": `${pos.y}%` }}
    >
      {children}
    </div>
  );
}

export default Gradient;
