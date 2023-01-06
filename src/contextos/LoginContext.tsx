import React, { createContext, useContext, useState } from "react";

// import { Container } from './styles';
interface LoginContextProps {
  show: boolean;
  setShow: (_: boolean) => void;
}
const loginContext = createContext({} as LoginContextProps);
const LoginProvider: React.FC<any> = ({ children }) => {
  const [show, setShow] = useState(false);
  return (
    <loginContext.Provider value={{ show, setShow }}>
      {children}
    </loginContext.Provider>
  );
};
export const useLogin = () => useContext(loginContext);
export default LoginProvider;
