export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  const titleId = title ? "modal-title" : undefined;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={title ? undefined : "Modal"}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          X
        </button>
        <div className="modal-content">
          {title ? <h2 id={titleId}>{title}</h2> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
