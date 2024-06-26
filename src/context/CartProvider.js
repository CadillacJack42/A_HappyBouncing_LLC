import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const location = useLocation();

  const clearCart = () => setCart([]);

  const addToCart = (newItem) => {
    if (cart.length === 0) {
      newItem.quantity = 1;
      setCart([newItem]);
    }

    const idArray = cart.map((item) => item.id);

    if (!idArray.includes(newItem.id)) {
      newItem.quantity = 1;
      setCart([...cart, newItem]);
    } else {
      cart[idArray.indexOf(newItem.id)].quantity++;
      setCart([...cart]);
    }
    toast.success(`${newItem.name} has been added to your cart`);
  };

  const decrementCartItem = (itemToDecrement) => {
    const updatedCart = cart.map((item) => {
      if (itemToDecrement.id === item.id) {
        item.quantity--;
      }

      if (item.quantity !== 0) {
        return item;
      }
    });
    const filteredCart = updatedCart.filter((item) => {
      if (item !== undefined) {
        return item;
      }
    });
    setCart([...filteredCart]);
    toast.success(`${itemToDecrement.name} has been removed from cart`);
  };

  const removeFromCart = (i) => {
    console.log("CART IN REMOVE", cart);
    cart.splice(i, 1);
    cart.length > 0 ? setCart([...cart]) : setCart([]);
    toast.success(`Cart has been updated`);
  };

  const cartCount = () => {
    const count = cart.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);
    return count;
  };

  useEffect(() => {
    if (location.state?.cart.length > 0) {
      setCart(location.state.cart);
    }
  }, []);

  useEffect(() => {
    location.state = { ...location.state, cart };
    console.log("IS THIS WORKING??", location.state);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        clearCart,
        addToCart,
        removeFromCart,
        cartCount,
        decrementCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
