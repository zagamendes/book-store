import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  connectFirestoreEmulator,
} from "firebase/firestore";
import app from "../utils/firebaseConfig";
import Shelf from "../components/shelf/Shelf";
import Slider from "react-slick";
import ShelfLoading from "../components/shelfLoading";
import axios from "axios";

const Home: React.FC = () => {
  const db = getFirestore(app);

  const [books, setBooks] = useState<any>([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  const getBooks = async () => {
    const data = await getDocs(collection(db, "livros"));
    let arrayDocumentos: any = [];
    data.forEach((snapshot) => {
      arrayDocumentos.push({ id: snapshot.id, ...snapshot.data() });
    });
    setBooks(arrayDocumentos);
  };
  useEffect(() => {
    getBooks();
    axios(
      "https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=3540&redirect_uri=https://bookstore-15b7a.web.app/&response_type=code&scope=cart-read"
    ).then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <>
      <section
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "100%",
          height: "300px",
          position: "relative",
          background:
            "linear-gradient(to top, black 0, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%,rgba(0, 0, 0, 0.8) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            maxWidth: "385px",
          }}
        >
          <h1
            className="text-white text-center font-weight-bolder"
            style={{ fontSize: "50px" }}
          >
            Livraria do Izaac
          </h1>
          <p
            className="text-white font-weight-bolder text-center"
            style={{ fontSize: "25px" }}
          >
            Um quarto sem livros é como um corpo sem alma
          </p>
        </div>
        <img
          src="https://images.freeimages.com/images/large-previews/d6f/open-book-1531710.jpg"
          className="img-fluid"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            zIndex: "-1",
          }}
        />
      </section>

      <div className="container">
        <h1 className="text-center conheca-nossos-livros mt-5 mb-5">
          Conheça nossos livros mais procurados
        </h1>
        <div
          className="d-flex justify-content-between flex-wrap"
          style={{ gap: "20px 0" }}
        >
          {books.length === 0 ? (
            <ShelfLoading />
          ) : (
            <Slider {...settings}>
              {books.map((book: any) => {
                return <Shelf book={book} />;
              })}
            </Slider>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
