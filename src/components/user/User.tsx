import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useLogin } from "../../contextos/LoginContext";
import app from "../../utils/firebaseConfig";
import FirebaseUI from "../firebaseUI/FirebaseUI";
import MyModal from "../modal/Modal";

// import { Container } from './styles';

const User: React.FC = () => {
  const { show, setShow } = useLogin();

  if (!show) return null;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        zIndex: 99999,
      }}
      onClick={() => setShow(!show)}
    >
      <div
        style={{
          minWidth: "200px",
          right: "90px",

          padding: "15px",
          position: "absolute",
          background: "white",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            transform: "rotate(45deg)",
            background: "white",
            right: "8px",
            top: "-6px",
            position: "absolute",
          }}
        ></div>
        {getAuth(app).currentUser ? (
          <>
            <p>Minha Conta</p>
            <button onClick={() => signOut(getAuth(app))}>Sair</button>
          </>
        ) : (
          <>
            <p>Faça login usando sua conta de email google</p>
            <FirebaseUI />
          </>
        )}
      </div>
    </div>
  );
};

export default User;
