import React, { useRef } from "react";

import { ProductMiniCart, useMiniCart } from "../../contextos/MiniCartContext";
import "./index.css";
interface stepProps {
  product?: ProductMiniCart;
}
const Step: React.FC<stepProps> = ({ product }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    setQuantity,
    isMiniCartOpen,
    descreaseQuantity,
    quantity,
    addToCart,
  } = useMiniCart();

  return (
    <div className="ctn-step d-flex">
      <div className="step-ctn-minus">
        <button
          onClick={() => {
            if (
              isMiniCartOpen ||
              window.location.pathname.includes("checkout")
            ) {
              inputRef.current?.stepDown();

              descreaseQuantity(product as ProductMiniCart);
            } else {
              inputRef.current?.stepDown();
              setQuantity(parseInt(inputRef.current?.value as string));
            }
          }}
        >
          -
        </button>
      </div>
      <div>
        <input
          type="number"
          className="form-control"
          step={1}
          min={1}
          value={
            isMiniCartOpen
              ? product?.quantidade
              : window.location.pathname.includes("checkout")
              ? product?.quantidade
              : quantity
          }
          ref={inputRef}
          onChange={() => null}
        />
      </div>
      <div className="step-ctn-plus">
        <button
          onClick={() => {
            if (
              isMiniCartOpen ||
              window.location.pathname.includes("checkout")
            ) {
              inputRef.current?.stepUp();

              addToCart(product as ProductMiniCart);
            } else {
              inputRef.current?.stepUp();
              setQuantity(parseInt(inputRef.current?.value as string));
            }
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Step;
