import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Prev } from "react-bootstrap/esm/PageItem";
import { useParams } from "react-router-dom";
import { SKU } from "../@types/sku";
import { db, storage } from "../utils/firebaseConfig";
// import { Container } from './styles';

const FormularioCadastroSKU: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { idProduto, idSku } = useParams();
  const [fotosPath, setFotosPath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const [currentSku, setCurrentSku] = useState({} as SKU);

  useEffect(() => {
    if (idSku) getSKUInfo();
  }, []);

  const getSKUInfo = async () => {
    const dataSnapshot = await getDoc(
      doc(db, `produtos/${idProduto}/skus/${idSku}`)
    );
    setCurrentSku({ ...(dataSnapshot.data() as SKU) });
  };

  const handleSKU = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (idSku) {
      try {
        await runTransaction(db, async (transaction) => {
          const produtoRef = doc(db, `produtos/${idProduto}/skus/${idSku}`);
          const sku = await transaction.get(produtoRef);
          if (!sku.exists()) {
            throw "Document does not exist!";
          }

          transaction.update(produtoRef, {
            ...currentSku,
          });
        });
        console.log("Transaction successfully committed!");
        setFotosPath([]);
      } catch (e: any) {
        console.log("Transaction failed: ", e);
        alert(e.message);
      }
      return;
    }

    if (btn.current) {
      btn.current.disabled = true;
      btn.current.innerHTML =
        "<i class'fas spinner-border spinner-sm' /> Salvando SKU";

      await addDoc(collection(db, `produtos/${idProduto}/skus`), {
        ...currentSku,
      });

      setFotosPath([]);
      btn.current.innerHTML = "<i className='fas fa-plus' /> Salvar SKU";
      btn.current.disabled = false;
    }
  };
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const fotos = target.files;
    setIsLoading(true);
    const arrayPromises = Array.from(fotos as FileList).map((foto) => {
      return uploadBytes(
        ref(storage, `fotos/${idProduto}/${Date.now()}`),
        foto
      );
    });
    const storagePath = await Promise.all(arrayPromises);
    const arrayURLPromises = storagePath.map((path, i) => {
      return getDownloadURL(path.ref);
    });
    const arrayURLs = await Promise.all(arrayURLPromises);
    setCurrentSku((prev) => {
      return { ...prev, fotos: [...(prev.fotos ?? []), ...arrayURLs] };
    });

    setIsLoading(false);
    setFotosPath([]);
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
                    required
                    className="form-control"
                    placeholder="Ex: Azul"
                    name="cor"
                    onChange={({ target }) =>
                      setCurrentSku({ ...currentSku, cor: target.value })
                    }
                    value={currentSku.cor}
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
                    required
                    onChange={({ target }) =>
                      setCurrentSku({ ...currentSku, codigo: target.value })
                    }
                    value={currentSku.codigo}
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
                    onChange={({ target }) =>
                      setCurrentSku({
                        ...currentSku,
                        tamanhoP: parseInt(
                          target.value == "" ? "0" : target.value
                        ),
                      })
                    }
                    value={currentSku.tamanhoP ?? 0}
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
                    onChange={({ target }) =>
                      setCurrentSku({
                        ...currentSku,
                        tamanhoM: parseInt(
                          target.value == "" ? "0" : target.value
                        ),
                      })
                    }
                    value={currentSku.tamanhoM ?? 0}
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
                    onChange={({ target }) =>
                      setCurrentSku({
                        ...currentSku,
                        tamanhoG: parseInt(
                          target.value == "" ? "0" : target.value
                        ),
                      })
                    }
                    value={currentSku.tamanhoG ?? 0}
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
                    onChange={({ target }) =>
                      setCurrentSku({
                        ...currentSku,
                        tamanhoGG: parseInt(
                          target.value == "" ? "0" : target.value
                        ),
                      })
                    }
                    value={currentSku.tamanhoGG ?? 0}
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
                  type="button"
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
                  ref={btn}
                  className="btn btn-primary bg-purple font-weight-bolder w-100"
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
