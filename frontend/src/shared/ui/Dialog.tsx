import {
  CircleHelp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "./Button";
import { Modal } from "./Modal";

export type DialogVariant = "regular" | "warning" | "danger";

export interface DialogProps {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  children?: ReactNode;
  description?: ReactNode;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
}

interface VariantStyles {
  Icon: LucideIcon;
  icon: string;
  panel: string;
  confirmButton: ButtonVariant;
}

const variantStyles: Record<DialogVariant, VariantStyles> = {
  regular: {
    Icon: CircleHelp,
    icon: "text-primary",
    panel: "bg-primary/10",
    confirmButton: "primary",
  },
  warning: {
    Icon: TriangleAlert,
    icon: "text-warning",
    panel: "bg-warning/10",
    confirmButton: "warning",
  },
  danger: {
    Icon: TriangleAlert,
    icon: "text-danger",
    panel: "bg-danger/10",
    confirmButton: "danger",
  },
};

export function Dialog({
  isOpen,
  title,
  onCancel,
  onConfirm,
  children,
  description,
  variant = "regular",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
}: DialogProps) {
  const { Icon, icon, panel, confirmButton } = variantStyles[variant];
  const content = children ?? description;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      className="rounded-xl"
    >
      {content && (
        <div className={`flex gap-3 rounded-lg p-4 ${panel}`}>
          <Icon
            aria-hidden="true"
            className={`mt-0.5 size-5 shrink-0 ${icon}`}
          />
          <div className="text-sm leading-6 text-muted-foreground">
            {content}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isConfirming}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmButton}
          onClick={onConfirm}
          isLoading={isConfirming}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
