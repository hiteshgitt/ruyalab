"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./WorkflowTabs.module.css";

const FLOWS = [
  {
    key: "idea",
    label: "Idea → product",
    src: "/workflows/idea-to-product.svg",
    alt: "Idea to product workflow: 1 Idea — define the vision; 2 Research — explore options; 3 Prototype — test assumptions; 4 Build — develop the product; 5 Launch — ship and learn.",
  },
  {
    key: "problem",
    label: "Problem solving",
    src: "/workflows/problem-solving.svg",
    alt: "Problem solving workflow: 1 Understand — clarify the problem; 2 Break down — find subproblems; 3 Solve — choose an approach; 4 Optimize — improve complexity; 5 Verify — test edge cases.",
  },
  {
    key: "software",
    label: "Software development",
    src: "/workflows/software-development.svg",
    alt: "Software development workflow: 1 Discover — requirements; 2 Design — architecture and UX; 3 Develop — code and review; 4 Test — QA and validation; 5 Deploy — release safely.",
  },
];

/** Accessible tabs (WAI-ARIA pattern: roving tabindex, arrow keys, Home/End). */
export function WorkflowTabs() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const last = FLOWS.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={styles.wrap}>
      <div role="tablist" aria-label="Workflows" className={styles.list} onKeyDown={onKey}>
        {FLOWS.map((f, i) => (
          <button
            key={f.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
          >
            <span className={styles.tabNum}>0{i + 1}</span> {f.label}
          </button>
        ))}
      </div>
      {FLOWS.map((f, i) => (
        <div
          key={f.key}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className={styles.panel}
        >
          <Image src={f.src} alt={f.alt} width={1000} height={430} unoptimized className={styles.img} />
        </div>
      ))}
    </div>
  );
}
