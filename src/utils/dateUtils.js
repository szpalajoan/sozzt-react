/**
 * Konwertuje datę do formatu ISO string
 * @param {string} dateString - Data w formacie string
 * @returns {string|null} - Data w formacie ISO string lub null jeśli data jest nieprawidłowa
 */
export const formatDateToInstant = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
}; 