import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/ReusableComponents/EmptyState";
import {
  updateQuantity,
  removeFromCart,
  fetchCartItems,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
} from "@/store/slices/cartSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { useEffect, useMemo } from "react";
import api from "@/store/api";
import { toast } from "react-toastify";
// Cart Item Component
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  console.log("CartItem quantity:", item.quantity);

  // Default image URL if none is available
  const defaultImage = "/placeholder-image.jpg";

  // Safely access image URL
  const imageUrl = item.imageUrls?.[0] || item.imageUrl || defaultImage;

  return (
    <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="w-24 h-32 bg-gray-200 rounded-md">
        <img
          src={imageUrl}
          alt={item.title || "Product Image"}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h3 className="font-semibold">{item.name || "Product Name"}</h3>
          <p className="font-semibold text-[#871845]">₹{item.totalprice}</p>
        </div>
        <p className="text-sm text-gray-500">
          {item.description || "No description available"}
        </p>
        <p className="text-sm text-gray-500">Unit Price: ₹{item.unitprice}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                console.log("Decreasing quantity from:", item.quantity);
                onQuantityChange(item.id, item.quantity - 1);
              }}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ totalPrice, shipping = 99, tax }) => (
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
          <span className="text-[#871845]">
            ₹{(totalPrice + shipping + tax).toFixed(2)}
          </span>
        </div>
      </div>
    </div>

    <Button className="w-full bg-[#871845] hover:bg-[#611031]">
      <Link to="/checkout"> Proceed to Checkout</Link>
    </Button>

    <Button variant="outline" className="w-full" asChild>
      <Link to="/">Continue Shopping</Link>
    </Button>
  </div>
);

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const { products } = useSelector((state) => state.product);
  console.log("Products:", products);
  console.log("Cart Items1:", cartItems);
  // Fetch cart data using the new thunk
  useEffect(() => {
    // dispatch(fetchProducts());
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Enrich cart items with product details
  const enrichedCartItems = useMemo(() => {
    return cartItems.map((cartItem) => {
      const productDetails = products.find((p) => p.id === cartItem.productId);

      return {
        ...cartItem,
        ...productDetails,
      };
    });
  }, [cartItems, products]);
  // console.log("Enriched Cart Items:", enrichedCartItems);
  // console.log("Enriched Cartid :", enrichedCartItems[0]?.cartId);

  // Handle quantity changes
  const handleQuantityChange = async (cartItemId, quantity) => {
    console.log("Updating cart item:", { cartItemId, quantity });

    try {
      // First update UI optimistically
      dispatch(updateQuantity({ productId: cartItemId, quantity }));

      // Get cartId from enrichedCartItems
      const cartId = enrichedCartItems[0]?.cartId || 3; // Fallback to 3 if not found

      // Make API call with query parameters
      const response = await api.put(
        `/cart-item/update?cartId=${cartId}&cartItemId=${cartItemId}&quantity=${quantity}`
      );
      console.log("Updated cart item:", response.data);

      if (response.status === 200) {
        dispatch(fetchCartItems());
        toast.success("Quantity updated successfully");
      }
      console.log("Update response:", response.data);
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error);
      // Revert the optimistic update on error
      const originalItem = cartItems.find((item) => item.id === cartItemId);
      if (originalItem) {
        dispatch(
          updateQuantity({
            productId: cartItemId,
            quantity: originalItem.quantity,
          })
        );
      }
      toast.error("Failed to update quantity");
    }
  };

  // Handle item removal
  const handleRemoveItem = async (cartItemId) => {
    try {
      // Get cartId from enrichedCartItems
      const cartId = enrichedCartItems[0]?.cartId || 3; // Fallback to 3 if not found

      // Make API call with query parameters
      const response = await api.delete(
        `/cart-item/delete?cartId=${cartId}&cartItemId=${cartItemId}`
      );

      if (response.status === 200) {
        dispatch(removeFromCart(cartItemId));
        dispatch(fetchCartItems()); // Refresh cart after deletion
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error);
      toast.error("Failed to remove item from cart");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {enrichedCartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add some products to your cart to see them here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {enrichedCartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <OrderSummary totalPrice={totalPrice} tax={tax} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
