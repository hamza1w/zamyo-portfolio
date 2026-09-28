import { useEffect, useState } from "react";
import { brand, nav, ui } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import "./Nav.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
  <div className="nav__inner container">
        <nav className="nav__links nav__pill" aria-label="Primary">
          <span className={`nav__pill-glass glass-liquid ${scrolled ? "is-visible" : ""}`} aria-hidden="true" />
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label[lang]}
            </a>
          ))}
        </nav>

        <a href="#top" className="nav__mark nav__pill" onClick={closeMenu}>
          <span className={`nav__pill-glass glass-liquid ${scrolled ? "is-visible" : ""}`} aria-hidden="true" />
          <span className="nav__mark-text">{brand.name}</span>
        </a>

        <div className="nav__actions">
          <button className="nav__lang glass-edge" onClick={toggleLang} aria-label="Switch language">
            {ui.languageToggle[lang]}
          </button>

          <a href={nav.cta.href} className="btn btn-primary nav__cta">
            {nav.cta.label[lang]}
          </a>

          <button
            className="nav__toggle"
            aria-label={open ? ui.closeMenu[lang] : ui.openMenu[lang]}
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
              {l.label[lang]}
            </a>
          ))}
          <a href={nav.cta.href} className="btn btn-primary" onClick={closeMenu}>
            {nav.cta.label[lang]}
          </a>
        </div>
      )}
    </header>
  );
}
