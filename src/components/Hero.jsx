import { hero } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import FrameCorners from "./FrameCorners";
import MediaImage from "./MediaImage";
import "./Hero.css";

export default function Hero() {
  const { lang } = useLanguage();

  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="section-label">{hero.eyebrow[lang]}</p>

          <h1 className="hero__headline">
            {hero.headline[lang].map((line) => (
              <span key={line} className="hero__line">
                {line}
              </span>
            ))}
          </h1>

          <p className="hero__subtext">{hero.subtext[lang]}</p>

          <div className="hero__ctas">
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label[lang]}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label[lang]}
            </a>
          </div>
        </div>

        <div className="hero__portrait-wrap">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__portrait">
            <MediaImage src={hero.portrait.src} alt={hero.portrait.alt} label="Portrait" />
            <FrameCorners />
          </div>
        </div>
      </div>
    </section>
  );
}
