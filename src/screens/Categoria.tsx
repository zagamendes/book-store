import React, { useEffect, useState } from "react";

// import { Container } from './styles';
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import app from "../utils/firebaseConfig";
import Shelf from "../components/shelf/Shelf";
import { useParams } from "react-router-dom";
const Categoria: React.FC = () => {
  const db = getFirestore(app);
  const [livros, setLivros] = useState<DocumentData[]>([]);
  const { categoria } = useParams();

  const q = query(collection(db, "livros"), where("genero", "==", categoria));

  const getLivros = async () => {
    const result = await getDocs(q);
    const array: any = [];
    result.forEach((snapshot) => {
      array.push({ id: snapshot.id, ...snapshot.data() });
    });
    setLivros(array);
  };
  useEffect(() => {
    getLivros();
  }, [categoria]);
  return (
    <div>
      <h1 className="text-center">Resultados do gênero {categoria}</h1>
      <div className="d-flex justify-content-around">
        {livros.map((livro: any) => {
          return <Shelf {...livro} />;
        })}
      </div>
    </div>
  );
};

export default Categoria;
