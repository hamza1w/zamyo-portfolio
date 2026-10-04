import { certificates } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal";
import "./Certificates.css";

export default function Certificates() {
  const { lang } = useLanguage();

  return (
    <section id="certificates" className="section certificates">
      <div className="container">
        <Reveal>
          <p className="section-label">{certificates.sectionLabel[lang]}</p>
          <h2 className="certificates__title">{certificates.title[lang]}</h2>
        </Reveal>

        <Reveal className="certificates__grid">
          {certificates.items.map((c, i) => (
            <div key={i} className="certificates__card glass-edge">
              <span className="certificates__name">{c.name[lang]}</span>
              <span className="certificates__issuer">{c.issuer[lang]}</span>
              {c.file && (
                <a
                  className="certificates__link"
                  href={c.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {certificates.viewLabel[lang]} ↗
                </a>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
