import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md", // "sm" | "md" | "lg"
  closeOnBackdrop = true,
  closeOnEsc = true,
  disableClose = false,
}) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc || disableClose) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, disableClose, onClose]);

  if (!open) return null;

  function handleBackdropMouseDown() {
    if (disableClose) return;
    if (closeOnBackdrop) onClose?.();
  }

  const node = (
    <div className="app-modal-overlay" onMouseDown={handleBackdropMouseDown}>
      <div
        className={`app-modal-window app-modal-${size}`}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
      >
        {(title || onClose) && (
          <div className="app-modal-header">
            <h4 className="m-0 app-modal-title">{title}</h4>

            <button
              className="app-modal-close"
              onClick={onClose}
              aria-label="close"
              disabled={disableClose}
              type="button"
            >
              ×
            </button>
          </div>
        )}

        <div className="app-modal-body">{children}</div>

        {footer && <div className="app-modal-footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
