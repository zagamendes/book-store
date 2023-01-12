import { doc, setDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SKU } from "../@types/sku";
import { db, storage } from "../utils/firebaseConfig";
// import { Container } from './styles';

const FormularioCadastroSKU: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const [fotosPath, setFotosPath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log(fotosPath);
  }, [fotosPath]);

  const handleSKU = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: SKU = {
      codigo: form.get("codigo") as string,
      cor: form.get("cor") as string,
      fotos: fotosPath,
      tamanhoG: parseInt(form.get("tamanhoG") as string),
      tamanhoGG: parseInt(form.get("tamanhoGG") as string),
      tamanhoM: parseInt(form.get("tamanhoM") as string),
      tamanhoP: parseInt(form.get("tamanhoP") as string),
    };
    await setDoc(doc(db, `produtos/${id}/skus/${data.cor}`), data);
  };
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const fotos = target.files;
    setIsLoading(true);
    const arrayPromises = Array.from(fotos as FileList).map((foto) => {
      return uploadBytes(ref(storage, `fotos/${id}/${Date.now()}`), foto);
    });
    const storagePath = await Promise.all(arrayPromises);
    storagePath.forEach(async (path) => {
      const url = await getDownloadURL(path.ref);

      setFotosPath((prev) => [...prev, url]);
    });
    setIsLoading(false);
  };

  return (
    <div className="container">
      <div
        className="card shadow my-4 mx-auto w-100"
        style={{ maxWidth: "800px" }}
      >
        <div className="card-body">
          <form onSubmit={handleSKU}>
            <div className="row mb-3">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Cor</label>
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="Ex: Azul"
                    name="cor"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Código</label>
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="Ex: CBA significa camisa básica azul pequena"
                    name="codigo"
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
              <div className="col-sm-6 ">
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
              {isLoading && (
                <div className="col-sm-6 loading-bar">
                  <button className="btn btn-primary w-100">
                    <i className="spinner-border spinner-border-sm"></i>Enviando
                    fotos
                  </button>
                </div>
              )}
            </div>
            <div className="row mt-3">
              <div className="col-sm-12">
                <button
                  className="btn btn-primary bg-purple font-weight-bolder w-100"
                  disabled={fotosPath.length == 0 ? true : false}
                >
                  <i className="fas fa-plus" /> Salvar SKU
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioCadastroSKU;
