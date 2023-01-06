import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Form,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../../contextos/AuthContext";
import { useMiniCart } from "../../contextos/MiniCartContext";
import { db } from "../../utils/firebaseConfig";
import CheckoutItem from "../checkoutItem/CheckoutItem";

import NovoUsuario from "../novoEndereco/NovoEndereco";
import Step from "../Step/Step";
import UserAddresses from "../userAddresses/UserAddresses";

// import { Container } from './styles';
export interface enderecoDeEntrega {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  id: string;

  complemento?: string;
  numero: string;
}
interface newUser {
  enderecos?: enderecoDeEntrega[];
  displayName: string;
  email: string;
  cpf: string;
}
const UsuarioRecorrente: React.FC = () => {
  const [showAddresses, setShowAddresses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(
    {} as enderecoDeEntrega
  );
  const { user } = useAuth();
  const { products } = useMiniCart();

  const currentAddress = (endereco: enderecoDeEntrega) =>
    endereco.numero == shippingAddress.numero &&
    endereco.logradouro == shippingAddress.logradouro;

  useEffect(() => {
    if (user?.enderecos)
      setShippingAddress({
        bairro: user?.enderecos[0].bairro,
        cep: user?.enderecos[0].cep,
        localidade: user?.enderecos[0].localidade,
        logradouro: user?.enderecos[0].logradouro,
        numero: user?.enderecos[0].numero,
        uf: user?.enderecos[0].uf,
        complemento: user?.enderecos[0].complemento,
        id: user.enderecos[0].id,
      });
  }, []);
  if (user?.enderecos) {
    return (
      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)} size={"lg"}>
          <Modal.Body>
            <NovoUsuario closeModal={setShowModal} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setShowModal(false)}>
              Fechar <i className="fas fa-times" />
            </Button>
          </Modal.Footer>
        </Modal>
        <ListGroup>
          <ListGroup.Item className="border-0 border-bottom">
            {!showAddresses ? (
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex" style={{ columnGap: "15px" }}>
                  <strong>1 Endereço de entrega </strong>
                  <div className="d-flex flex-column">
                    <span>{user?.displayName}</span>
                    <span>
                      {shippingAddress.logradouro} {shippingAddress.numero}
                    </span>
                    <span>{shippingAddress.bairro}</span>
                    <span>
                      {shippingAddress.localidade} {shippingAddress.uf}{" "}
                      {shippingAddress.cep}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-outline-warning"
                  onClick={() => setShowAddresses(!showAddresses)}
                >
                  <i className="fas fa-edit" />
                  Alterar
                </button>
              </div>
            ) : (
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Endereços </Accordion.Header>
                  <Accordion.Body>
                    <div
                      className="d-flex flex-column"
                      style={{ rowGap: "10px" }}
                    >
                      {" "}
                      {user.enderecos.map((endereco: enderecoDeEntrega) => {
                        return (
                          <UserAddresses
                            currentAddress={currentAddress}
                            endereco={endereco}
                            setShippingAddress={setShippingAddress}
                            key={`${endereco.logradouro} ${endereco.numero} ${endereco.complemento} ${endereco.bairro} ${endereco.localidade} ${endereco.uf}`}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-3 d-flex justify-content-between align-items-start">
                      <div className="d-flex flex-column align-items-start">
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => setShowModal(true)}
                        >
                          <i className="fas fa-plus" />
                          Adicionar novo endereço
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setShowAddresses(false)}
                        >
                          <i className="fas fa-check" /> Usar esse endeço
                        </button>
                      </div>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => setShowAddresses(false)}
                      >
                        <i className="fas fa-times" /> Fechar
                      </button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
          </ListGroup.Item>
          <ListGroupItem className="border-0 border-bottom">
            <div className="d-flex flex-column" style={{ columnGap: "15px" }}>
              <strong>2 Produtos</strong>
              <div className="d-flex flex-column">
                {products.map((product) => (
                  <Card className="mb-3">
                    <Card.Body>
                      <CheckoutItem
                        product={product}
                        key={product.id}
                        checkout={true}
                      />
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  } else return null;
};

export default UsuarioRecorrente;
