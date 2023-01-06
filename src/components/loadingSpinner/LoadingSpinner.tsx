import React from "react";

// import { Container } from './styles';

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{ minWidth: "100%", height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="spinner-border text-warning"></div>
    </div>
  );
};

export default LoadingSpinner;
