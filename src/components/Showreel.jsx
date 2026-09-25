import { useRef, useState } from "react";
import { showreel } from "../content/site.config";
import FrameCorners from "./FrameCorners";
import MediaImage from "./MediaImage";
import "./Showreel.css";

export default function Showreel() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play();
    setPlaying(true);
  };

  return (
    <section id="showreel" className="section showreel">
      <div className="container">
        <p className="section-label">{showreel.heading}</p>
        <h2 className="showreel__heading">{showreel.subheading}</h2>

        <div className="showreel__frame glass">
          <FrameCorners />

          {!playing && (
            <MediaImage
              className="showreel__poster"
              src={showreel.video.poster}
              alt="Showreel preview frame"
              label="Showreel poster"
            />
          )}

          <video
            ref={videoRef}
            className="showreel__video"
            src={showreel.video.src}
            poster={showreel.video.poster}
            controls={playing}
            playsInline
            style={{ opacity: playing ? 1 : 0 }}
          />

          {!playing && (
            <button className="showreel__play" onClick={play} aria-label="Play showreel">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 4.5v15l14-7.5-14-7.5Z" fill="currentColor" />
              </svg>
              <span className="showreel__duration">{showreel.duration}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
