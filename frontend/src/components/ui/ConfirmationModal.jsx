import { createPortal } from "react-dom";

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onCancel?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={handleBackdropClick}
      />
      <div
        className="relative z-10 w-full max-w-md rounded-3xl border border-ink-100/90 bg-white p-6 shadow-[0_25px_50px_-12px_rgb(15_23_42_/_0.25)] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{message}</p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
          <button type="button" onClick={handleCancel} className="btn-secondary w-full sm:w-auto sm:min-w-[100px]">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2 sm:w-auto sm:min-w-[100px]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
