import React, { useEffect } from "react";

import CheckoutItem from "../components/checkoutItem/CheckoutItem";
import { useMiniCart } from "../contextos/MiniCartContext";

const OrderPlaced: React.FC = () => {
  useEffect(() => {
    return () => cleanCart();
  }, []);
  const { products, cleanCart } = useMiniCart();

  return (
    <div className="container">
      <div
        className="d-flex flex-column align-items-center mt-5"
        style={{ fontSize: "80px", color: "var(--my-green)" }}
      >
        <i className="far fa-check-circle" />
        <h1 className="text-center mb-2">Obrigado por sua compra!</h1>
        <h3 className="text-center mb-5" style={{ color: "var(--my-green)" }}>
          Confira os itens do seu pedido.
        </h3>
      </div>

      {products.map((product) => {
        return <CheckoutItem product={product} />;
      })}
    </div>
  );
};

export default OrderPlaced;
