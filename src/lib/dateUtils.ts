/**
 * Robust date formatting utility
 * Handles various date formats: ISO strings, MySQL DATETIME, and invalid dates
 */

export function formatArticleDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Date inconnue";
  }

  try {
    // Clean and normalize the date string
    let cleanDate = String(dateString).trim();
    
    // Handle empty strings
    if (!cleanDate || cleanDate === "null" || cleanDate === "undefined") {
      return "Date inconnue";
    }

    // Handle MySQL DATETIME format (YYYY-MM-DD HH:MM:SS) or DATE format (YYYY-MM-DD)
    // Convert to ISO format for reliable parsing
    if (cleanDate.includes(" ")) {
      // MySQL DATETIME: replace space with T and add Z if no timezone
      cleanDate = cleanDate.replace(" ", "T");
      if (!cleanDate.includes("Z") && !cleanDate.includes("+") && !cleanDate.includes("-", 10)) {
        cleanDate += "Z";
      }
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      // MySQL DATE format: add time and timezone
      cleanDate = cleanDate + "T00:00:00Z";
    }

    // Parse the date
    const date = new Date(cleanDate);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
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

