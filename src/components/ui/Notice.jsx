import './Notice.scss';

// tone: 'success' | 'error' | 'info'. Renders nothing without children.
export default function Notice({ tone = 'info', children, style }) {
  if (!children) return null;
  return (
    <p className={`ui-notice ui-notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'} style={style}>
      {children}
    </p>
  );
}
