import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Capabilities } from "@/components/sections/Capabilities";
import { Studio } from "@/components/sections/Studio";
import { Process } from "@/components/sections/Process";
import { Technology } from "@/components/sections/Technology";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/motion/Marquee";
import { capabilities } from "@/data/services";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={capabilities.map((c) => c.title)} speed={45} className="band" />
      <Work />
      <Capabilities />
      <Studio />
      <Process />
      <Technology />
      <Contact />
    </>
  );
}
