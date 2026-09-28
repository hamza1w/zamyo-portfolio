import { services } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal";
import "./Services.css";

export default function Services() {
  const { lang } = useLanguage();

  return (
    <section id="services" className="section services">
      <div className="container services__grid">
        <Reveal className="services__primary">
          <p className="section-label">{services.heading[lang]}</p>
          <span className="services__tag glass-edge">{services.primary.label[lang]}</span>
          <h2 className="services__primary-title">{services.primary.title[lang]}</h2>
          <p className="services__primary-desc">{services.primary.description[lang]}</p>
        </Reveal>

        <Reveal delay={120} className="services__list">
          <span className="services__tag services__tag--muted glass-edge">{services.secondaryLabel[lang]}</span>
          {services.secondary.map((item) => (
            <div key={item.title.en} className="services__row">
              <span className="services__row-title">{item.title[lang]}</span>
              <span className="services__row-desc">{item.description[lang]}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
