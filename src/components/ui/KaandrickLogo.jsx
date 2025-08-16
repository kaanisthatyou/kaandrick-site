import { useState } from "react";

export default function KaandrickLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-block  text-3xl pt-1 font-bold tracking-widest overflow-hidden"
      style={{ cursor: "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative z-0 text-white">KAANDRICK</span>

      <span
        className="absolute inset-0 z-10 pointer-events-none pt-1 bg-cover bg-center text-transparent bg-clip-text transition-[clip-path] duration-700 ease-out"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/en/5/51/Kendrick_Lamar_-_Damn.png')",
          backgroundPosition: "center 35%",
          backgroundSize: "cover",
          textShadow: `
            0 0 10px rgba(255, 26, 26, 0.5),
            0 0 20px rgba(255, 26, 26, 0.3)
          `,
          clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        }}
      >
        KAANDRICK
      </span>
    </span>
  );
}
