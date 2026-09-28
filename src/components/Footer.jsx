import { brand, nav } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import "./Footer.css";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__mark">{brand.name}</span>
        <nav className="footer__links" aria-label="Footer">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label[lang]}
            </a>
          ))}
        </nav>
        <span className="footer__meta">
          © {new Date().getFullYear()} {brand.name}. {brand.location[lang]}.
        </span>
      </div>
    </footer>
  );
}
