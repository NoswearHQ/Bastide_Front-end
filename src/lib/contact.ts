// Device detection and contact redirection utilities
import { toast } from "sonner";

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
  return /android|iphone|ipad|ipod|iemobile|windows phone|mobile|blackberry/i.test(ua);
}

type ContactRedirectParams = {
  phoneE164?: string; // e.g. "+21629380898"
  message?: string;   // prefilled message
  desktopEmail?: string; // fallback email on desktop
  desktopSubject?: string;
  desktopBodyPrefix?: string; // optional text before message
};

export function handleContactRedirect({
  phoneE164 = "+21629380898",
  message = "Bonjour, j’aimerais avoir des informations.",
  desktopEmail = "contact@bastidemedical.tn",
  desktopSubject = "Contact Bastide Tunisie",
  desktopBodyPrefix = "Demande depuis le site Bastide Tunisie:\n\n",
}: ContactRedirectParams): string {
  const encodedMsg = encodeURIComponent(message);

  if (isMobileDevice()) {
    const url = `https://wa.me/${phoneE164.replace(/\D/g, "")}?text=${encodedMsg}`;
    window.open(url, "_blank");
    return url;
  }

  const subject = encodeURIComponent(desktopSubject);
  const body = encodeURIComponent(`${desktopBodyPrefix}${message}`);
  const mailto = `mailto:${desktopEmail}?subject=${subject}&body=${body}`;
  window.location.href = mailto;
  // Subtle UX hint
  toast.info("Redirection vers votre messagerie (WhatsApp non disponible sur desktop)");
  return mailto;
}

export function openMailDevis({
  to = "contact@bastidemedical.tn",
  subject = "Demande de devis",
  body = "Bonjour, je souhaite obtenir un devis.\n\nMerci.",
}: { to?: string; subject?: string; body?: string }) {
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  return url;
}


