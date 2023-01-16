import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Container } from './styles';
import StarsRating from "stars-rating";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import app from "../utils/firebaseConfig";
import Step from "../components/Step/Step";

import "react-loading-skeleton/dist/skeleton.css";
import { ProductMiniCart, useMiniCart } from "../contextos/MiniCartContext";
import PdpLoading from "../components/PdpLoading/PdpLoading";
import { precoFormatado } from "../utils/formataPreco";
import "../index.css";
import axios from "axios";
import { CorreiosResponse } from "../@types/correios";
import { Product } from "../@types/product";

const PDP: React.FC = () => {
  const { slug } = useParams();
  const { addToCart, quantity, setQuantity } = useMiniCart();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [shippingOptions, setShippingOptions] = useState<CorreiosResponse[]>(
    []
  );

  const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  const [produto, setProduto] = useState<Product>({} as Product);
  const db = getFirestore(app);
  const q = query(collection(db, "produtos"), where("slug", "==", slug));
  const getProduct = async () => {
    const dataSnapshot = await getDocs(q);

    const product = dataSnapshot.docs.map((product) => {
      return {
        id: product.id,
        ...product.data(),
      };
    });
    setProduto(product[0] as Product);
  };
  const getSkus = () => {};
  useEffect(() => {
    getProduct();
    setQuantity(1);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cep = new FormData(e.target as HTMLFormElement).get("cep");
    if (btnRef.current) {
      btnRef.current.innerHTML =
        "Calculando frete <span class='spinner-border spinner-border-sm'></span>";
      btnRef.current.disabled = true;
      const { data } = await axios(
        `http://127.0.0.1:5001/bookstore-15b7a/us-central1/api/calcularFrete/${cep}`
      );
      btnRef.current.innerHTML =
        "Calcular frete <i class='fas fa-calculator' />";
      btnRef.current.disabled = false;
      setShippingOptions(data);
    }
  };

  if (!produto.id) return <PdpLoading />;
  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-body">
          <div className="row">
            <div className="d-flex justify-content-center col-sm-12 col-lg-6">
              <img
                src={"produto.foto"}
                className="img-fluid"
                style={{ maxHeight: "500px" }}
                alt={produto.nome}
              />
            </div>
            <div
              className="col-sm-12 col-lg-6 d-flex flex-column"
              style={{ rowGap: "10px" }}
            >
              <div>
                <h1 className="text-capitalize m-0">{produto.nome}</h1>
              </div>
              <div>
                <h2 className="m-0">{precoFormatado(produto.preco)}</h2>
              </div>
              <div>
                <StarsRating
                  value={5}
                  edit={false}
                  count={5}
                  size={24}
                  color2={"#ffd700"}
                />
              </div>
              <div className="pdp-container-descricao">
                <p className="m-0">{produto.descricao}</p>
              </div>
              <div className="d-flex pdp-ctn-step-add-to-cart align-items-start">
                <Step
                  product={{
                    foto: "",
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: quantity,
                  }}
                />
              </div>
              <div>
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  className="d-flex align-items-start"
                >
                  <input
                    type={"tel"}
                    required
                    name="cep"
                    maxLength={8}
                    minLength={8}
                    className="form-control"
                    placeholder="somente números"
                  />
                  <button
                    ref={btnRef}
                    className="btn btn-outline-primary w-100 align-items-start font-weight-bolder"
                  >
                    Calcular frete <i className="fas fa-calculator	" />
                  </button>
                </form>
              </div>
              {shippingOptions.length != 0 && (
                <div>
                  <p>
                    <strong>Formas de entrega</strong>
                  </p>
                  {shippingOptions.map((shippingOption, i) => {
                    return (
                      <p key={shippingOption.Codigo}>
                        {shippingOption.PrazoEntrega === "1"
                          ? `${i === 0 ? "SEDEX" : "PAC"} - 1 dia útil R$ ${
                              shippingOption.ValorSemAdicionais
                            }`
                          : `${i === 0 ? "SEDEX" : "PAC"} - ${
                              shippingOption.PrazoEntrega
                            } dias úteis R$ ${
                              shippingOption.ValorSemAdicionais
                            }`}
                      </p>
                    );
                  })}
                </div>
              )}
              <div>
                <button
                  onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                    addToCart({
                      id: produto.id as string,
                      nome: produto.nome,
                      preco: produto.preco,
                      foto: "",
                      quantidade: quantity,
                    });
                    const btn = e.currentTarget;

                    btn.innerHTML =
                      "<span class='spinner-border spinner-border-sm'></span>";
                    await sleep(500);

                    btn.innerHTML =
                      "Adicionar ao carrinho <i class='fas fa-shopping-cart' />";
                  }}
                  className="btn btn-ver-produto bg-purple font-weight-bolder text-white w-100"
                >
                  Adicionar ao carrinho <i className="fas fa-shopping-cart" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDP;
