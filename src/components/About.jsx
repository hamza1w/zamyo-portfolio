import { about } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal";
import "./About.css";

export default function About() {
  const { lang } = useLanguage();

  return (
    <section id="about" className="section about">
      <div className="container about__wrap">
        <Reveal className="about__copy">
          <p className="section-label">{about.heading[lang]}</p>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "about__lede" : "about__p"}>
              {p[lang]}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
