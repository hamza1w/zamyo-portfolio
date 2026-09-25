import { useState } from "react";

/**
 * Wraps an <img>. Until the real file at `src` exists (or while it's
 * loading), shows a designed placeholder instead of a broken-image icon,
 * so the site looks intentional before real assets are dropped in.
 * Swap in a real file at the same path and it takes over automatically.
 */
export default function MediaImage({ src, alt = "", label, className = "", imgProps = {} }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`media-image ${loaded ? "" : "media-image--empty"} ${className}`.trim()}>
      {!loaded && (
        <div className="media-image__placeholder" aria-hidden="true">
          {label && <span>{label}</span>}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
        {...imgProps}
      />
    </div>
  );
}
