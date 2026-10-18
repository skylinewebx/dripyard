import { StarIcon } from "./icons";

export default function Stars({ rating, size = 14, className = "" }: { rating: number; size?: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-0.5 text-brand ${className}`} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} width={size} height={size} filled={i < full} className={i < full ? "" : "opacity-30"} />
      ))}
    </span>
  );
}
