interface enderecoDeEntrega {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  id: string;
  complemento?: string;
  numero: string;
}
export interface MyUser {
  enderecos?: enderecoDeEntrega[];
  displayName: string | undefined;
  email: string | undefined;
  cpf?: string | undefined;
  uid: string | undefined;
}
