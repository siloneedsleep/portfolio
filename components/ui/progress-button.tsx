import { Check, LoaderCircle } from "lucide-react";
import { Button } from "./button";

export function ProgressButton({
  loading,
  success,
  sendingLabel,
  sentLabel,
  children,
}: {
  loading: boolean;
  success: boolean;
  sendingLabel: string;
  sentLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="min-h-11 cursor-pointer"
    >
      {loading ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {sendingLabel}
        </>
      ) : success ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          {sentLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
