import { about } from "../content/site.config";
import Reveal from "./Reveal";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__wrap">
        <Reveal className="about__copy">
          <p className="section-label">{about.heading}</p>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "about__lede" : "about__p"}>
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
