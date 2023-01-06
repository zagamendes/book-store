import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../contextos/LoginContext";
import { useMiniCart } from "../../contextos/MiniCartContext";

// import { Container } from './styles';

const Header: React.FC = () => {
  const { setIsMiniCartOpen, products } = useMiniCart();
  const { setShow, show } = useLogin();
  return (
    <nav
      className="navbar navbar-expand-md text-white px-5 d-flex justify-content-between sticky-top "
      onClick={() => {
        if (show) setShow(false);
      }}
    >
      <Link className="navbar-brand font-weight-bolder" to="/">
        Livraria do Izaac
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse " id="collapsibleNavbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link font-weight-bolder" to="/aventura">
              Aventura
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link font-weight-bolder" to="/drama">
              Drama
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link font-weight-bolder" to="/fantasia">
              Fantasia
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link font-weight-bolder" to="/infantil">
              Infantil
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link font-weight-bolder" to="/romance">
              Romance
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link font-weight-bolder" to="/terror">
              Terror
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <button
          style={{ background: "transparent", color: "white" }}
          className="border-0"
          onClick={() => setShow(!show)}
        >
          <i className="fas fa-user-alt" />
        </button>
        <button
          style={{
            background: "transparent",
            color: "white",
            position: "relative",
          }}
          className="border-0"
          data-bs-toggle="offcanvas"
          data-bs-target="#minicart"
          onClick={() => {
            setIsMiniCartOpen(true);
            if (show) setShow(!show);
          }}
        >
          <i className="fas fa-shopping-cart" />
          {products.length > 0 && (
            <span
              className="rounded-circle d-flex-align-items-center font-weight-bolder"
              style={{
                position: "absolute",
                width: "25px",
                height: "25px",
                top: "-12px",
                left: "19px",
                background: "var(--my-yellow)",
                color: "var(--my-purple)",
              }}
            >
              {products.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;
