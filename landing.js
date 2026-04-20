const revealNodes = [...document.querySelectorAll("[data-reveal]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasHashNavigation = Boolean(window.location.hash);

if (!revealNodes.length) {
  document.documentElement.classList.add("js-landing");
} else if (prefersReducedMotion || hasHashNavigation) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
  document.documentElement.classList.add("js-landing");
  if (prefersReducedMotion) {
    document.documentElement.classList.add("js-landing-reduced-motion");
  }
} else {
  revealNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      node.classList.add("is-visible");
    }
  });

  document.documentElement.classList.add("js-landing");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealNodes.forEach((node) => observer.observe(node));
}
