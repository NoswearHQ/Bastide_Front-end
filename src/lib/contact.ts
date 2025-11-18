// Device detection and contact redirection utilities
import { toast } from "sonner";
import Swal from "sweetalert2";
import { sendOrderEmail, type OrderRequest, trackProductOrder } from "./api";

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
  productId?: number | string; // Optional product ID for better tracking
};

/**
 * Generate a unique fingerprint for duplicate detection
 * Uses sessionStorage to prevent duplicate tracking on page refresh
 */
function generateOrderFingerprint(productId: string | number | undefined, productName: string, orderType: "mail" | "whatsapp"): string {
  const timestamp = Date.now();
  const sessionKey = `order_${orderType}_${productId || productName}_${timestamp}`;
  
  // Check if we already tracked this order in this session
  const existingFingerprint = sessionStorage.getItem(sessionKey);
  if (existingFingerprint) {
    return existingFingerprint;
  }
  
  // Generate new fingerprint
  const fingerprint = `${orderType}_${productId || productName}_${timestamp}_${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem(sessionKey, fingerprint);
  
  // Clean up old sessionStorage entries (keep last 10)
  try {
    const keys = Object.keys(sessionStorage).filter(k => k.startsWith(`order_${orderType}_`));
    if (keys.length > 10) {
      keys.slice(0, keys.length - 10).forEach(k => sessionStorage.removeItem(k));
    }
  } catch (e) {
    // Ignore sessionStorage errors
  }
  
  return fingerprint;
}

/**
 * Track WhatsApp order (non-blocking, fire-and-forget)
 */
async function trackWhatsAppOrder(params: {
  productId?: number | string;
  productReference?: string;
  productName: string;
  productPrice?: string;
}): Promise<void> {
  try {
    const fingerprint = generateOrderFingerprint(params.productId, params.productName, "whatsapp");
    
    // Track the WhatsApp click - we don't have phone/email since user will provide it in WhatsApp
    await trackProductOrder({
      product_id: params.productId ? String(params.productId) : null,
      product_reference: params.productReference || null,
      product_title: params.productName,
      customer_email: null, // WhatsApp orders don't have email
      customer_phone: "", // Backend will use placeholder "WhatsApp" for tracking
      order_type: "whatsapp",
      fingerprint,
    });
    
    console.log("WhatsApp order click tracked:", {
      productName: params.productName,
      productId: params.productId,
    });
  } catch (error) {
    // Log error but don't block - tracking should never block the user flow
    console.error("Failed to track WhatsApp order:", error);
  }
}

export async function handleSmartOrder({
  productName,
  productReference,
  productPrice,
  phoneE164 = "+21629380898",
  productId,
}: SmartOrderParams): Promise<void> {
  // Mobile: Open WhatsApp directly
  if (isMobileDevice()) {
    const message = `Bonjour 👋, je souhaite commander le produit suivant :\n\n${productName}\n${productReference ? `Référence: ${productReference}\n` : ""}${productPrice ? `Prix: ${productPrice}\n` : ""}\n\nMerci de me confirmer la disponibilité.`;
    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${phoneE164.replace(/\D/g, "")}?text=${encodedMsg}`;
    
    // Track WhatsApp click BEFORE opening WhatsApp (non-blocking, fire-and-forget)
    // This tracks the click/redirect, not the actual order (which happens in WhatsApp)
    trackWhatsAppOrder({
      productId,
      productReference,
      productName,
      productPrice,
    }).catch((error) => {
      // Log error but don't block - tracking failures should never prevent WhatsApp from opening
      console.warn("WhatsApp tracking failed (non-critical):", error);
    });
    
    // Open WhatsApp immediately (don't wait for tracking)
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
      product_id: productId, // Pass product ID for better tracking
      subject: formValues.subject,
    };

    const response = await sendOrderEmail(orderData);

    // CRITICAL: Only show success if backend explicitly returns success: true
    if (response.success === true) {
      // Email order tracking is handled automatically by the backend after successful email send
      // No need to track here - the OrderController handles it
      
      await Swal.fire({
        icon: "success",
        title: "Commande envoyée !",
        text: "Votre commande a été envoyée avec succès. Notre équipe vous contactera rapidement.",
        confirmButtonColor: "#009090",
      });
    } else {
      // Backend returned success: false, show error
      const errorMsg = response.error || "Erreur lors de l'envoi de la commande";
      await Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMsg,
        confirmButtonColor: "#dc2626",
      });
    }
  } catch (error: any) {
    // Network error or other exception
    console.error("Order email error:", error);
    const errorMessage = error?.message || "Erreur serveur: impossible d'envoyer la commande.";
    await Swal.fire({
      icon: "error",
      title: "Erreur",
      text: errorMessage,
      confirmButtonColor: "#dc2626",
    });
  }
}


