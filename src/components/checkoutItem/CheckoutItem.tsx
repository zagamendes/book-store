import React from "react";
import { Product, useMiniCart } from "../../contextos/MiniCartContext";
import Step from "../Step/Step";
import "./index.css";

// import { Container } from './styles';
interface cartItemProps {
  product: Product;
  checkout?: boolean;
}
const CheckoutItem: React.FC<cartItemProps> = ({
  product,
  checkout = false,
}) => {
  const { removeProduct } = useMiniCart();
  console.log("aa", product);

  return (
    <div
      className="d-flex mb-3"
      style={{ columnGap: "20px", minWidth: "400px" }}
    >
      <img
        src={product.foto}
        alt="imagem"
        style={{
          width: "250px",
          height: "250px",
          objectFit: "cover",
          padding: "10px",
          background: "var(--my-yellow)",
        }}
      />
      <div
        className="d-flex flex-column checkout-ctn-info-product"
        style={{ rowGap: "15px" }}
      >
        <div className="">
          <h3 className="m-0 text-capitalize minicart-nome-do-produto checkout">
            <strong>{product.nome}</strong>
          </h3>
          <p className="d-flex" style={{ columnGap: "10px" }}>
            <p>
              {product.quantidade}{" "}
              {product.quantidade == 1 ? "Unidade de" : "Unidades de"}
            </p>
            {new Intl.NumberFormat("pt-BR", {
              currency: "brl",
              style: "currency",
            }).format(product.preco)}
          </p>
          {checkout && (
            <div
              className="d-flex align-items-center"
              style={{ maxWidth: "250px", columnGap: "20px" }}
            >
              Quantidade
              <Step key={product.id} product={product} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
