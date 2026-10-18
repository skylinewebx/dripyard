/**
 * One shared IntersectionObserver for every scroll reveal on the site. Elements get the class
 * `is-in` the first time they enter the viewport (then are released), and CSS does the animation
 * on the compositor (transform + opacity). Far cheaper than one animation controller per element.
 */
let io: IntersectionObserver | null = null;

function observer(): IntersectionObserver {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io?.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
  }
  return io;
}

export function observeReveal(el: Element) {
  const o = observer();
  o.observe(el);
  return () => o.unobserve(el);
}
