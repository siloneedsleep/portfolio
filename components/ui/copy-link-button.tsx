"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "./button";
import { Toast } from "./toast";

interface CopyLinkButtonProps {
  label: string;
  copiedLabel: string;
  toastMessage: string;
  toastCloseLabel: string;
}

export function CopyLinkButton({
  label,
  copiedLabel,
  toastMessage,
  toastCloseLabel,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setToastOpen(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={handleCopy}
        className="min-h-11 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <Link2 className="size-4" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </Button>

      <Toast
        open={toastOpen}
        message={toastMessage}
        closeLabel={toastCloseLabel}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
