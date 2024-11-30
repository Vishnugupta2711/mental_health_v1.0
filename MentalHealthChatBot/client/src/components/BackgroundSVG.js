import React from "react";

const BackgroundSVG = () => {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-full bg-gray-900 overflow-hidden">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M100 0L0 0 0 100"
              fill="none"
              stroke="#111827"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#111827" />
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
      <div className="absolute inset-0 bg-[#111827] opacity-50" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#111827] to-[#111827] opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute -left-1/2 top-0 transform-gpu blur-3xl"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#111827] to-[#111827] opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
    </div>
  );
};

export default BackgroundSVG;
