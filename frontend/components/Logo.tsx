export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Codube isometric cube logo — orange + purple */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cube-top" x1="18" y1="0" x2="36" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="cube-left" x1="0" y1="14" x2="18" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="cube-right" x1="18" y1="14" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        {/* Top face */}
        <path d="M18 2L34 11L18 20L2 11L18 2Z" fill="url(#cube-top)" />
        {/* Left face */}
        <path d="M2 11L18 20L18 34L2 25L2 11Z" fill="url(#cube-left)" />
        {/* Right face */}
        <path d="M18 20L34 11L34 25L18 34L18 20Z" fill="url(#cube-right)" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-white">codube</span>
    </div>
  );
}