import React from "react";
import { Link } from "react-router-dom";
import { useMiniCart } from "../../contextos/MiniCartContext";
import { precoFormatado } from "../../utils/formataPreco";
import "./index.css";
// import { Container } from './styles';

const Shelf: React.FC<any> = ({ book: { foto, nome, preco, slug, id } }) => {
  const { addToCart } = useMiniCart();
  const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  return (
    <div className="shelf-container">
      <Link to={`/${slug}/p`}>
        <div className="shelf-container-img">
          <img src={foto} alt={nome} className="img-fluid" />
        </div>
      </Link>
      <div className="ctn-nome text-center my-2">
        <p className="font-weight-bold">{nome}</p>
      </div>
      <div className="ctn-preco text-center">
        <p>{precoFormatado(preco)}</p>
      </div>
      <div>
        <button
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
            addToCart({
              id: id,
              nome: nome,
              preco: preco,
              foto: foto,
              quantidade: 0,
            });
            const btn = e.currentTarget;

            btn.innerHTML =
              "<span class='spinner-border spinner-border-sm'></span>";
            await sleep(500);
            btn.innerHTML = "Adicionado";
            await sleep(200);

            btn.innerHTML =
              "Adicionar ao carrinho <i class='fas fa-shopping-cart' />";
          }}
          className="btn btn-ver-produto bg-purple text-white w-100 font-weight-bolder"
        >
          Adicionar ao carrinho <i className="fas fa-shopping-cart" />
        </button>
      </div>
    </div>
  );
};

export default Shelf;
