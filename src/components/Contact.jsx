import { contact } from "../content/site.config";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal";
import SocialIcon from "./SocialIcon";
import "./Contact.css";

export default function Contact() {
  const { lang } = useLanguage();
  const whatsappHref = `https://wa.me/${contact.whatsapp.number}`;
  const f = contact.form.fields;

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="contact__intro">
          <h2 className="contact__heading">{contact.heading[lang]}</h2>
          <p className="contact__subheading">{contact.subheading[lang]}</p>
        </Reveal>

        <div className="contact__grid">
          <Reveal delay={80} className="contact__direct glass">
            <a href={`mailto:${contact.email}`} className="contact__channel">
              <span className="contact__channel-label">{contact.emailLabel[lang]}</span>
              <span className="contact__channel-value">{contact.email}</span>
            </a>

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="contact__channel">
              <span className="contact__channel-label">{contact.whatsappLabel[lang]}</span>
              <span className="contact__channel-value">{contact.whatsapp.label}</span>
            </a>

            <div className="contact__social">
              {contact.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  <SocialIcon name={s.icon} />
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} as="form" className="contact__form glass" action={contact.form.action} method="POST">
            <div className="contact__field">
              <label htmlFor="name">{f.name[lang]}</label>
              <input id="name" name="name" type="text" required autoComplete="name" />
            </div>

            <div className="contact__field">
              <label htmlFor="email">{f.email[lang]}</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>

            <div className="contact__field">
              <label htmlFor="message">{f.message[lang]}</label>
              <textarea id="message" name="message" rows="4" required />
            </div>

            <button type="submit" className="btn btn-primary">
              {f.submit[lang]}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
