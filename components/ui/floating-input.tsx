"use client";

import { useId, type ChangeEvent, type Ref } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLElement>["inputMode"];
  maxLength?: number;
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
}

export function FloatingInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  required,
  disabled,
  autoComplete,
  inputMode,
  maxLength,
  inputRef,
}: FloatingInputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const multiline = type === "textarea";
  const isEmail = type === "email";

  const sharedClasses = cn(
    "peer min-h-12 w-full rounded-lg border bg-background px-4 pb-2 pt-6 text-base text-foreground outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60",
    multiline && "min-h-32 resize-y",
    error && "border-destructive focus:border-destructive",
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as Ref<HTMLTextAreaElement>}
            id={id}
            name={name}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            required={required}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            placeholder=" "
            className={sharedClasses}
          />
        ) : (
          <input
            ref={inputRef as Ref<HTMLInputElement>}
            id={id}
            name={name}
            type={type}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            inputMode={inputMode}
            autoCorrect={isEmail ? "off" : undefined}
            autoCapitalize={isEmail ? "off" : undefined}
            spellCheck={isEmail ? false : undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            placeholder=" "
            className={sharedClasses}
          />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-3.5 origin-left text-sm text-muted-foreground transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </label>
      </div>
      {error && (
        <p
          id={errorId}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
