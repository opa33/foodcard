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
      className={`mt-4 inline-flex items-center justify-center px-5 py-2 bg-white text-slate-900 rounded-full shadow-[0_10px_30px_rgba(2,6,23,0.12)] ring-1 transition-transform transform-gpu active:translate-y-0.5 ${className}`}
    >
      <span className="select-none text-base font-semibold">{children}</span>
    </button>
  );
}
