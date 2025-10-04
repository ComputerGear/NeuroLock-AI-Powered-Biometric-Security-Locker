import apiClient from './apiClient';

const adminService = {
  /**
   * Logs in an admin user.
   * @param {object} credentials - { username, password }
   * @returns {Promise<object>} The API response with the token.
   */
  login: async (credentials) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await apiClient.post('/admin/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error("Admin login failed:", error.response?.data || error.message);
      throw error.response?.data || new Error("Admin login failed");
    }
  },

  /**
   * Fetches all user applications with 'PENDING_APPROVAL' status.
   * @returns {Promise<Array>} A list of pending user applications.
   */
  getPendingRequests: async () => {
    try {
      const response = await apiClient.get('/admin/pending-requests');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch pending requests:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to fetch pending requests");
    }
  },
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },

  getAccessLogs: async () => {
    try {
      const response = await apiClient.get('/admin/access-logs');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch access logs:", error);
      throw error;
    }
  },

  /**
   * Approves a user's application.
   * @param {number} userId - The ID of the user to approve.
   * @returns {Promise<object>} The updated user data.
   */
  approveRequest: async (userId) => {
    try {
      const response = await apiClient.put(`/admin/approve/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to approve request:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to approve request");
    }
  },
};

export default adminService;