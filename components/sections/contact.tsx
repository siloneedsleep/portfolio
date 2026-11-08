"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  Copy,
  Facebook,
  Github,
  Mail,
  MessageCircle,
} from "lucide-react";
import { profile } from "@/data/profile";
import {
  CONTACT_LIMITS,
  validateContactField,
  validateContactPayload,
  type ContactField,
  type ContactValidationError,
} from "@/lib/contact-validation";
import { FloatingInput } from "@/components/ui/floating-input";
import { ProgressButton } from "@/components/ui/progress-button";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

type FormStatus = "idle" | "sending" | "success" | "error";

export function Contact() {
  const t = useTranslations("contact");
  const common = useTranslations("common");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<ContactField, ContactValidationError>>
  >({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverErrorKey, setServerErrorKey] = useState<
    "error" | "notConfigured" | "rateLimited" | "timeout"
  >("error");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const errorMessage = (code?: ContactValidationError) =>
    code ? t(`validation.${code}`) : undefined;

  const focusFirstInvalid = (
    fieldErrors: Partial<Record<ContactField, ContactValidationError>>,
  ) => {
    if (fieldErrors.name) nameRef.current?.focus();
    else if (fieldErrors.email) emailRef.current?.focus();
    else if (fieldErrors.message) messageRef.current?.focus();
  };

  const handleFieldChange =
    (field: ContactField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (status === "success" || status === "error") {
        setStatus("idle");
      }
      if (errors[field]) {
        const nextErr = validateContactField(field, value);
        setErrors((prev) => ({ ...prev, [field]: nextErr ?? undefined }));
      }
    };

  const handleFieldBlur = (field: ContactField) => () => {
    const value = form[field];
    if (!value && !errors[field]) return;
    const err = validateContactField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err ?? undefined }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setToastOpen(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const validation = validateContactPayload(form);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      focusFirstInvalid(validation.errors);
      return;
    }

    setErrors({});
    setStatus("sending");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        errors?: Partial<Record<ContactField, ContactValidationError>>;
      };

      if (response.ok && payload.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "", website: "" });
        return;
      }

      if (response.status === 400 && payload.errors) {
        setErrors(payload.errors);
        setStatus("idle");
        focusFirstInvalid(payload.errors);
        return;
      }

      if (response.status === 429 || payload.code === "RATE_LIMITED") {
        setServerErrorKey("rateLimited");
      } else if (response.status === 503 || payload.code === "NOT_CONFIGURED") {
        setServerErrorKey("notConfigured");
      } else if (response.status === 504 || payload.code === "TIMEOUT") {
        setServerErrorKey("timeout");
      } else {
        setServerErrorKey("error");
      }
      setStatus("error");
    } catch (error) {
      const isAbort = error instanceof Error && error.name === "AbortError";
      setServerErrorKey(isAbort ? "timeout" : "error");
      setStatus("error");
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    form.name ? `[Portfolio] ${form.name}` : "[Portfolio] Contact",
  )}&body=${encodeURIComponent(form.message)}`;

  return (
    <section id="contact" className="scroll-mt-20 bg-muted/20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-primary">03 /</p>
          <h2 className="text-display-h2 mt-3">{t("title")}</h2>
          <p className="mt-4 max-w-md text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-8 rounded-2xl border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">
              {t("emailLabel")}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <a
                className="inline-flex min-h-10 items-center gap-2 font-mono text-sm text-primary hover:underline break-all"
                href={`mailto:${profile.email}`}
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span>{profile.email}</span>
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyEmail}
                className="min-h-10 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    {common("copied")}
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden="true" />
                    {t("copyEmail")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-medium text-muted-foreground">
              {t("social")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border bg-card px-3.5 py-2 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Github className="size-4" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border bg-card px-3.5 py-2 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Facebook className="size-4" aria-hidden="true" />
                <span>Facebook</span>
              </a>
              <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border bg-card px-3.5 py-2">
                <MessageCircle className="size-4" aria-hidden="true" />
                <span>
                  {t("discordLabel")}: {profile.discordHandle}
                </span>
              </span>
            </div>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:p-8"
        >
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="contact-website">{t("form.honeypot")}</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>

          <FloatingInput
            inputRef={nameRef}
            name="name"
            label={t("form.name")}
            value={form.name}
            onChange={handleFieldChange("name")}
            onBlur={handleFieldBlur("name")}
            error={errorMessage(errors.name)}
            autoComplete="name"
            maxLength={CONTACT_LIMITS.NAME_MAX}
            disabled={status === "sending"}
            required
          />

          <FloatingInput
            inputRef={emailRef}
            name="email"
            label={t("form.email")}
            type="email"
            value={form.email}
            onChange={handleFieldChange("email")}
            onBlur={handleFieldBlur("email")}
            error={errorMessage(errors.email)}
            autoComplete="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.EMAIL_MAX}
            disabled={status === "sending"}
            required
          />

          <FloatingInput
            inputRef={messageRef}
            name="message"
            label={t("form.message")}
            type="textarea"
            value={form.message}
            onChange={handleFieldChange("message")}
            onBlur={handleFieldBlur("message")}
            error={errorMessage(errors.message)}
            maxLength={CONTACT_LIMITS.MESSAGE_MAX}
            disabled={status === "sending"}
            required
          />

          <ProgressButton
            loading={status === "sending"}
            success={status === "success"}
            sendingLabel={t("form.sending")}
            sentLabel={t("form.sent")}
          >
            {t("form.send")}
          </ProgressButton>

          {status === "success" && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-lg border border-primary/25 bg-primary/10 px-3.5 py-2.5 text-sm text-foreground"
            >
              {t("form.success")}
            </p>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="flex flex-col gap-2 rounded-lg border border-destructive/35 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
            >
              <p>{t(`form.${serverErrorKey}`)}</p>
              {serverErrorKey === "notConfigured" && (
                <a
                  href={mailtoHref}
                  className="inline-flex w-fit items-center gap-1.5 font-medium underline"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  {t("form.openMailto")}
                </a>
              )}
            </div>
          )}
        </form>
      </div>

      <Toast
        open={toastOpen}
        message={t("emailCopied")}
        closeLabel={common("toastClose")}
        onClose={() => setToastOpen(false)}
      />
    </section>
  );
}
