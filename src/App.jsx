import { lazy, Suspense } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Showreel from "./components/Showreel";
import Work from "./components/Work";
import Services from "./components/Services";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { skills, clients } from "./content/site.config";
import { useLanguage } from "./context/LanguageContext.jsx";

// Loaded after the initial page paint — three.js is heavy and the 3D
// layer is decorative, so it shouldn't delay first content showing up.
const Background3D = lazy(() => import("./components/Background3D"));

export default function App() {
  const { lang } = useLanguage();

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>
      <Nav />
      <main>
        <Hero />
        <Showreel />
        <Work />
        <Services />
        <Marquee label={skills.heading[lang]} items={skills.tools} />
        <Marquee label={clients.heading[lang]} items={clients.names} reverse />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
