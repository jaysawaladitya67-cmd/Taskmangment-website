import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = { email: "admin@1", password: "2925" };
const USER_CREDENTIALS = { email: "aditya@22", password: "12341234" };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

 const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    const userInfo = { email: data.user.email, role: "user" as const, token: data.token };

    setUser(userInfo);
    localStorage.setItem("currentUser", JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

const register = async (email: string, password: string, name: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name, email, password }),
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Register error:", error);
    return false;
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};