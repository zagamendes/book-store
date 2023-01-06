/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import { useMiniCart } from "../../contextos/MiniCartContext";
import { precoFormatado } from "../../utils/formataPreco";
import CartItem from "../cartItem/CartItem";

import "./index.css";
import { getAuth } from "firebase/auth";
import app from "../../utils/firebaseConfig";
import MyModal from "../modal/Modal";
import FirebaseUI from "../firebaseUI/FirebaseUI";

import { useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";

const MiniCart: React.FC = () => {
  const { getProducts, isMiniCartOpen, setIsMiniCartOpen } = useMiniCart();
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const auth = getAuth(app);

  useEffect(() => {
    const myOffcanvas = document.getElementById("minicart");

    myOffcanvas?.addEventListener("hide.bs.offcanvas", handleCanvas);
    return () =>
      myOffcanvas?.removeEventListener("hide.bs.offcanvas", handleCanvas);
  }, [isMiniCartOpen]);

  const total = getProducts().reduce((prev, product) => {
    return prev + product.quantidade * product.preco;
  }, 0);
  const auxProducts = getProducts();

  const handleCanvas = () => setIsMiniCartOpen(false);
  const goToStripe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/checkout/cart");

    setIsMiniCartOpen(!isMiniCartOpen);
  };

  return (
    <Offcanvas show={isMiniCartOpen} onHide={setIsMiniCartOpen} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Seu carrinho</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <MyModal show={showModal} handleClose={handleClose}>
          <FirebaseUI />
        </MyModal>
        <div className="minicart-ctn-items">
          {auxProducts.map((product) => {
            return <CartItem product={product} key={product.id} />;
          })}
        </div>
        {auxProducts.length !== 0 && (
          <div>
            <p className="text-right">
              <strong>Total {precoFormatado(total)}</strong>
            </p>
            <button
              className="btn btn-ver-produto bg-purple text-white font-weight-bolder w-100"
              onClick={(e) => goToStripe(e)}
            >
              Finalizar compra
            </button>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MiniCart;
