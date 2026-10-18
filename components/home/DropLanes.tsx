import type { CSSProperties } from "react";

/** Two photo lanes that travel at different speeds as the section scrolls (layered depth). Pure CSS scroll-driven animation. */
export default function DropLanes({ laneA, laneB }: { laneA: React.ReactNode; laneB: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
      <div className="sd-y flex flex-col gap-10 sm:gap-16" style={{ "--from": "3%", "--to": "-7%" } as CSSProperties}>
        {laneA}
      </div>
      <div className="sd-y mt-14 flex flex-col gap-10 sm:mt-24 sm:gap-16" style={{ "--from": "-4%", "--to": "9%" } as CSSProperties}>
        {laneB}
      </div>
    </div>
  );
}
