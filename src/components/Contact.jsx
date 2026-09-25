import { contact } from "../content/site.config";
import Reveal from "./Reveal";
import SocialIcon from "./SocialIcon";
import "./Contact.css";

export default function Contact() {
  const whatsappHref = `https://wa.me/${contact.whatsapp.number}`;

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="contact__intro">
          <h2 className="contact__heading">{contact.heading}</h2>
          <p className="contact__subheading">{contact.subheading}</p>
        </Reveal>

        <div className="contact__grid">
          <Reveal delay={80} className="contact__direct glass">
            <a href={`mailto:${contact.email}`} className="contact__channel">
              <span className="contact__channel-label">Email</span>
              <span className="contact__channel-value">{contact.email}</span>
            </a>

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="contact__channel">
              <span className="contact__channel-label">WhatsApp</span>
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
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required autoComplete="name" />
            </div>

            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>

            <div className="contact__field">
              <label htmlFor="message">Tell me about the project</label>
              <textarea id="message" name="message" rows="4" required />
            </div>

            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
