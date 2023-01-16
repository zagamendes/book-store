import React, { useState, useRef, useEffect } from "react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";

import { db, storage } from "../utils/firebaseConfig";
import { Button, Modal } from "react-bootstrap";
import { Product } from "../@types/product";

import { useNavigate, useParams } from "react-router-dom";
import { SKU } from "../@types/sku";
import slugify from "slugify";

function FormularioCadastroProduto() {
  const [showModal, setShowModal] = useState(false);
  const [idProduto, setIdProduto] = useState("");
  const [produto, setProduto] = useState({} as Product);
  const [skus, setSkus] = useState<SKU[]>([]);
  const navigate = useNavigate();
  const btn = useRef<HTMLButtonElement>(null);
  const { id } = useParams();
  const getProduct = async () => {
    const snapshot = await await getDoc(doc(db, `produtos/${id}`));
    setProduto({ id: snapshot.id, ...(snapshot.data() as Product) });
    await getSkus();
  };
  const getSkus = async () => {
    const snapshot = await getDocs(
      query(collection(db, `produtos/${id}/skus`))
    );
    if (!snapshot.empty) {
      const skusdb = snapshot.docs.map(
        (sku) =>
          ({
            id: sku.id,
            ...sku.data(),
          } as unknown)
      );
      setSkus(skusdb as SKU[]);
    }
  };
  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, []);

  const handleProduct = async (e: any) => {
    try {
      e.preventDefault();
      if (id && btn.current) {
        btn.current.disabled = true;
        btn.current.innerHTML =
          "<span class='spinner-border spinner-border-sm'></span> Atualizando produto";
        setProduto({
          ...produto,
          slug: slugify(produto.nome, { locale: "pt-br" }),
        });
        await updateDoc(doc(db, `produtos/${id}`), { ...produto });
        btn.current.innerHTML =
          "<span class='fas fa-plus'></span> Atualizar produto";
        btn.current.disabled = false;
        return;
      }

      if (btn.current) {
        btn.current.disabled = true;
        btn.current.innerHTML =
          "<span class='spinner-border spinner-border-sm'></span> Cadastrando produto";

        const idProduto = await (
          await addDoc(collection(db, "produtos"), {
            ...produto,
            slug: slugify(produto.nome, { locale: "pt-br" }),
          })
        ).id;
        setIdProduto(idProduto);

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
              navigate(`/admin/sku/${idProduto}`);
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
                    value={produto.nome}
                    onChange={({ target }) =>
                      setProduto({ ...produto, nome: target.value })
                    }
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
                    value={produto.termosParaBusca?.join(",")}
                    onChange={({ target }) =>
                      setProduto({
                        ...produto,
                        termosParaBusca: target.value.split(","),
                      })
                    }
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
                    value={produto.preco}
                    onChange={({ target }) =>
                      setProduto({
                        ...produto,
                        preco: parseFloat(
                          target.value == "" ? "0" : target.value
                        ),
                      })
                    }
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
                    value={produto.categoria}
                    onChange={({ target }) =>
                      setProduto({ ...produto, categoria: target.value })
                    }
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
                    value={produto.peso}
                    onChange={({ target }) =>
                      setProduto({
                        ...produto,
                        peso: parseFloat(
                          target.value == "" ? "0" : target.value
                        ),
                      })
                    }
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
                    value={produto.descricao}
                    onChange={({ target }) =>
                      setProduto({ ...produto, descricao: target.value })
                    }
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
                    <i className="fas fa-plus" />{" "}
                    {!id ? "Adicionar produto" : "Atualizar produto"}
                  </button>
                  {id && (
                    <button
                      className="btn btn-success w-100 font-weight-bolder"
                      type="submit"
                      ref={btn}
                      style={{ background: "var(--my-purple)" }}
                    >
                      <i className="fas fa-plus" /> Adicionar novo sku{" "}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        className="card mx-auto mt-4"
        style={{ maxWidth: "800px", minWidth: "800px" }}
      >
        <div className="card-header">SKUs</div>
        <div className="card-body">
          <table className="table">
            <tr>
              <th>Nome</th>
              <th>Tamanho P</th>
              <th>Tamanho M</th>
              <th>Tamanho G</th>
              <th>Tamanho GG</th>
              <th>Alterar</th>
              <th>Excluir</th>
            </tr>
            {skus.map((sku) => (
              <tr>
                <td>{sku.cor}</td>
                <td>
                  {sku.tamanhoP == 1
                    ? `${sku.tamanhoP} unidade`
                    : `${sku.tamanhoP} unidades`}
                </td>
                <td>
                  {sku.tamanhoM == 1
                    ? `${sku.tamanhoM} unidade`
                    : `${sku.tamanhoM} unidades`}
                </td>
                <td>
                  {sku.tamanhoG == 1
                    ? `${sku.tamanhoG} unidade`
                    : `${sku.tamanhoG} unidades`}
                </td>
                <td>
                  {sku.tamanhoGG == 1
                    ? `${sku.tamanhoGG} unidade`
                    : `${sku.tamanhoGG} unidades`}
                </td>

                <td>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      navigate(`/admin/sku/${produto.id}/${sku.id}`);
                    }}
                  >
                    Editar
                  </button>
                </td>
                <td>
                  <button className="btn btn-outline-danger">Excluir</button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default FormularioCadastroProduto;
