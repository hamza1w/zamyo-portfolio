import { lazy, Suspense, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Showreel from "./components/Showreel";
import Work from "./components/Work";
import Services from "./components/Services";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { skills, clients } from "./content/site.config";
import { useLanguage } from "./context/LanguageContext.jsx";

// Loaded after the initial page paint — three.js is heavy and this layer
// is decorative, so it shouldn't delay first content showing up.
const Scene3D = lazy(() => import("./components/Scene3D"));

// Phones and small tablets skip the 3D scene entirely (the three.js chunk is
// never downloaded) and use the light CSS background in mobile.css instead.
// Same breakpoint as the mobile styles. Desktop is unchanged.
const MOBILE_QUERY = "(max-width: 900px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange); // older Safari
    return () => mq.removeListener(onChange);
  }, []);

  return isMobile;
}

export default function App() {
  const { lang } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      {!isMobile && (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      )}
      <div className="site-content">
        <Nav />
        <main>
          <Hero />
          <Showreel />
          <Work />
          <Services />
          <Marquee label={skills.heading[lang]} items={skills.tools} />
          <Marquee label={clients.heading[lang]} items={clients.names} reverse />
          <About />
          <Certificates />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
