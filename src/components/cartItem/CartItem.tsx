import React from "react";
import { ProductMiniCart, useMiniCart } from "../../contextos/MiniCartContext";
import Step from "../Step/Step";

// import { Container } from './styles';
interface cartItemProps {
  product: ProductMiniCart;
}
const CartItem: React.FC<cartItemProps> = ({ product }) => {
  const { removeProduct } = useMiniCart();
  return (
    <div className="d-flex mb-3" style={{ columnGap: "20px" }}>
      <img
        src={product.foto}
        alt="imagem"
        style={{ width: "150px", height: "80px", objectFit: "cover" }}
      />
      <div className="d-flex flex-column" style={{ rowGap: "15px" }}>
        <div className="d-flex justify-content-between align-items-center">
          <p className="m-0 minicart-nome-do-produto">
            <strong>{product.nome}</strong>
          </p>
          <button
            className="minicart-btn-remover border-0"
            onClick={() => {
              removeProduct(product.id);
            }}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
        <div className="d-flex">
          <p className="minicart-preco">
            {new Intl.NumberFormat("pt-BR", {
              currency: "brl",
              style: "currency",
            }).format(product.preco)}
          </p>
          <Step product={product} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
