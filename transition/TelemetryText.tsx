"use client";

export default function TelemetryText() {
  const textLine1 =
    "GEAR: 8 // RPM: 11,500 // SPEED: 322 KM/H // DRS: ENABLED // ERS: DEPLOY // BRAKE BIAS: 56% // ";
  const textLine2 =
    "THROTTLE: 100% // G-FORCE: 4.5G // TYRE TEMP: 102°C // FUEL LOAD: 85KG // MGU-K: ACTIVE // ";
  const textLine3 =
    "MERCEDES W11 // RED BULL RB16 // FERRARI SF1000 // MCLAREN MCL35 // RENAULT R.S.20 // ";
  const textLine4 =
    "SECTOR 1: 27.452 // SECTOR 2: 29.104 // SECTOR 3: 23.881 // COMPOUND: C4 SOFT // PLAN A // ";

  return (
    // 1. Restored 'gap-6' to evenly space the rows apart. Added a slight overall opacity drop.
    <div className="absolute inset-0 flex flex-col justify-center gap-6 overflow-hidden pointer-events-none mix-blend-screen opacity-60">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left { animation: scroll-left 40s linear infinite; }
        .animate-scroll-right { animation: scroll-right 40s linear infinite; }
        
        .f1-stroke-text {
          color: transparent;
          /* 2. Softened the stroke from 1.0 down to 0.25 for a high-end wireframe look */
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* ROW 1 */}
      <div className="flex w-[200%] shrink-0 animate-scroll-left">
        {/* 3. Scaled down to 8vw, normal leading, removed font-black and tracking-tighter */}
        <p className="whitespace-nowrap text-[12vw] uppercase leading-none f1-stroke-text font-bebas-neue tracking-normal">
          {textLine1.repeat(10)}
        </p>
      </div>

      {/* ROW 2 */}
      {/* 4. Removed the mt-[-3vw] overlap hack */}
      <div className="flex w-[200%] shrink-0 animate-scroll-right">
        <p className="whitespace-nowrap text-[12vw] uppercase leading-none f1-stroke-text font-bebas-neue tracking-normal">
          {textLine2.repeat(10)}
        </p>
      </div>

      {/* ROW 3 */}
      <div className="flex w-[200%] shrink-0 animate-scroll-left">
        <p className="whitespace-nowrap text-[12vw] uppercase leading-none f1-stroke-text font-bebas-neue tracking-normal">
          {textLine3.repeat(10)}
        </p>
      </div>

      {/* ROW 4 */}
      <div className="flex w-[200%] shrink-0 animate-scroll-right">
        <p className="whitespace-nowrap text-[12vw] uppercase leading-none f1-stroke-text font-bebas-neue tracking-normal">
          {textLine4.repeat(10)}
        </p>
      </div>
    </div>
  );
}