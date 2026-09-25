import { useEffect, useState } from "react";
import { projects } from "../content/site.config";
import FrameCorners from "./FrameCorners";
import MediaImage from "./MediaImage";
import Reveal from "./Reveal";
import "./Work.css";

export default function Work() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="work" className="section work">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="section-label">Selected work</p>
            <h2 className="work__heading">A few recent cuts.</h2>
          </div>
        </div>

        <div className="work__grid">
          {projects.map((p, i) => (
            <Reveal
              as="button"
              key={p.id}
              delay={i * 60}
              className={`work__card work__card--${p.ratio === "16 / 9" ? "wide" : "tall"}`}
              onClick={() => setActive(p)}
              aria-label={`Open project: ${p.title}`}
            >
              <div className="work__media" style={{ aspectRatio: p.ratio }}>
                <MediaImage src={p.thumb} alt="" label={p.category} />
                <FrameCorners />
                <div className="work__overlay">
                  <span className="work__category">{p.category}</span>
                  <span className="work__title">{p.title}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div className="work__lightbox" role="dialog" aria-modal="true" aria-label={active.title}>
          <div className="work__lightbox-backdrop" onClick={() => setActive(null)} />
          <div className="work__lightbox-panel glass">
            <button className="work__close" onClick={() => setActive(null)} aria-label="Close project">
              ✕
            </button>

            <div className="work__lightbox-media" style={{ aspectRatio: active.ratio }}>
              <video
                src={active.video}
                poster={active.thumb}
                controls
                playsInline
                autoPlay
              />
            </div>

            <div className="work__lightbox-info">
              <span className="work__category">{active.category} · {active.year}</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
