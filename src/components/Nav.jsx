import { useEffect, useState } from "react";
import { brand, nav } from "../content/site.config";
import "./Nav.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled glass-liquid" : ""}`}>
      <div className="nav__inner container">
        <nav className="nav__links" aria-label="Primary">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="nav__mark" onClick={closeMenu}>
          {brand.name}
        </a>

        <div className="nav__actions">
          <a href={nav.cta.href} className="btn btn-primary nav__cta">
            {nav.cta.label}
          </a>

          <button
            className="nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__sheet glass">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} onClick={closeMenu}>
              {l.label}
            </a>
          ))}
          <a href={nav.cta.href} className="btn btn-primary" onClick={closeMenu}>
            {nav.cta.label}
          </a>
        </div>
      )}
    </header>
  );
}
