import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../@types/product";
import { db } from "../utils/firebaseConfig";
import { precoFormatado } from "../utils/formataPreco";

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const navigate = useNavigate();
  const getProducts = async () => {
    const dataSnapshot = await getDocs(
      query(collection(db, "produtos"), orderBy("nome"), limit(10))
    );
    const produtosDB = dataSnapshot.docs.map((product) => {
      return { id: product.id, ...product.data() };
    });
    setProdutos(produtosDB as Product[]);
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>preco</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{precoFormatado(produto.preco)}</td>
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    navigate(`/admin/produto/${produto.id}`);
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
        </tbody>
      </table>
    </div>
  );
};

export default Produtos;
