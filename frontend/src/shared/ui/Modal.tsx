import {
    useEffect,
    useId,
    type MouseEvent,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    ariaLabel?: string;
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    ariaLabel = "Modal",
    className = "",
}: ModalProps) {
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-label={title ? undefined : ariaLabel}
                className={`relative w-full max-w-lg bg-card p-6 text-card-foreground shadow-xl ${className}`}
            >
                <div className="flex items-start justify-between gap-4">
                    {title && (
                        <h2 id={titleId} className="text-xl font-semibold">
                            {title}
                        </h2>
                    )}

                    <Button
                        type="button"
                        variant="unstyled"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="ml-auto grid size-8 shrink-0 cursor-pointer place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        icon={<X className="size-5" />}
                    />
                </div>

                <div className={title ? "mt-4" : ""}>{children}</div>
            </div>
        </div>,
        document.body,
    );
}
