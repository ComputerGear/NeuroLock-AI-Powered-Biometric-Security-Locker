import apiClient from './apiClient';

const authService = {
  /**
   * Logs in a user.
   * @param {object} credentials - { username, password }
   * @returns {Promise<object>} The response data from the API.
   */
  login: async (credentials) => {
    try {
      // The backend login route expects form data, so we create a URLSearchParams object.
      const formData = new URLSearchParams();
      formData.append('username', credentials.email); // Our login uses email as the username
      formData.append('password', credentials.password);

      const response = await apiClient.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error.response?.data || new Error("Login failed");
    }
  },

   // --- ADD THIS NEW FUNCTION ---
  sendOtp: async (phoneNumber) => {
    try {
      const response = await apiClient.post('/auth/send-otp', { phone_number: phoneNumber });
      return response.data;
    } catch (error) {
      console.error("Send OTP failed:", error.response?.data || error.message);
      throw error.response?.data || new Error("Send OTP failed");
    }
  },
  // --- END NEW FUNCTION ---

  // --- ADD THIS NEW FUNCTION ---
  verifyOtp: async (phoneNumber, otp) => {
    try {
      const response = await apiClient.post('/auth/verify-otp', { phone_number: phoneNumber, otp: otp });
      return response.data;
    } catch (error) {
      console.error("Verify OTP failed:", error.response?.data || error.message);
      throw error.response?.data || new Error("Verify OTP failed");
    }
  },
  // --- END NEW FUNCTION ---



  /**
   * Registers a new user.
   * @param {object} userData - The user's registration details.
   * @returns {Promise<object>} The newly created user data.
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error.response?.data || new Error("Registration failed");
    }
  },
};

export default authService;