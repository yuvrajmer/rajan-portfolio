import { About } from "../components/home/About";
import { BrandMarquee } from "../components/home/BrandMarquee";
import { Contact } from "../components/home/Contact";
import { Hero } from "../components/home/Hero";
import { SelectedWork } from "../components/home/SelectedWork";
import { Toolkit } from "../components/home/Toolkit";
import { useDocumentMeta } from "../lib/hooks";

export default function Home() {
  useDocumentMeta(
    "Rajan Tarakhala — 2D/3D Motion Artist",
    "Rajan Tarakhala is a 2D/3D motion artist creating character-driven animation, VFX and campaign motion for tourism, sport and government brands in Sharjah, UAE."
  );
  return (
    <>
      <Hero />
      <BrandMarquee />
      <About />
      <Toolkit />
      <SelectedWork />
      <Contact />
    </>
  );
}