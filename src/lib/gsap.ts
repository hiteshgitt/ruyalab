"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, useGSAP);
}

export { motion, MQ } from "@/lib/motion";
export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };
