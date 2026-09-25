import { useEffect, useRef, useState } from "react";
import MediaImage from "./MediaImage";
import "./PortraitGallery.css";

/**
 * A framed portrait that can hold several photos. Hovering (desktop) cycles
 * through them; tapping (touch devices, where there's no hover) advances to
 * the next one. Dots at the bottom show position and are directly clickable.
 */
export default function PortraitGallery({ photos }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!hovering || photos.length < 2 || reducedMotion) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [hovering, photos.length, reducedMotion]);

  const handleLeave = () => {
    setHovering(false);
    setIndex(0);
  };

  const handleTap = () => {
    if (photos.length < 2) return;
    setIndex((i) => (i + 1) % photos.length);
  };

  return (
  <div className="portrait-gallery-wrap">
    <div
      className="portrait-gallery"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      onTouchStart={handleTap}
    >
      {photos.map((p, i) => (
        <div
          key={p.src}
          className="portrait-gallery__slide"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? "false" : "true"}
        >
          <MediaImage src={p.src} alt={p.alt} label={`Portrait ${i + 1}`} />
        </div>
      ))}
    </div>

    {photos.length > 1 && (
      <div
        className="portrait-gallery__dots"
        role="tablist"
        aria-label="Portrait photos"
      >
        {photos.map((_, i) => (
          <button
            key={i}
            className={i === index ? "is-active" : ""}
            aria-label={`Show photo ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    )}
  </div>
);
}
