import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // On app load, check if user is already logged in via cookie
  useEffect(() => {
    api.get("/auth/user")
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

 const login = (userData) => setUser(userData);
 const logout = () => {
  return api.post("/auth/logout").finally(() => setUser(null));
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);