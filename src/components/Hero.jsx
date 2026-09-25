import { hero } from "../content/site.config";
import FrameCorners from "./FrameCorners";
import PortraitGallery from "./PortraitGallery";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="section-label">{hero.eyebrow}</p>

          <h1 className="hero__headline">
            {hero.headline.map((line) => (
              <span key={line} className="hero__line">
                {line}
              </span>
            ))}
          </h1>

          <p className="hero__subtext">{hero.subtext}</p>

          <div className="hero__ctas">
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="hero__portrait-wrap">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__portrait">
            <PortraitGallery photos={hero.portraits} />
            <FrameCorners />
          </div>
        </div>
      </div>
    </section>
  );
}
