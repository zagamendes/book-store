import { getAuth, GoogleAuthProvider } from "firebase/auth";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import app from "../../utils/firebaseConfig";

// import { Container } from './styles';

const FirebaseUI: React.FC = () => {
  const auth = getAuth(app);
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  const uiConfig = {
    signInFlow: "popup",

    signInSuccessUrl: "/",

    signInOptions: [provider.providerId],
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
};

export default FirebaseUI;
