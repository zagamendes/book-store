import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import InputMask from "react-input-mask";

import { addDoc, collection } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";

import { db, storage } from "../utils/firebaseConfig";
import { Form } from "react-bootstrap";
function FormularioCadastroProduto() {
  const storageRef = ref(storage, `imagens/${Date.now()}`);

  const [urlFoto, setUrlFoto] = useState("");
  const [caminhoFoto, setCaminhoFoto] = useState("");
  const [defaultFoto, setDefaultFoto] = useState("https://dummyimage.com/hpge");
  const [isProductUnique, setIsProductUnique] = useState(true);
  const [showSku, setShowSku] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTask = async ({ status, task, key }: any) => {
    try {
      console.log(!status);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const form = new FormData(e.target);
      const data = {
        nome: form.get("nome"),
        autor: form.get("autor"),
        descricao: form.get("descricao"),
        preco: parseFloat(form.get("preco") as string),
        foto: urlFoto,
        caminhoFoto,
        genero: form.get("genero"),
      };
      await addDoc(collection(db, "livros"), data);

      const imgElement = document.getElementById(
        "foto-livro"
      ) as HTMLImageElement;
      imgElement.src = defaultFoto;
      toast.success("Livro cadastrado com sucesso!", {
        theme: "colored",
      });
      e.target.reset();
    } catch (e) {
      alert(e);
    }
  };
  const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const fotos = target.files;
    /* const result = await uploadBytes(storageRef, foto);
    const urlFoto = await getDownloadURL(result.ref); 
    setUrlFoto(urlFoto);
    setCaminhoFoto(result.metadata.fullPath); */

    if (FileReader && fotos) {
      const arrayFotos = Array.from(fotos);
      arrayFotos.forEach((foto) => {
        const fr = new FileReader();
        fr.readAsDataURL(foto);
        fr.onload = function () {
          const images = document.querySelectorAll(".sku-images");
          const container = document.getElementById(
            "ctn-fotos-sku"
          ) as HTMLDivElement;
          if (images.length == 0) {
            container.innerHTML = "";
          }

          const image = document.createElement("img");
          image.src = fr.result as string;
          image.style.width = "80px";
          image.style.height = "80px";
          image.classList.add("sku-images");
          container.appendChild(image);
          console.log("sss");
        };
      });
    }
  };
  const toggleQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.nextElementSibling?.nextElementSibling;

    const tamanhos = document.querySelectorAll<HTMLInputElement>(
      "input[type='checkbox'][name='tamanho']"
    );
    console.log(tamanhos);

    tamanhos.forEach((tamanho) => {
      console.dir(tamanho.checked);
    });

    input?.classList.toggle("d-none");
  };
  return (
    <div
      className="container d-flex flex-column"
      style={{ background: "var(--my-yellow)" }}
    >
      <ToastContainer />
      <div className="card shadow mx-auto" style={{ maxWidth: "800px" }}>
        <h1 style={{ color: "#51a3a3" }} className="text-center">
          Cadastro de livro
        </h1>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row switch-mobile">
              <div className="col-sm-6">
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
              <div className="col-sm-6">
                <div className="form-check">
                  <label htmlFor="produto unico">Produto único?</label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="produto unico"
                    name="unico"
                    value="something"
                    checked={isProductUnique ? true : false}
                    onChange={() => setIsProductUnique(!isProductUnique)}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="termos" className="d-flex flex-column">
                    Termos para busca
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Ex: geladeira, geladera, refrigerador"
                    name="termos"
                    id="termos"
                    data-campo-produto={true}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Preço</label>

                  <input
                    required
                    type={"tel"}
                    name="preco"
                    placeholder="Ex: 22.50"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Categoria</label>
                  <input
                    type={"text"}
                    className="form-control"
                    data-campo-produto={true}
                    placeholder={"Ex: feminino, praia"}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Peso em KG</label>
                  <input
                    type={"tel"}
                    placeholder="Ex: 1.5"
                    className="form-control"
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
              {isProductUnique ? (
                <div>
                  <div className="col-sm-12 mt-3">
                    <button
                      className="btn btn-success w-100 font-weight-bolder"
                      type="submit"
                      style={{ background: "var(--my-purple)" }}
                    >
                      <i className="fas fa-plus" /> Adicionar produto
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="col-sm-12 mt-3">
                    <button
                      className="btn btn-success w-100 font-weight-bolder"
                      style={{ background: "var(--my-purple)" }}
                      onClick={() => setShowSku(!showSku)}
                    >
                      <i className="fas fa-plus" /> Adicionar produto e SKU
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {showSku && (
        <div
          className="card shadow my-4 mx-auto w-100"
          style={{ maxWidth: "800px" }}
        >
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Cor</label>
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="Ex: Azul"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Código</label>
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="Ex: CBAP significa camisa básica azul pequena"
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tamanho P</label>
                  <input
                    className="form-control"
                    type="tel"
                    name="tamanhoP"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tamanho M</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="tamanhoM"
                    placeholder="Ex: 15"
                    defaultValue={0}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tamanho G</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="tamanhoG"
                    placeholder="Ex: 15"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tamanho GG</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="tamanhoGG"
                    placeholder="Ex: 15"
                    defaultValue={0}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 mt-3">
                <input
                  type={"file"}
                  className="form-control d-none"
                  accept="image/*"
                  multiple
                  ref={inputRef}
                  onChange={handlePhoto}
                />
                <button
                  className="btn btn-info bg-purple text-white font-weight-bolder  w-100"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  <i className="fas fa-images" /> Selecionar fotos
                </button>
              </div>
              <div
                className="col-sm-6 d-flex justify-content-between flex-wrap"
                id="ctn-fotos-sku"
                style={{ rowGap: "20px" }}
              >
                <img
                  src="https://placehold.jp/1024x1024.png"
                  className="img-fluid"
                  style={{ width: "80px", height: "80px" }}
                />
                <img
                  src="https://placehold.jp/1024x1024.png"
                  className="img-fluid"
                  style={{ width: "80px", height: "80px" }}
                />
                <img
                  src="https://placehold.jp/1024x1024.png"
                  className="img-fluid"
                  style={{ width: "80px", height: "80px" }}
                />
                <img
                  src="https://placehold.jp/1024x1024.png"
                  className="img-fluid"
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-12">
                <button className="btn btn-primary bg-purple font-weight-bolder w-100">
                  <i className="fas fa-plus" /> Salvar SKU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormularioCadastroProduto;
