import React from "react";
import { Outlet } from "react-router-dom";

// import { Container } from './styles';

const SideBarAdmin: React.FC = () => {
  return (
    <div className="d-flex">
      <div
        className="px-3 bg-purple text-white"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <ul className="list-unstyled  mt-3">
          <li className="mb-3">
            <i className="	fas fa-dice-d6" /> Pedidos
          </li>
          <li className="mb-3">
            <i className="fas fa-users" /> Clientes
          </li>
          <li className="mb-3">
            <i className="fas fa-clone" /> Categorias
          </li>
          <li className="mb-3">
            <i className="fas fa-warehouse	" /> Produtos
          </li>
          <li className="mb-3">
            <i className="	fas fa-wrench" /> Configurações da loja
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default SideBarAdmin;
