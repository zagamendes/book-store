import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Modal, Row, Table } from "react-bootstrap";
import Step from "../components/Step/Step";
import UserAddresses from "../components/userAddresses/UserAddresses";
import { enderecoDeEntrega } from "../components/usuarioRecorrente/UsuarioRecorrente";
import { useAuth } from "../contextos/AuthContext";
import { useMiniCart } from "../contextos/MiniCartContext";

import NovoEndereco from "../components/novoEndereco/NovoEndereco";
import { precoFormatado } from "../utils/formataPreco";
import { CorreiosResponse } from "../@types/correios";

const Cart: React.FC = () => {
  const [showAddresses, setShowAddresses] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<CorreiosResponse[]>(
    []
  );
  const [chosenOption, setChosenOption] = useState<CorreiosResponse>(
    {} as CorreiosResponse
  );
  const { products, removeProduct } = useMiniCart();
  const [shippingAddress, setShippingAddress] = useState(
    {} as enderecoDeEntrega
  );
  const [showModal, setShowModal] = useState(false);
  const btn = useRef<any>();

  const { user } = useAuth();

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
  const gotToMercadoPago = async () => {
    try {
      btn.current.innerHTML =
        "Redirecionando para o checkout <span class='spinner-border spinner-border-sm'></span>";
      btn.current.disabled = true;
      const produtos = products.map((product) => {
        return {
          id: product.id,
          quantidade: product.quantidade,
        };
      });
      const shippingPrice = chosenOption.Valor;

      const {
        data: { body },
      } = await axios.post(
        "http://localhost:5001/bookstore-15b7a/us-central1/api/create-session",
        {
          produtos,
          user,
          shippingPrice,
          shippingAddress,
        }
      );

      window.location.replace(body.sandbox_init_point);
    } catch (e) {
      console.error(e);
    }
  };

  const calculate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (user?.enderecos) {
      e.currentTarget.innerHTML =
        "Calculando frete <i class='spinner-border spinner-border-sm' />";
      e.currentTarget.disabled = true;
      const { data } = await axios<CorreiosResponse[]>(
        `http://127.0.0.1:5001/bookstore-15b7a/us-central1/api/calcularFrete/${shippingAddress.cep}`
      );

      setShippingOptions(data);

      return;
    }
    setShowModal(!showModal);
  };
  const showUserAddresses = () => setShowAddresses(!showAddresses);
  return (
    <div className="container">
      <Modal show={showModal} onHide={() => setShowModal(!showModal)} size="lg">
        <Modal.Body className="p-0">
          <NovoEndereco closeModal={setShowModal} />
        </Modal.Body>
      </Modal>
      <h1 className="text-center my-3">Seu carrinho</h1>
      <Row className="mb-5">
        <Card>
          <Card.Body>
            <Table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Entrega</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th>Remover</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        style={{
                          width: "90px",
                          height: "140px",
                          objectFit: "cover",
                        }}
                        src={product.foto}
                        alt={product.nome}
                      />{" "}
                      {product.nome}
                    </td>
                    <td>{`${chosenOption.PrazoEntrega} dias úteis`}</td>
                    <td>{product.preco}</td>
                    <td style={{ width: "150px" }}>
                      <Step key={product.id} product={product} />
                    </td>
                    <td>{product.preco * product.quantidade}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => removeProduct(product.id)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
      <Row className="d-flex justify-content-between">
        <Card style={{ width: "400px" }}>
          <Card.Body>
            {showAddresses && shippingOptions.length == 0 ? (
              <div>
                <strong>Endereços</strong>
                {(user?.enderecos as Array<enderecoDeEntrega>).map(
                  (endereco) => {
                    return (
                      <UserAddresses
                        currentAddress={currentAddress}
                        endereco={endereco}
                        setShippingAddress={setShippingAddress}
                        key={`${endereco.logradouro} ${endereco.numero} ${endereco.complemento} ${endereco.bairro} ${endereco.localidade} ${endereco.uf}`}
                      />
                    );
                  }
                )}
                <div
                  className="d-flex flex-column mt-2"
                  style={{ rowGap: "5px" }}
                >
                  <button
                    className="btn btn-success bg-purple text-white font-weight-bolder"
                    onClick={(e) => calculate(e)}
                  >
                    <i className="fas fa-check" /> Calcular frete para esse
                    endereço
                  </button>

                  <button
                    className="btn btn-outline-warning font-weight-bolder w-100"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-plus" /> Adicionar novo endereço
                  </button>
                </div>
              </div>
            ) : shippingOptions.length != 0 ? (
              <div>
                <p>
                  <strong>Opções de envio</strong>
                </p>
                {shippingOptions?.map((shipping: any, i) => (
                  <Form.Check
                    key={i}
                    type="radio"
                    name="shipping"
                    value={shipping.PrazoEntrega}
                    id={
                      shipping.PrazoEntrega == "1"
                        ? `${i == 0 ? "SEDEX" : "PAC"} - 1 dia útil R$ ${
                            shipping.ValorSemAdicionais
                          }`
                        : `${i == 0 ? "SEDEX" : "PAC"} - ${
                            shipping.PrazoEntrega
                          } dias úteis R$ ${shipping.ValorSemAdicionais}`
                    }
                    label={
                      shipping.PrazoEntrega == "1"
                        ? `${i == 0 ? "SEDEX" : "PAC"} - 1 dia útil R$ ${
                            shipping.ValorSemAdicionais
                          }`
                        : `${i == 0 ? "SEDEX" : "PAC"} - ${
                            shipping.PrazoEntrega
                          } dias úteis R$ ${shipping.ValorSemAdicionais}`
                    }
                    onChange={() => setChosenOption(shipping)}
                  />
                ))}

                <button
                  onClick={() => {
                    setShippingOptions([]);
                    setChosenOption({} as CorreiosResponse);
                  }}
                  className="btn btn-warning font-weight-bolder w-100"
                >
                  <i className="fas fa-arrow-left" /> Escolher outro endereço
                </button>
              </div>
            ) : (
              <>
                <strong>Entrega</strong>
                <p>
                  Veja as opções de entrega para seus itens, com todos os prazos
                  e valores.
                </p>
                <button
                  className="btn btn-info bg-purple text-white w-100 font-weight-bolder"
                  onClick={() => showUserAddresses()}
                >
                  Calcular
                </button>
              </>
            )}
          </Card.Body>
        </Card>
        <Card style={{ width: "320px" }}>
          <Card.Body>
            <strong>Resumo da compra</strong>
            <div className="d-flex justify-content-between">
              <p>Sub total</p> <p>{precoFormatado(20.99)}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Entrega</p>{" "}
              <p>
                {chosenOption.Codigo
                  ? new Intl.NumberFormat("pt-br", {
                      currency: "brl",
                      style: "currency",
                    }).format(
                      parseFloat(
                        chosenOption.ValorSemAdicionais.replace(",", ".")
                      )
                    )
                  : "A calcular"}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Total</p> <p>R$ 90,00</p>
            </div>
            <button
              ref={btn}
              className="btn btn-success bg-purple font-weight-bolder w-100"
              onClick={() => gotToMercadoPago()}
              disabled={!chosenOption.Codigo ? true : false}
            >
              Finalizar compra
            </button>
          </Card.Body>
        </Card>
      </Row>
    </div>
  );
};

export default Cart;
