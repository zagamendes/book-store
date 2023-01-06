import React from "react";

// import { Container } from './styles';

const Footer: React.FC = () => {
  return (
    <footer
      className="mt-5 d-flex flex-column align-items-center py-3"
      style={{ background: "var(--my-purple)", minHeight: "100px" }}
    >
      <h3
        className="text-center text-capitalize"
        style={{
          color: "var(--my-yellow)",
        }}
      >
        Acompanhe nosso instagram
      </h3>
      <div>
        <button
          className="border-0"
          style={{
            background: "transparent",
            color: "var(--my-yellow)",
            fontSize: "40px",
          }}
        >
          <i className="fab fa-instagram" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
