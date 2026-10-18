export default function ShopSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-[272px_1fr]" aria-busy="true" aria-label="Loading sneakers">
      <div className="skeleton hidden h-[520px] rounded-[28px] lg:block" />
      <div>
        <div className="skeleton mb-8 h-12 rounded-full" />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i}>
              <div className="skeleton aspect-[4/5] rounded-[28px]" />
              <div className="skeleton mt-4 h-4 w-3/4 rounded-full" />
              <div className="skeleton mt-2 h-4 w-1/3 rounded-full" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
