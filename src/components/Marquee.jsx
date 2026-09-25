import "./Marquee.css";

export default function Marquee({ label, items, reverse = false }) {
  // Pad short lists so the loop never looks sparse, then duplicate once for
  // a seamless -50% translation.
  let base = items;
  while (base.length < 6) base = [...base, ...items];
  const loop = [...base, ...base];

  return (
    <section className="section marquee">
      <div className="container">
        <p className="section-label">{label}</p>
      </div>

                      <div className="marquee__track-wrap">
          <div className="marquee__glass glass-liquid">
            <div className={`marquee__track ${reverse ? "marquee__track--reverse" : ""}`}>
          {loop.map((item, i) => (
            <span className="marquee__item" key={`${item}-${i}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
