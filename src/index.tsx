import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./screens/FormularioCadastroProduto";
import Home from "./screens/Home";
import Header from "./components/header/Header";
import PDP from "./screens/Pdp";
import Categoria from "./screens/Categoria";
import MiniCart from "./components/miniCart/MiniCart";
import MiniCartProvider from "./contextos/MiniCartContext";

import "./index.css";
import Checkout from "./screens/Checkout";

import Flex from "./screens/Flex";
import Footer from "./components/footer/Footer";
import User from "./components/user/User";
import LoginProvider from "./contextos/LoginContext";
import OrderPlaced from "./screens/OrderPlaced";
import AuthProvider from "./contextos/AuthContext";
import Cart from "./screens/Cart";
import SideBarAdmin from "./components/SideBarAdmin/SideBarAdmin";
import FormularioCadastroProduto from "./screens/FormularioCadastroProduto";
import FormularioCadastroSKU from "./screens/FormularioCadastroSKU";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AuthProvider>
    <MiniCartProvider>
      <LoginProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<SideBarAdmin />}>
              <Route path="produto" element={<FormularioCadastroProduto />}>
                <Route path=":id" element={<FormularioCadastroProduto />} />
              </Route>
              <Route path="sku/:id" element={<FormularioCadastroSKU />} />
            </Route>
          </Routes>
          {/* <Header />
          <User />
          <MiniCart /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:categoria" element={<Categoria />} />
            <Route path="/flex" element={<Flex />} />

            <Route path="/:slug/p" element={<PDP />} />
            <Route path="/orderPlaced" element={<OrderPlaced />} />
            <Route path="/checkout/cart" element={<Cart />} />
          </Routes>
        </Router>
        {/* <Footer /> */}
      </LoginProvider>
    </MiniCartProvider>
  </AuthProvider>
);
