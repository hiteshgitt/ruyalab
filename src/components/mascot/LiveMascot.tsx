import styles from "./LiveMascot.module.css";

/**
 * The hero mascot drawn inline (adapted from the brand kit's hero.svg).
 * Blinking and the idle bob are CSS. The eye and the star spin are attached
 * after the page has gone quiet. Decorative — hidden from assistive tech.
 */
export function LiveMascot({ className }: { className?: string }) {
  return (
    <svg
      data-live-mascot=""
      className={`${styles.mascot} ${className ?? ""}`}
      viewBox="80 20 800 560"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="lm-shell" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset=".45" stopColor="#e9f1ff" />
          <stop offset=".76" stopColor="#b8c8f4" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="lm-iris" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5ff6ff" />
          <stop offset=".42" stopColor="#168aff" />
          <stop offset=".75" stopColor="#3438ef" />
          <stop offset="1" stopColor="#a34dff" />
        </linearGradient>
        <linearGradient id="lm-fin" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#43eaff" />
          <stop offset=".55" stopColor="#387bff" />
          <stop offset="1" stopColor="#a64dff" />
        </linearGradient>
        <linearGradient id="lm-orbit" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5af4ff" />
          <stop offset=".5" stopColor="#4e78ff" />
          <stop offset="1" stopColor="#bd64ff" />
        </linearGradient>
        <radialGradient id="lm-floor">
          <stop stopColor="#4deaff" stopOpacity=".8" />
          <stop offset="1" stopColor="#684bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lm-orb-b">
          <stop stopColor="#e7ffff" />
          <stop offset=".35" stopColor="#42ddff" />
          <stop offset="1" stopColor="#2764ff" />
        </radialGradient>
        <radialGradient id="lm-orb-p">
          <stop stopColor="#fff" />
          <stop offset=".4" stopColor="#b56bff" />
          <stop offset="1" stopColor="#5b37ee" />
        </radialGradient>
        <clipPath id="lm-socket">
          <ellipse cx="490" cy="315" rx="171" ry="137" />
        </clipPath>
      </defs>

      <ellipse cx="500" cy="440" rx="250" ry="26" fill="url(#lm-floor)" opacity=".55" className={styles.shadow} />

      <g className={styles.body}>
        {/* Back orbits */}
        <g className={styles.orbits}>
          <path d="M235 260 C95 90 315 70 410 170" fill="none" stroke="url(#lm-orbit)" strokeWidth="15" strokeLinecap="round" opacity=".9" />
          <path d="M650 300 C860 120 855 340 700 395" fill="none" stroke="url(#lm-orbit)" strokeWidth="13" strokeLinecap="round" opacity=".85" />
        </g>
        <circle cx="690" cy="160" r="13" fill="url(#lm-orb-b)" className={styles.orbA} />
        <circle cx="295" cy="410" r="10" fill="url(#lm-orb-p)" className={styles.orbB} />

        {/* Fins */}
        <path d="M540 125 C590 65 660 40 735 44 C716 105 662 150 585 164 Z" fill="url(#lm-fin)" stroke="#9defff" strokeWidth="3" className={styles.finTop} />
        <path d="M360 330 C290 292 258 258 270 218 C324 235 370 272 392 310 Z" fill="url(#lm-fin)" stroke="#a5f4ff" strokeWidth="3" />
        <path d="M555 445 C610 472 645 505 650 540 C594 530 553 495 530 456 Z" fill="url(#lm-fin)" stroke="#9beeff" strokeWidth="3" />

        {/* Shell + socket */}
        <ellipse cx="490" cy="315" rx="205" ry="175" fill="url(#lm-shell)" stroke="#d9e7ff" strokeWidth="5" />
        <ellipse cx="490" cy="315" rx="171" ry="137" fill="#07132f" stroke="#8ca6f4" strokeWidth="6" />

        {/* Moving eye, clipped to the socket; the blink squashes this group */}
        <g clipPath="url(#lm-socket)">
          <g className={styles.blink}>
            <g data-iris="">
              <ellipse cx="490" cy="315" rx="145" ry="115" fill="url(#lm-iris)" stroke="#4deeff" strokeWidth="7" />
              <g data-pupil="">
                <ellipse cx="490" cy="315" rx="103" ry="86" fill="#06112d" stroke="#536dff" strokeWidth="5" />
                <g data-star="" className={styles.spin}>
                  <path d="M490 270 L505 300 L535 310 L505 320 L490 350 L475 320 L445 310 L475 300 Z" fill="#e9fdff" />
                </g>
                <ellipse cx="452" cy="275" rx="19" ry="10" transform="rotate(-42 452 275)" fill="#e6ffff" opacity=".95" />
                <ellipse cx="474" cy="290" rx="8" ry="5" transform="rotate(-42 474 290)" fill="#fff" opacity=".9" />
              </g>
            </g>
          </g>
        </g>

        {/* Foreground orbit + highlight */}
        <path d="M245 300 C350 500 640 500 760 315" fill="none" stroke="url(#lm-orbit)" strokeWidth="13" strokeLinecap="round" opacity=".95" />
        <path d="M260 275 C340 400 590 480 735 345" fill="none" stroke="#d6faff" strokeWidth="12" strokeLinecap="round" opacity=".8" />
        <path d="M260 275 C340 400 590 480 735 345" fill="none" stroke="url(#lm-orbit)" strokeWidth="7" strokeLinecap="round" className={styles.flow} />
        <path d="M355 220 C405 168 500 145 574 176" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".75" />
      </g>
    </svg>
  );
}
