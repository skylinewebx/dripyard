import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-maroon/60">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="rounded underline-offset-4 hover:text-brand hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-maroon" : ""}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="text-maroon/30">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
