export function SceneSunny() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="g-sunny-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.80" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.40" />
        </linearGradient>
        <radialGradient id="g-sunny-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="40%" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="f-sunny-soft"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-sunny-sky)" />
      {/* Sun soft glow */}
      <circle cx="155" cy="26" r="46" fill="url(#g-sunny-glow)" opacity="0.60" />
      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const x1 = 155 + 25 * Math.cos((a * Math.PI) / 180);
        const y1 = 26 + 25 * Math.sin((a * Math.PI) / 180);
        const x2 = 155 + 36 * Math.cos((a * Math.PI) / 180);
        const y2 = 26 + 36 * Math.sin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />;
      })}
      {/* Sun disk */}
      <circle cx="155" cy="26" r="18" fill="#fffde7" opacity="0.95" />
      <circle cx="155" cy="26" r="12" fill="#fde68a" />
      {/* Fluffy white cloud — lower left */}
      <ellipse cx="62" cy="80" rx="52" ry="22" fill="white" opacity="0.20" filter="url(#f-sunny-soft)" />
      <ellipse cx="55" cy="76" rx="38" ry="18" fill="white" opacity="0.65" />
      <ellipse cx="36" cy="70" rx="22" ry="16" fill="white" opacity="0.70" />
      <ellipse cx="74" cy="71" rx="26" ry="15" fill="white" opacity="0.68" />
      <ellipse cx="90" cy="77" rx="18" ry="12" fill="white" opacity="0.58" />
      <rect x="14" y="77" width="78" height="12" rx="6" fill="white" opacity="0.65" />
      {/* Small wisp cloud upper-mid */}
      <ellipse cx="106" cy="42" rx="22" ry="9" fill="white" opacity="0.30" />
      <ellipse cx="98" cy="39" rx="14" ry="8" fill="white" opacity="0.35" />
      <ellipse cx="116" cy="39" rx="12" ry="7" fill="white" opacity="0.32" />
    </svg>
  );
}

export function ScenePartlyCloudy() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="g-pc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="g-pc-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="45%" stopColor="#fde68a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <filter id="f-pc-blur"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="f-pc-soft"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-pc-sky)" />
      {/* Sun behind cloud */}
      <circle cx="148" cy="28" r="44" fill="url(#g-pc-sun)" opacity="0.55" />
      <circle cx="148" cy="28" r="17" fill="#fffde7" opacity="0.90" />
      <circle cx="148" cy="28" r="11" fill="#fde68a" />
      {/* Main foreground cloud */}
      <ellipse cx="80" cy="68" rx="64" ry="26" fill="white" opacity="0.22" filter="url(#f-pc-blur)" />
      <ellipse cx="72" cy="63" rx="48" ry="22" fill="white" opacity="0.60" />
      <ellipse cx="50" cy="56" rx="30" ry="20" fill="white" opacity="0.65" />
      <ellipse cx="94" cy="57" rx="36" ry="20" fill="white" opacity="0.68" />
      <ellipse cx="116" cy="64" rx="26" ry="16" fill="white" opacity="0.58" />
      <rect x="20" y="65" width="106" height="14" rx="7" fill="white" opacity="0.60" />
      {/* Small secondary cloud */}
      <ellipse cx="164" cy="55" rx="26" ry="12" fill="white" opacity="0.18" filter="url(#f-pc-soft)" />
      <ellipse cx="160" cy="52" rx="18" ry="10" fill="white" opacity="0.38" />
      <ellipse cx="172" cy="52" rx="14" ry="9" fill="white" opacity="0.35" />
      <rect x="142" y="54" width="36" height="9" rx="4" fill="white" opacity="0.38" />
    </svg>
  );
}

export function SceneOvercast() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-ov-sky" cx="35%" cy="15%" r="80%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#075985" stopOpacity="0.12" />
        </radialGradient>
        <filter id="f-ov-blur"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="f-ov-soft"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-ov-sky)" />
      <circle cx="58" cy="32" r="28" fill="#fef9c3" opacity="0.28" filter="url(#f-ov-soft)" />
      <circle cx="58" cy="32" r="14" fill="#fef08a" opacity="0.38" />
      <ellipse cx="108" cy="52" rx="82" ry="32" fill="white" opacity="0.22" filter="url(#f-ov-blur)" />
      <ellipse cx="98" cy="48" rx="64" ry="26" fill="white" opacity="0.60" />
      <ellipse cx="74" cy="42" rx="40" ry="22" fill="white" opacity="0.65" />
      <ellipse cx="126" cy="43" rx="38" ry="20" fill="white" opacity="0.62" />
      <ellipse cx="150" cy="50" rx="30" ry="18" fill="white" opacity="0.54" />
      <rect x="34" y="54" width="126" height="14" rx="7" fill="white" opacity="0.60" />
    </svg>
  );
}

export function SceneCold() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-cold-sky" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#075985" stopOpacity="0.18" />
        </radialGradient>
        <filter id="f-cold-glow"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-cold-sky)" />
      <circle cx="155" cy="28" r="32" fill="#e0f2fe" opacity="0.38" filter="url(#f-cold-glow)" />
      <circle cx="155" cy="28" r="15" fill="#bae6fd" opacity="0.7" />
      <circle cx="155" cy="28" r="9" fill="#e0f2fe" opacity="0.9" />
      {/* Three snowflakes at different sizes */}
      {[{ cx: 42, cy: 42, r: 14, sw: 2 },
      { cx: 100, cy: 30, r: 10, sw: 1.5 },
      { cx: 162, cy: 66, r: 8, sw: 1.3 }].map(({ cx, cy, r, sw }, si) =>
        [0, 60, 120].map((a, i) => {
          const ax = Math.cos((a * Math.PI) / 180);
          const ay = Math.sin((a * Math.PI) / 180);
          return (
            <g key={`${si}-${i}`} opacity="0.72">
              <line x1={cx - ax * r} y1={cy - ay * r} x2={cx + ax * r} y2={cy + ay * r}
                stroke="white" strokeWidth={sw} strokeLinecap="round" />
              {[-1, 1].map((s, j) => (
                <line key={j}
                  x1={cx + ax * r * 0.5 + s * ay * r * 0.28} y1={cy + ay * r * 0.5 - s * ax * r * 0.28}
                  x2={cx + ax * r * 0.5} y2={cy + ay * r * 0.5}
                  stroke="white" strokeWidth={sw * 0.75} strokeLinecap="round" />
              ))}
            </g>
          );
        })
      )}
      <ellipse cx="84" cy="82" rx="56" ry="22" fill="white" opacity="0.55" />
      <ellipse cx="66" cy="74" rx="36" ry="20" fill="white" opacity="0.60" />
      <ellipse cx="108" cy="75" rx="34" ry="18" fill="white" opacity="0.58" />
      <rect x="30" y="82" width="108" height="13" rx="6" fill="white" opacity="0.55" />
    </svg>
  );
}

export function SceneFreezing() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-frz-sky" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g-frz-sky)" />
      <ellipse cx="100" cy="40" rx="82" ry="30" fill="white" opacity="0.50" />
      <ellipse cx="78" cy="34" rx="52" ry="24" fill="white" opacity="0.60" />
      <ellipse cx="126" cy="34" rx="46" ry="22" fill="white" opacity="0.58" />
      <rect x="18" y="44" width="164" height="16" rx="8" fill="white" opacity="0.55" />
      {/* Falling snow particles */}
      {[28, 50, 72, 94, 116, 138, 160, 178, 38, 60, 82, 104, 126, 148, 170].map((x, i) => (
        <circle key={i} cx={x} cy={62 + (i * 15) % 44}
          r={i % 3 === 0 ? 2.5 : 1.6}
          fill="white" opacity={0.45 + (i % 4) * 0.12} />
      ))}
      <ellipse cx="100" cy="118" rx="112" ry="16" fill="white" opacity="0.30" />
    </svg>
  );
}

export function SceneHot() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="g-hot-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.70" />
          <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.30" />
        </linearGradient>
        <radialGradient id="g-hot-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="35%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="f-hot-glow"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="f-hot-soft"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-hot-sky)" />
      {/* Intense sun halo */}
      <circle cx="152" cy="22" r="58" fill="url(#g-hot-sun)" opacity="0.50" filter="url(#f-hot-glow)" />
      {/* Sun rays — more, longer, warmer */}
      {[0, 22, 45, 67, 90, 112, 135, 157, 180, 202, 225, 247, 270, 292, 315, 337].map((a, i) => {
        const r1 = 26, r2 = 40 + (i % 3) * 5;
        const x1 = 152 + r1 * Math.cos((a * Math.PI) / 180);
        const y1 = 22 + r1 * Math.sin((a * Math.PI) / 180);
        const x2 = 152 + r2 * Math.cos((a * Math.PI) / 180);
        const y2 = 22 + r2 * Math.sin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="1.3" strokeLinecap="round" opacity="0.50" />;
      })}
      <circle cx="152" cy="22" r="22" fill="#fffde7" opacity="0.95" />
      <circle cx="152" cy="22" r="15" fill="#fef08a" />
      {/* Heat-bleached thin clouds at horizon */}
      <ellipse cx="70" cy="88" rx="58" ry="16" fill="white" opacity="0.18" filter="url(#f-hot-soft)" />
      <ellipse cx="62" cy="85" rx="40" ry="13" fill="white" opacity="0.30" />
      <ellipse cx="44" cy="81" rx="22" ry="11" fill="white" opacity="0.32" />
      <ellipse cx="82" cy="82" rx="26" ry="11" fill="white" opacity="0.30" />
      <rect x="22" y="86" width="76" height="10" rx="5" fill="white" opacity="0.28" />
      {/* Heat shimmer wavy lines */}
      {[18, 52, 86, 120].map((x, i) => (
        <path key={i} d={`M${x} 104 Q${x + 5} 98 ${x + 10} 104 Q${x + 15} 110 ${x + 20} 104`}
          stroke="white" strokeWidth="0.8" fill="none" opacity="0.18" />
      ))}
    </svg>
  );
}

export function SceneDry() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-dry-sky" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="g-dry-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g-dry-sky)" />
      <circle cx="145" cy="24" r="46" fill="url(#g-dry-sun)" opacity="0.55" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const x1 = 145 + 24 * Math.cos((a * Math.PI) / 180);
        const y1 = 24 + 24 * Math.sin((a * Math.PI) / 180);
        const x2 = 145 + 34 * Math.cos((a * Math.PI) / 180);
        const y2 = 24 + 34 * Math.sin((a * Math.PI) / 180);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" opacity="0.62" />;
      })}
      <circle cx="145" cy="24" r="18" fill="#fef3c7" opacity="0.95" />
      <circle cx="145" cy="24" r="12" fill="#fde68a" />
      {/* Cracked earth dunes */}
      <path d="M0 108 Q40 90 80 106 Q118 122 158 100 Q178 92 200 100 L200 120 L0 120 Z"
        fill="#d97706" opacity="0.28" />
      <path d="M0 116 Q50 108 100 114 Q152 120 200 112 L200 120 L0 120 Z"
        fill="#fbbf24" opacity="0.16" />
      {/* Crack lines */}
      <path d="M38 104 L50 110 L58 106" stroke="#92400e" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
      <path d="M88 108 L96 115" stroke="#92400e" strokeWidth="1" fill="none" opacity="0.30" strokeLinecap="round" />
      <path d="M128 102 L138 108 L144 104" stroke="#92400e" strokeWidth="1" fill="none" opacity="0.30" strokeLinecap="round" />
    </svg>
  );
}

export function SceneRainy() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-rain-sky" cx="50%" cy="15%" r="85%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.25" />
        </radialGradient>
        <filter id="f-rain-blur"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-rain-sky)" />
      <ellipse cx="100" cy="42" rx="80" ry="30" fill="#94a3b8" opacity="0.32" filter="url(#f-rain-blur)" />
      <ellipse cx="90" cy="38" rx="62" ry="24" fill="white" opacity="0.56" />
      <ellipse cx="66" cy="32" rx="40" ry="22" fill="white" opacity="0.62" />
      <ellipse cx="118" cy="33" rx="38" ry="20" fill="white" opacity="0.59" />
      <ellipse cx="140" cy="40" rx="30" ry="17" fill="white" opacity="0.53" />
      <rect x="26" y="43" width="132" height="14" rx="7" fill="white" opacity="0.56" />
      {/* Teardrops */}
      {[36, 56, 76, 96, 116, 136, 156, 46, 66, 86, 106, 126, 146].map((x, i) => {
        const y = 66 + (i * 13) % 38;
        return (
          <path key={i}
            d={`M${x} ${y} Q${x - 2.5} ${y + 5} ${x} ${y + 9} Q${x + 2.5} ${y + 5} ${x} ${y}`}
            fill="#93c5fd" opacity={0.55 + (i % 3) * 0.12} />
        );
      })}
    </svg>
  );
}

export function SceneVeryHumid() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-vhum-sky" cx="50%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.38" />
        </radialGradient>
        <filter id="f-vhum-blur"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <rect width="200" height="120" fill="url(#g-vhum-sky)" />
      <ellipse cx="100" cy="36" rx="92" ry="32" fill="#60a5fa" opacity="0.28" filter="url(#f-vhum-blur)" />
      <ellipse cx="96" cy="32" rx="72" ry="26" fill="#bfdbfe" opacity="0.52" />
      <ellipse cx="68" cy="26" rx="46" ry="24" fill="#dbeafe" opacity="0.56" />
      <ellipse cx="128" cy="26" rx="42" ry="22" fill="#dbeafe" opacity="0.54" />
      <ellipse cx="150" cy="35" rx="32" ry="18" fill="#bfdbfe" opacity="0.48" />
      <rect x="22" y="40" width="152" height="14" rx="7" fill="#dbeafe" opacity="0.55" />
      {/* Slanted heavy rain */}
      {[20, 36, 52, 68, 84, 100, 116, 132, 148, 164, 28, 44, 60, 76, 92, 108, 124, 140, 156, 172].map((x, i) => (
        <line key={i}
          x1={x} y1={58 + (i * 11) % 38}
          x2={x - 4} y2={58 + (i * 11) % 38 + 15}
          stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"
          opacity={0.48 + (i % 4) * 0.10} />
      ))}
    </svg>
  );
}

export function SceneVibStable() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-vstable" cx="50%" cy="60%" r="80%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#065f46" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g-vstable)" />
      {[52, 36, 20].map((r, i) => (
        <circle key={i} cx="100" cy="66" r={r} fill="none"
          stroke="white" strokeWidth="1" opacity={0.12 + i * 0.10} />
      ))}
      <line x1="18" y1="66" x2="182" y2="66" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.50" />
      <path d="M82 64 L96 78 L120 52" stroke="white" strokeWidth="3" fill="none"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
    </svg>
  );
}

export function SceneVibLow() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-vlow" cx="50%" cy="60%" r="80%">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#3f6212" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g-vlow)" />
      <path d="M10 68 Q30 54 50 68 Q70 82 90 68 Q110 54 130 68 Q150 82 170 68 Q185 60 194 68"
        stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.70" />
      <path d="M10 76 Q30 65 50 76 Q70 87 90 76 Q110 65 130 76 Q150 87 170 76 Q185 71 194 76"
        stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.22" />
    </svg>
  );
}

export function SceneVibMed() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-vmed" cx="50%" cy="60%" r="80%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g-vmed)" />
      <path d="M8 68 Q22 42 36 68 Q50 94 64 68 Q78 42 92 68 Q106 94 120 68 Q134 42 148 68 Q162 94 176 68 Q188 48 196 68"
        stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.75" />
      <path d="M8 76 Q22 55 36 76 Q50 97 64 76 Q78 55 92 76 Q106 97 120 76 Q134 55 148 76 Q162 97 176 76 Q188 62 196 76"
        stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.26" />
      {/* Warning triangle outline */}
      <path d="M94 18 L114 52 L74 52 Z" fill="white" fillOpacity="0.14" stroke="white" strokeWidth="1.5" strokeLinejoin="round" opacity="0.55" />
      <line x1="94" y1="28" x2="94" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.68" />
      <circle cx="94" cy="47" r="1.5" fill="white" opacity="0.68" />
    </svg>
  );
}

export function SceneVibHigh() {
  return (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="g-vhigh" cx="50%" cy="60%" r="80%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.28" />
        </radialGradient>
      </defs>
      <rect width="200" height="120" fill="url(#g-vhigh)" />
      <path d="M6 68 Q14 34 22 68 Q30 102 38 68 Q46 34 54 68 Q62 102 70 68 Q78 34 86 68 Q94 102 102 68 Q110 34 118 68 Q126 102 134 68 Q142 34 150 68 Q158 102 166 68 Q174 34 182 68 Q190 94 196 68"
        stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.80" />
      <line x1="100" y1="16" x2="100" y2="102" stroke="white" strokeWidth="1.2" opacity="0.28" strokeDasharray="4 3" />
      <line x1="86" y1="22" x2="114" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
      <line x1="114" y1="22" x2="86" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}
