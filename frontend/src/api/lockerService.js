import apiClient from './apiClient';

const lockerService = {
  /**
   * Sets the user's 6-digit locker PIN.
   * @param {string} pin - The 6-digit PIN.
   * @returns {Promise<object>} The success message from the API.
   */
  setPin: async (pin) => {
    try {
      const response = await apiClient.post('/locker/set-pin', { pin });
      return response.data;
    } catch (error) {
      console.error("Failed to set PIN:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to set PIN");
    }
  },

  /**
   * Unlocks the locker by sending PIN and OTP.
   * @param {object} credentials - { pin, otp }
   * @returns {Promise<object>} The success message from the API.
   */
  unlock: async (credentials) => {
    try {
      const response = await apiClient.post('/locker/unlock', credentials);
      return response.data;
    } catch (error) {
      console.error("Unlock failed:", error.response?.data || error.message);
      throw error.response?.data || new Error("Unlock failed");
    }
  },
};

export default lockerService;