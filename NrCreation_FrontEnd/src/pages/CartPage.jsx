import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/ReusableComponents/EmptyState";
import {
  updateQuantity,
  removeFromCart,
  setCartItems,
} from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import api from "@/store/api";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { products } = useSelector((state) => state.product);
  console.log("products : ", products);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cartIdResponse = await api.get("/cart/my-cart");
        console.log("cartIdResponse : ", cartIdResponse);
        const cartId = cartIdResponse.data?.data?.cartId;
        console.log("cartId : ", cartId);
        if (cartId) {
          const cartItemsResponse = await api.get(`/cart-item/cart/${cartId}`);
          dispatch(setCartItems(cartItemsResponse.data?.data || []));
        } else {
          dispatch(setCartItems([]));
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError("Failed to load cart. Please try again.");
        dispatch(setCartItems([]));
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [dispatch]);

  const handleQuantityChange = async (cartItemId, quantity) => {
    try {
      await api.put("/cart-item/update", {
        cartItemId,
        quantity,
      });
      dispatch(updateQuantity({ productId: cartItemId, quantity }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await api.delete("/cart-item/delete", {
        params: { cartItemId },
      });
      dispatch(removeFromCart(cartItemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  const tax = totalPrice * 0.05;
  const shipping = 99;
  const finalTotal = (totalPrice + shipping + tax).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add some products to your cart to see them here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="w-24 h-32 bg-gray-200 rounded-md">
                    <img
                      src={item.imageUrl || "/placeholder-image.jpg"}
                      alt={item.title || "Product Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        {item.title || "Product Name"}
                      </h3>
                      <p className="font-semibold text-[#871845]">
                        ₹{item.unitprice * item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Product ID: {item.productId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Unit Price: ₹{item.unitprice}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-[#871845]">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-[#871845] hover:bg-[#611031]">
                Proceed to Checkout
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
