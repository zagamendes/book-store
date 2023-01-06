import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";

import UsuarioRecorrente from "../components/usuarioRecorrente/UsuarioRecorrente";
import { useAuth } from "../contextos/AuthContext";

const Checkout: React.FC = () => {
  const { isLoading, user } = useAuth();
  const Navigate = useNavigate();
  useEffect(() => {
    if (!user && !isLoading) Navigate("/");
  }, []);
  return (
    <div className="container">
      {isLoading ? <LoadingSpinner /> : <UsuarioRecorrente />}
    </div>
  );
};

export default Checkout;
