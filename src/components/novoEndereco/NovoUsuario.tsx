import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  FieldValue,
} from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MyUser } from "../../@types/user";
import { useAuth } from "../../contextos/AuthContext";
import { useMiniCart } from "../../contextos/MiniCartContext";
import { db } from "../../utils/firebaseConfig";

// import { Container } from './styles';
interface enderecoResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
interface complementoProps {
  complemento: string;
  numero: string;
}
interface enderecoFinal {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;

  complemento?: string;
  numero: string;
}

interface NovoEnderecoProps {
  closeModal: (_: boolean) => void;
}
const NovoEndereco: React.FC<NovoEnderecoProps> = ({ closeModal }) => {
  const { user, setUser } = useAuth();
  const { products } = useMiniCart();
  const Navigate = useNavigate();

  const btn = useRef<any>();

  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({} as enderecoResponse);
  const [complemento, setComplemento] = useState({} as complementoProps);

  const getAddressInfo = async () => {
    console.log("aqui");

    const { data } = await axios<enderecoResponse>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
    setEndereco(data);
  };
  useEffect(() => {
    if (!user) Navigate("/");
  }, []);

  const addUserToDB = async (newUser: MyUser) => {
    await setDoc(doc(db, "usuarios", `${user?.uid}`), newUser, {
      merge: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser: MyUser = {
      displayName: user?.displayName as string,
      email: user?.email as string,
      cpf: user?.cpf as string,
      uid: user?.uid as string,
      enderecos: [
        {
          bairro: endereco.bairro,
          cep: cep,
          complemento: complemento.complemento ? complemento.complemento : "",
          localidade: endereco.localidade,
          logradouro: endereco.logradouro,
          uf: endereco.uf,
          numero: complemento.numero,
          id: "",
        },
      ],
    };
    try {
      if (btn.current) {
        btn.current.innerHTML =
          "Salvando endereço <span class='spinner-border spinner-border-sm'></span>";
        btn.current.disabled = true;
        await addUserToDB(newUser);
        (e.target as HTMLFormElement).reset();
        btn.current.innerHTML = "Salvar endereço";
        btn.current.disabled = false;
      }
    } catch (e) {
      console.error(e);
    }
  };
  const updateAddress = async () => {
    const novoEndereco: enderecoFinal = {
      bairro: endereco.bairro,
      cep: cep,
      localidade: endereco.localidade,
      logradouro: endereco.logradouro,
      numero: complemento.numero,
      complemento: complemento.complemento ? complemento.complemento : "",
      uf: endereco.uf,
    };
    if (btn.current) {
      btn.current.innerHTML =
        "Salvando novo endereço <span class='spinner-border spinner-border-sm'></span>";
      btn.current.disabled = true;

      await updateDoc(
        doc(db, `usuarios/${user?.uid}`),

        "enderecos",
        arrayUnion(novoEndereco)
      );
      btn.current.innerHTML = "Salvar endereço";
      btn.current.disabled = false;
    }
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Defina o endereço de entrega</Card.Title>
      </Card.Header>
      <Card.Body>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Row className="mt-2">
            <Col sm={4}>
              <FormGroup>
                <FormLabel>Nome</FormLabel>
                <FormControl
                  type="text"
                  value={user?.displayName as string}
                  onChange={(e) =>
                    setUser({
                      ...(user as MyUser),
                      displayName: e.target.value,
                    })
                  }
                  required
                ></FormControl>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormControl
                  required
                  type="text"
                  value={user?.email as string}
                  onChange={(e) =>
                    setUser({ ...(user as MyUser), email: e.target.value })
                  }
                ></FormControl>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <FormLabel>CPF</FormLabel>
                <FormControl
                  required
                  type="text"
                  maxLength={11}
                  minLength={11}
                  placeholder="Somente números"
                  value={user?.cpf as string}
                  onChange={(e) =>
                    setUser({
                      ...(user as MyUser),
                      cpf: e.target.value,
                    })
                  }
                ></FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={4}>
              <FormGroup>
                <FormLabel>CEP</FormLabel>
                <FormControl
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={() => {
                    getAddressInfo();
                  }}
                  required
                  maxLength={8}
                ></FormControl>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <FormLabel>Numero</FormLabel>
                <FormControl
                  required
                  type="text"
                  value={complemento.numero}
                  onChange={(e) =>
                    setComplemento({ ...complemento, numero: e.target.value })
                  }
                ></FormControl>
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <FormLabel>Complemento</FormLabel>
                <FormControl
                  type="text"
                  value={complemento.complemento}
                  onChange={(e) =>
                    setComplemento({
                      ...complemento,
                      complemento: e.target.value,
                    })
                  }
                ></FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={6}>
              <FormGroup>
                <FormLabel>Rua</FormLabel>
                <FormControl
                  required
                  type="text"
                  value={endereco.logradouro}
                  onChange={(e) => {
                    console.log(endereco.logradouro);
                    setEndereco({ ...endereco, logradouro: e.target.value });
                  }}
                ></FormControl>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <FormLabel>Bairro</FormLabel>
                <FormControl
                  type="text"
                  required
                  value={endereco.bairro}
                  onChange={(e) =>
                    setEndereco({
                      ...endereco,
                      bairro: e.target.value,
                    })
                  }
                ></FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={6}>
              <FormGroup>
                <FormLabel>Cidade</FormLabel>
                <FormControl
                  type="text"
                  value={endereco.localidade}
                  onChange={(e) =>
                    setEndereco({ ...endereco, localidade: e.target.value })
                  }
                ></FormControl>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup>
                <FormLabel>Estado</FormLabel>
                <FormControl
                  type="text"
                  value={endereco.uf}
                  onChange={(e) =>
                    setEndereco({
                      ...endereco,
                      uf: e.target.value,
                    })
                  }
                ></FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={6}>
              {user?.enderecos?.length == 0 ? (
                <button
                  ref={btn}
                  className="btn w-100 btn-ver-produto text-white bg-purple text-white font-weight-bolder"
                >
                  Salvar endereço
                </button>
              ) : (
                <button
                  ref={btn}
                  type="button"
                  className="btn w-100 btn-ver-produto text-white bg-purple text-white font-weight-bolder"
                  onClick={() => updateAddress()}
                >
                  Salvar endereço
                </button>
              )}
            </Col>
            <Col sm={6}>
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={() => closeModal(false)}
              >
                Fechar
              </button>
            </Col>
          </Row>
        </form>
      </Card.Body>
    </Card>
  );
};

export default NovoEndereco;
