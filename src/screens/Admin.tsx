import React, { ChangeEvent, useEffect, useState } from "react";
import logo from "./logo.svg";

import { getFirestore, addDoc, collection, doc } from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";

import app from "../utils/firebaseConfig";
function Admin() {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const storageRef = ref(storage, `imagens/${Date.now()}`);

  const [urlFoto, setUrlFoto] = useState("");
  const [caminhoFoto, setCaminhoFoto] = useState("");
  const [defaultFoto, setDefaultFoto] = useState("https://dummyimage.com/hpge");

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
      const result = await addDoc(collection(db, "livros"), data);
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
    const foto = (target.files as FileList)[0];
    const result = await uploadBytes(storageRef, foto);
    const urlFoto = await getDownloadURL(result.ref);
    setUrlFoto(urlFoto);
    setCaminhoFoto(result.metadata.fullPath);

    if (FileReader && foto) {
      var fr = new FileReader();
      fr.onload = function () {
        const imgElement = document.getElementById(
          "foto-livro"
        ) as HTMLImageElement;
        imgElement.src = fr.result as string;
      };
      fr.readAsDataURL(foto);
    }
  };
  return (
    <div className="App container-fluid">
      <ToastContainer />
      <div className="card shadow form-book">
        <h1 style={{ color: "#51a3a3" }} className="text-center">
          Cadastro de livro
        </h1>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row switch-mobile">
              <div className="col-sm-6 d-flex align-items-end">
                <div className="col-sm-12">
                  <img
                    src={defaultFoto}
                    id="foto-livro"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "570px",
                      padding: "10px",
                      background: "#F7E733",
                    }}
                  />
                  <input
                    id="foto"
                    className="form-control d-none"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handlePhoto}
                  />
                  <button
                    type="button"
                    className="btn w-100"
                    style={{
                      border: "1px solid #51A3A3",
                      color: "#51A3A3",
                    }}
                    onClick={() => {
                      (
                        document.querySelector(
                          "input[type=file]"
                        ) as HTMLInputElement
                      )?.click();
                    }}
                  >
                    Adicionar Foto{" "}
                    <i className="ml-5 fas fa-file-alt d-inline-block	"></i>
                  </button>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label htmlFor="nome">Nome do livro</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Ex: Pequeno Príncipe"
                        name="nome"
                        id="nome"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="autor">Autor do livro</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Ex: Jorge Lucas"
                        name="autor"
                        id="autor"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Preço</label>
                      <input
                        required
                        type={"number"}
                        name="preco"
                        placeholder="Ex: 22.50"
                        className="form-control"
                        step="any"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label>Gênero</label>
                      <select className="form-control" name="genero">
                        <option value={"fantasia"}>Fantasia</option>
                        <option value={"ficcao científica"}>
                          Ficção científica
                        </option>
                        <option value={"acao"}>Ação</option>
                        <option value={"drama"}>Drama</option>
                        <option value={"aventura"}>Aventura</option>
                        <option value={"infantil"}>Infantil</option>
                        <option value={"romance"}>Romance</option>
                        <option value={"terror"}>Terror</option>
                        <option value={"adulto"}>Adulto</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label htmlFor="descricao">Descrição</label>
                      <textarea
                        required
                        placeholder="Ex: livro baseado em fatos reais que conta a história de um homem que após..."
                        className="form-control"
                        rows={12}
                        name="descricao"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-12">
                    <button
                      className="btn btn-success w-100"
                      type="submit"
                      style={{ background: "#51a3a3" }}
                    >
                      Adicionar <i className="fas fa-book	" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
