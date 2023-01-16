import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../@types/product";
import { SKU } from "../../@types/sku";
import { useMiniCart } from "../../contextos/MiniCartContext";
import { db } from "../../utils/firebaseConfig";
import { precoFormatado } from "../../utils/formataPreco";
import "./index.css";
// import { Container } from './styles';

const Shelf: React.FC<Product> = ({ nome, preco, id, slug }) => {
  const { addToCart } = useMiniCart();
  const [skus, setSkus] = useState<SKU[]>([]);
  const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  const getSkus = async () => {
    console.log(id);

    const dataSnapshot = await getDocs(collection(db, `produtos/${id}/skus`));
    const skusdb = dataSnapshot.docs.map((sku) => {
      return { id: sku.id, ...sku.data() };
    });
    setSkus(skusdb as SKU[]);
  };
  useLayoutEffect(() => {
    getSkus();
  }, []);
  console.log(skus);

  if (skus.length == 0) return null;
  return (
    <div className="shelf-container">
      <Link to={`/${slug}/p`}>
        <div className="shelf-container-img">
          <img src={skus[0].fotos[0] ?? ""} alt={nome} className="img-fluid" />
        </div>
      </Link>
      <div className="d-flex">
        {skus.map((sku) => {
          return (
            <img src={sku.fotos[0]} style={{ width: "60px", height: "60px" }} />
          );
        })}
      </div>

      <div className="ctn-nome text-center my-2">
        <p className="font-weight-bold">
          {nome} - {skus[0].cor}
        </p>
      </div>
      <div className="ctn-preco text-center">
        <p>{precoFormatado(preco)}</p>
      </div>

      <div>
        <button
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
            addToCart({
              id: id as string,
              nome: nome,
              preco: preco,
              foto: skus[0].fotos[0],
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
