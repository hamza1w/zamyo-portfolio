const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 3h2.2c.2 1.6 1.2 3 2.7 3.7v2.3a6.6 6.6 0 0 1-2.7-.7v6.4a5.7 5.7 0 1 1-5.7-5.7c.2 0 .4 0 .6.03v2.35a3.4 3.4 0 1 0 2.4 3.27V3Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.4-2.5-4.4-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1" />
      <path d="M13 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" />
    </svg>
  ),
};

export default function SocialIcon({ name }) {
  return <span className="social-icon">{icons[name] || icons.link}</span>;
}
