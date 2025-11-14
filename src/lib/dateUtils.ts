/**
 * Robust date formatting utility
 * Handles various date formats: ISO strings, MySQL DATETIME, and invalid dates
 */

export function formatArticleDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Date inconnue";
  }

  try {
    // Try parsing the date
    let date: Date;
    
    // Handle ISO strings and MySQL DATETIME formats
    if (typeof dateString === "string") {
      // Replace space with 'T' for ISO format if needed (MySQL DATETIME format)
      const normalizedDate = dateString.includes("T") 
        ? dateString 
        : dateString.replace(" ", "T");
      
      date = new Date(normalizedDate);
    } else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Date inconnue";
    }

    // Format as DD MMMM YYYY (French format)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "Date inconnue";
  }
}

export function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) {
    return "—";
  }

  try {
    const normalizedDate = typeof dateString === "string" && !dateString.includes("T")
      ? dateString.replace(" ", "T")
      : dateString;
    
    const date = new Date(normalizedDate);
    
    if (isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return "—";
  }
}

