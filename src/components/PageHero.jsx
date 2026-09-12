import './PageHero.scss';

export default function PageHero({ eyebrow, title, description, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-hero__description">{description}</p>}
        {children && <div className="page-hero__extra">{children}</div>}
      </div>
    </section>
  );
}
