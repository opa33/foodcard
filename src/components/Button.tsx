import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function Button({
  children = "Фу...",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`btn mt-20 inline-flex items-center justify-center px-5 py-2 text-slate-200 rounded-full shadow-[0_20px_40px_rgba(2,6,23,0.12)] ring-1 transition-transform transform-gpu active:translate-y-0.5 ${className}`}
    >
      <span className="select-none text-2xl font-bold">{children}</span>
    </button>
  );
}
