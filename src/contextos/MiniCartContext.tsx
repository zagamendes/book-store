import React, { createContext, useContext, useState } from "react";

interface miniCartContextProps {
  products: ProductMiniCart[];
  addToCart: (produt: ProductMiniCart) => void;
  descreaseQuantity: (product: ProductMiniCart) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (_: boolean) => void;
  removeProduct: (id: string) => void;
  getProducts: () => ProductMiniCart[];
  cleanCart: () => void;
}
export interface ProductMiniCart {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  foto: string;
}
const miniCartContext = createContext({} as miniCartContextProps);
export const useMiniCart = () => useContext(miniCartContext);
const MiniCartProvider: React.FC<any> = ({ children }) => {
  const addToCart = (product: ProductMiniCart) => {
    setProducts((prevProducts) => {
      if (prevProducts.find((item) => item.id == product.id) == null) {
        localStorage.setItem(
          "products",
          JSON.stringify([
            ...prevProducts,
            { ...product, quantidade: quantity },
          ])
        );
        return [...prevProducts, { ...product, quantidade: quantity }];
      } else {
        const newProducts = prevProducts.map((item) => {
          if (item.id == product.id) {
            return {
              ...item,
              quantidade:
                isMiniCartOpen || window.location.pathname.includes("checkout")
                  ? item.quantidade + 1
                  : item.quantidade + quantity,
            };
          }
          return item;
        });
        localStorage.setItem("products", JSON.stringify(newProducts));
        return newProducts;
      }
    });
  };

  const descreaseQuantity = (product: ProductMiniCart) => {
    setProducts((prevProducts) => {
      return prevProducts.map((item) => {
        if (item.id == product.id && product.quantidade > 1) {
          return { ...item, quantidade: item.quantidade - 1 };
        }
        return item;
      });
    });
    localStorage.setItem("products", JSON.stringify(products));
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => {
      const newArray = prev.filter((item) => item.id != id);
      localStorage.setItem("products", JSON.stringify(newArray));
      return newArray;
    });
  };

  const cleanCart = () => {
    localStorage.removeItem("products");
    setProducts([]);
  };
  const getProducts = () => {
    const products = localStorage.getItem("products");
    if (!products) return [];

    return JSON.parse(products);
  };
  const [products, setProducts] = useState<ProductMiniCart[]>(getProducts());
  const [quantity, setQuantity] = useState<number>(1);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  return (
    <miniCartContext.Provider
      value={{
        products,
        addToCart,
        quantity,
        setQuantity,
        isMiniCartOpen,
        setIsMiniCartOpen,
        getProducts,
        descreaseQuantity,
        removeProduct,
        cleanCart,
      }}
    >
      {children}
    </miniCartContext.Provider>
  );
};

export default MiniCartProvider;
