import apiClient from './apiClient';

const nomineeService = {
  /**
   * Fetches all nominees for the currently logged-in user.
   * @returns {Promise<Array>} A list of the user's nominees.
   */
  getNominees: async () => {
    try {
      const response = await apiClient.get('/user/nominees');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch nominees:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to fetch nominees");
    }
  },

  /**
   * Adds a new nominee for the currently logged-in user.
   * @param {object} nomineeData - { nominee_name, user_relationship }
   * @returns {Promise<object>} The newly created nominee data.
   */
  addNominee: async (nomineeData) => {
    try {
      const response = await apiClient.post('/user/nominees', nomineeData);
      return response.data;
    } catch (error) {
      console.error("Failed to add nominee:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to add nominee");
    }
  },
  
  /**
   * Deletes a nominee by their ID.
   * @param {number} nomineeId - The ID of the nominee to delete.
   * @returns {Promise<object>} The success message from the API.
   */
  deleteNominee: async (nomineeId) => {
    try {
      const response = await apiClient.delete(`/user/nominees/${nomineeId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete nominee:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to delete nominee");
    }
  },
};

export default nomineeService;