import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useContext, createContext, useState } from "react";
import { MyUser } from "../@types/user";
import { Auth, db } from "../utils/firebaseConfig";

interface AuthContextProps {
  user: MyUser | null;
  setUser: (_: MyUser | null) => void;
  isLoading: boolean;
  setIsLoading: (_: boolean) => void;
}

const authContext = createContext({} as AuthContextProps);
const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<MyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getUser = async (user: User | null) => {
    if (!user) {
      setIsLoading(false);
      setUser(null);
    }
    const snapshot = await getDoc(doc(db, `usuarios/${user?.uid}`));
    if (!snapshot.exists()) {
      setIsLoading(false);
      setUser({
        displayName: user?.displayName as string,
        email: user?.email as string,
        uid: user?.uid as string,
      });
      return;
    }
    const { cpf, enderecos, email, displayName } = snapshot.data();
    setUser({ cpf, displayName, enderecos, email, uid: snapshot.id });
    setIsLoading(false);
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(Auth, getUser);

    return () => unSubscribe();
  }, []);
  return (
    <authContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </authContext.Provider>
  );
};
export const useAuth = () => useContext(authContext);
export default AuthProvider;
