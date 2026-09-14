import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./Button";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-3.5 text-sm",
  lg: "min-h-12 px-4 text-base",
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    leadingIcon,
    inputSize = "md",
    id,
    type = "text",
    required,
    disabled,
    className,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
  const isPassword = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-foreground"
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground"
          >
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={isPassword && isPasswordVisible ? "text" : type}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={joinClassNames(
            "w-full rounded-lg border bg-card text-card-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
            error ? "border-danger focus:border-danger" : "border-input",
            sizeStyles[inputSize],
            Boolean(leadingIcon) && "pl-10",
            isPassword && "pr-11",
            className,
          )}
          {...props}
        />

        {isPassword && (
          <Button
            type="button"
            variant="unstyled"
            disabled={disabled}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-1.5 my-auto grid size-9 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none"
            icon={isPasswordVisible ? (
              <EyeOff aria-hidden="true" className="size-[1.125rem]" />
            ) : (
              <Eye aria-hidden="true" className="size-[1.125rem]" />
            )}
          />
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs font-medium leading-5 text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
