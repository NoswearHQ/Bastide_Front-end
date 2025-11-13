// Device detection and contact redirection utilities
import { toast } from "sonner";
import Swal from "sweetalert2";
import { sendOrderEmail, type OrderRequest } from "./api";

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

// ---------- Smart Ordering Function ----------

type SmartOrderParams = {
  productName: string;
  productReference?: string;
  productPrice?: string;
  phoneE164?: string;
};

export async function handleSmartOrder({
  productName,
  productReference,
  productPrice,
  phoneE164 = "+21629380898",
}: SmartOrderParams): Promise<void> {
  // Mobile: Open WhatsApp directly
  if (isMobileDevice()) {
    const message = `Bonjour 👋, je souhaite commander le produit suivant :\n\n${productName}\n${productReference ? `Référence: ${productReference}\n` : ""}${productPrice ? `Prix: ${productPrice}\n` : ""}\n\nMerci de me confirmer la disponibilité.`;
    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${phoneE164.replace(/\D/g, "")}?text=${encodedMsg}`;
    window.open(url, "_blank");
    return;
  }

  // Desktop: Show SweetAlert2 form
  const defaultSubject = `Bonjour, je voulais passer une commande pour le produit ${productName}`;

  const { value: formValues } = await Swal.fire({
    title: "Commander ce produit",
    html: `
      <div class="text-left space-y-4" style="text-align: left;">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Produit</label>
          <input 
            id="swal-product-name" 
            class="swal2-input" 
            value="${productName.replace(/"/g, "&quot;")}" 
            disabled
            style="background-color: #f3f4f6; cursor: not-allowed;"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Référence</label>
          <input 
            id="swal-product-reference" 
            class="swal2-input" 
            value="${productReference ? productReference.replace(/"/g, "&quot;") : "N/A"}" 
            disabled
            style="background-color: #f3f4f6; cursor: not-allowed;"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email <span style="color: red;">*</span></label>
          <input 
            id="swal-email" 
            class="swal2-input" 
            type="email" 
            placeholder="votre.email@example.com"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone <span style="color: red;">*</span></label>
          <input 
            id="swal-phone" 
            class="swal2-input" 
            type="tel" 
            placeholder="XX XXX XXX"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
          <input 
            id="swal-subject" 
            class="swal2-input" 
            value="${defaultSubject.replace(/"/g, "&quot;")}"
          />
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Envoyer la commande",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#009090",
    cancelButtonColor: "#6b7280",
    width: "600px",
    preConfirm: () => {
      const email = (document.getElementById("swal-email") as HTMLInputElement)?.value;
      const phone = (document.getElementById("swal-phone") as HTMLInputElement)?.value;
      const subject = (document.getElementById("swal-subject") as HTMLInputElement)?.value || defaultSubject;

      if (!email) {
        Swal.showValidationMessage("L'email est obligatoire");
        return false;
      }

      if (!phone) {
        Swal.showValidationMessage("Le téléphone est obligatoire");
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.showValidationMessage("Format d'email invalide");
        return false;
      }

      return {
        email,
        phone,
        subject,
      };
    },
  });

  if (!formValues) {
    return; // User cancelled
  }

  // Show loading
  Swal.fire({
    title: "Envoi en cours...",
    text: "Veuillez patienter",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const orderData: OrderRequest = {
      email: formValues.email,
      phone: formValues.phone,
      product_name: productName,
      product_reference: productReference || undefined,
      subject: formValues.subject,
    };

    const response = await sendOrderEmail(orderData);

    if (response.success) {
      await Swal.fire({
        icon: "success",
        title: "Commande envoyée !",
        text: "Votre commande a été envoyée avec succès. Notre équipe vous contactera rapidement.",
        confirmButtonColor: "#009090",
      });
    } else {
      throw new Error(response.error || "Erreur lors de l'envoi de la commande");
    }
  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Erreur",
      text: error?.message || "Une erreur est survenue lors de l'envoi de votre commande. Veuillez réessayer.",
      confirmButtonColor: "#dc2626",
    });
  }
}


