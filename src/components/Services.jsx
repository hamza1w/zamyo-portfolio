import { services } from "../content/site.config";
import Reveal from "./Reveal";
import "./Services.css";

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="container services__grid">
        <Reveal className="services__primary">
          <p className="section-label">{services.heading}</p>
          <span className="services__tag">{services.primary.label}</span>
          <h2 className="services__primary-title">{services.primary.title}</h2>
          <p className="services__primary-desc">{services.primary.description}</p>
        </Reveal>

        <Reveal delay={120} className="services__list">
          <span className="services__tag services__tag--muted">{services.secondaryLabel}</span>
          {services.secondary.map((item) => (
            <div key={item.title} className="services__row">
              <span className="services__row-title">{item.title}</span>
              <span className="services__row-desc">{item.description}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
