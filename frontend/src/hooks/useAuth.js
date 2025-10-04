import useAppStore from '../state/appStore';

/**
 * A custom hook to access authentication state and actions.
 * @returns {{
 * user: object | null,
 * isAuthenticated: boolean,
 * token: string | null,
 * login: (userData, token) => void,
 * logout: () => void
 * }}
 */
const useAuth = () => {
  const { user, isAuthenticated, token, login, logout } = useAppStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    login: state.login,
    logout: state.logout,
  }));

  return { user, isAuthenticated, token, login, logout };
};

export default useAuth;