// Form field using the site's existing auth-form styles.
// <Field id="x" label="Name" icon={User} error={errors.name}><input id="x" ... /></Field>
export default function Field({ id, label, icon: Icon, error, select = false, children }) {
  return (
    <div className="auth-form__field">
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`auth-form__input-wrap${select ? ' auth-form__input-wrap--select' : ''}`}>
        {Icon && <Icon size={16} />}
        {children}
      </div>
      {error && <span className="auth-form__error">{error}</span>}
    </div>
  );
}
