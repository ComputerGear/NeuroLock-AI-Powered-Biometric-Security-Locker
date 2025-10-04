/**
 * A collection of utility functions for formatting data.
 */
export const formatters = {
  /**
   * Formats an ISO date string into a more readable local format.
   * @param {string} isoString - The date string from the database (e.g., "2025-09-06T14:21:01.123Z").
   * @returns {string} A formatted date and time (e.g., "9/6/2025, 7:51:01 PM").
   */
  formatDate: (isoString) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString();
    } catch (error) {
      console.error("Failed to format date:", error);
      return 'Invalid Date';
    }
  },

  /**
   * Formats a number into a currency string.
   * @param {number} amount - The amount in the base unit (e.g., 5000).
   * @param {string} currency - The currency code (e.g., 'INR').
   * @returns {string} A formatted currency string (e.g., "₹5,000.00").
   */
  formatCurrency: (amount, currency = 'INR') => {
    if (typeof amount !== 'number') return 'N/A';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    });

    return formatter.format(amount);
  },
};

/**
 * Example Usage in a component:
 * * import { formatters } from '../utils/formatters';
 * * const MyComponent = ({ log }) => {
 * return <td>{formatters.formatDate(log.access_time)}</td>
 * }
 */