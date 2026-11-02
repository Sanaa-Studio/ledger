import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "regular" | "small";
};

export const Button = ({
  className = "",
  variant = "secondary",
  size = "regular",
  ...props
}: ButtonProps) => (
  <button
    className={`button button--${variant} button--${size} ${className}`.trim()}
    {...props}
  />
);

export const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section className={`surface-card ${className}`.trim()}>{children}</section>
);

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <header className="page-heading">
    <div>
      <h1>{title}</h1>
      {description && <p className="muted">{description}</p>}
    </div>
    {action && <div className="page-heading__action">{action}</div>}
  </header>
);

export const Modal = ({
  title,
  description,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) => {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        className={`modal ${wide ? "modal--wide" : ""}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
            ),
          ).filter((element) => !element.closest("[hidden], [inert]"));
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (!first || !last) {
            event.preventDefault();
            return;
          }
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === dialogRef.current)
          ) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="modal__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && (
              <p id={descriptionId} className="muted">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="quiet"
            size="small"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
};

export const Notice = ({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) => (
  <div
    className={`notice notice--${tone}`}
    role={tone === "error" ? "alert" : "status"}
  >
    {children}
  </div>
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="empty-state">
    <span className="empty-state__icon" aria-hidden="true">
      ＋
    </span>
    <h2>{title}</h2>
    <p className="muted">{description}</p>
    {action}
  </div>
);

export const LoadingState = ({ label = "Loading" }: { label?: string }) => (
  <div className="loading-state" role="status">
    <span className="spinner" aria-hidden="true" />
    <span>{label}…</span>
  </div>
);

export const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <Notice>
    <span>{message}</span>
    {onRetry && (
      <Button variant="quiet" size="small" onClick={onRetry}>
        Try again
      </Button>
    )}
  </Notice>
);

export const Badge = ({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "positive" | "negative";
}) => <span className={`badge badge--${tone}`}>{children}</span>;

export const PageSelector = ({
  page,
  pages,
  onPageChange,
}: {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}) => {
  if (pages < 2) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button
        size="small"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span>
        Page {page} of {pages}
      </span>
      <Button
        size="small"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
};
