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

export default function App() {
  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Showreel />
        <Work />
        <Services />
        <Marquee label={skills.heading} items={skills.tools} />
        <Marquee label={clients.heading} items={clients.names} reverse />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
