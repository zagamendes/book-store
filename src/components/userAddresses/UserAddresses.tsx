import React from "react";
import { Form } from "react-bootstrap";
import { enderecoDeEntrega } from "../usuarioRecorrente/UsuarioRecorrente";

// import { Container } from './styles';
interface UserAddressesProps {
  currentAddress: (_: enderecoDeEntrega) => boolean;
  setShippingAddress: (_: enderecoDeEntrega) => void;
  endereco: enderecoDeEntrega;
}
const UserAddresses: React.FC<UserAddressesProps> = ({
  currentAddress,
  setShippingAddress,
  endereco,
}) => {
  return (
    <Form.Check
      checked={currentAddress(endereco) ? true : false}
      required
      onChange={() => setShippingAddress(endereco)}
      inline
      label={`${endereco.logradouro} ${endereco.numero} ${endereco.complemento} ${endereco.bairro} ${endereco.localidade} ${endereco.uf}`}
      name="enderecos"
      type={"radio"}
      id={`${endereco.logradouro} ${endereco.numero} ${endereco.complemento} ${endereco.bairro} ${endereco.localidade} ${endereco.uf}`}
      value={`${endereco.logradouro} ${endereco.numero} ${endereco.complemento} ${endereco.bairro} ${endereco.localidade} ${endereco.uf}`}
    />
  );
};

export default UserAddresses;
