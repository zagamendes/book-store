import React, { useState, useRef } from "react";

import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";

import { db, storage } from "../utils/firebaseConfig";
import { Button, Form, Modal } from "react-bootstrap";
import { Product } from "../@types/product";
import Categoria from "./Categoria";
import { SKU } from "../@types/sku";
import { useNavigate } from "react-router-dom";

function FormularioCadastroProduto() {
  const [showModal, setShowModal] = useState(false);
  const Navigate = useNavigate();
  const btn = useRef<HTMLButtonElement>(null);

  const [idProduto, setIdProduto] = useState("");

  const handleProduct = async (e: any) => {
    try {
      e.preventDefault();
      const form = new FormData(e.target);
      const data: Product = {
        nome: form.get("nome") as string,
        categorias: (form.get("categorias") as string)?.split(","),
        descricao: form.get("descricao") as string,
        peso: parseFloat(form.get("peso") as string),
        preco: parseFloat(form.get("preco") as string),
        termosParaBusca: (form.get("termosParaBusca") as string)?.split(","),
      };
      if (btn.current) {
        btn.current.disabled = true;
        btn.current.innerHTML =
          "<span class='spinner-border spinner-border-sm'></span> Cadastrando produto";
        const idProduto = await (
          await addDoc(collection(db, "produtos"), data)
        ).id;
        setIdProduto(idProduto);

        const arrayPromises = data.categorias.map((categoria) => {
          setDoc(doc(db, `${categoria}/${idProduto}`), data);
        });

        await Promise.all(arrayPromises);
        btn.current.innerHTML =
          "<span class='fas fa-plus'></span> Adicionar produto";
        btn.current.disabled = false;
        setShowModal(true);
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div
      className="container d-flex flex-column"
      style={{ background: "var(--my-yellow)" }}
    >
      <ToastContainer />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deseja adicionar os SKUs agora?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              Navigate(`/admin/sku/${idProduto}`);
            }}
          >
            Sim
          </Button>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Não
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="card shadow mx-auto" style={{ maxWidth: "800px" }}>
        <h1 style={{ color: "#51a3a3" }} className="text-center">
          Cadastro de produto
        </h1>

        <div className="card-body">
          <form onSubmit={handleProduct}>
            <div className="row switch-mobile">
              <div className="col-sm-12 mb-2">
                <div className="form-group">
                  <label htmlFor="nome">Nome do produto</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Ex: Camiseta vingadores"
                    name="nome"
                    id="nome"
                    data-campo-produto={true}
                  />
                </div>
              </div>

              <div className="col-sm-6  mb-2">
                <div className="form-group">
                  <label htmlFor="termos" className="d-flex flex-column">
                    Termos para busca {"(separe por vírgulas)"}
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Ex: camiseta,camisa"
                    name="termosParaBusca"
                    id="termos"
                    data-campo-produto={true}
                  />
                </div>
              </div>

              <div className="col-sm-6  mb-2">
                <div className="form-group">
                  <label>Preço {"(Use ponto ao invés de vírgula)"}</label>

                  <input
                    required
                    type={"tel"}
                    name="preco"
                    placeholder="Ex: 22.50"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-sm-6  mb-2">
                <div className="form-group">
                  <label>
                    Categorias {"(separe as categorias por vírgulas)"}
                  </label>
                  <input
                    type={"text"}
                    className="form-control"
                    data-campo-produto={true}
                    placeholder={"Ex: feminino,praia"}
                    name={"categorias"}
                  />
                </div>
              </div>

              <div className="col-sm-6  mb-2">
                <div className="form-group">
                  <label>Peso em KG</label>
                  <input
                    type={"tel"}
                    placeholder="Ex: 1.5"
                    className="form-control"
                    name="peso"
                  />
                </div>
              </div>

              <div className="col-sm-12">
                <div className="form-group">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    required
                    placeholder="Ex: Camiseta 100% algodão"
                    className="form-control"
                    data-campo-produto={true}
                    rows={4}
                    name="descricao"
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="col-sm-12 mt-3">
                  <button
                    className="btn btn-success w-100 font-weight-bolder"
                    type="submit"
                    ref={btn}
                    style={{ background: "var(--my-purple)" }}
                  >
                    <i className="fas fa-plus" /> Adicionar produto
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioCadastroProduto;
