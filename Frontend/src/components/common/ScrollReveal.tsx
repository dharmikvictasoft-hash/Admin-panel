import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  origin?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export default function ScrollReveal({
  children,
  delay = 0,
  origin = "bottom",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("scrollreveal").then((ScrollRevealLib) => {
      ScrollRevealLib.default().reveal(ref.current!, {
        delay: delay * 1000,
        distance: "20px",
        duration: 600,
        easing: "ease-out",
        origin: origin,
        opacity: 0,
        cleanup: true,
        reset: false,
      });
    });
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
