export const precoFormatado = (preco: number) => {
  return new Intl.NumberFormat("pt-br", {
    currency: "brl",
    style: "currency",
  }).format(preco);
};
