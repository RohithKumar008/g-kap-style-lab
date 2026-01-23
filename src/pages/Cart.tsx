import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: cartItems = [], isLoading, error } = useCart();
  const { mutateAsync: updateItem } = useUpdateCartItem();
  const { mutateAsync: removeItem } = useRemoveFromCart();
  const { mutateAsync: clearCart } = useClearCart();

  if (authLoading) {
    return (
      <Layout>
        <div className="section-container py-20 text-center text-muted-foreground">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-display font-bold mb-4">Please Log In</h1>
            <p className="text-muted-foreground mb-8">You need to be logged in to view your cart</p>
            <Link to="/login">
              <Button variant="hero" size="xl">Log In</Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const normalized = cartItems.map((item) => {
    const p = item.products;
    return {
      id: item.id,
      productId: item.product_id,
      name: p?.name ?? "Item",
      image: p?.image_url ?? "https://via.placeholder.com/300x400?text=Product",
      price: p?.price ?? 0,
      fit: p?.fit ?? "",
      selectedSize: item.selected_size,
      selectedColor: item.selected_color,
      quantity: item.quantity,
    };
  });

  const subtotal = normalized.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <Layout>
        <div className="section-container py-20 text-center text-muted-foreground">Loading cart...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="section-container py-20 text-center text-destructive">Failed to load cart.</div>
      </Layout>
    );
  }

  if (normalized.length === 0) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet</p>
            <Link to="/shop">
              <Button variant="hero" size="xl">Start Shopping</Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleUpdateQty = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    await updateItem({ id, quantity });
  };

  const handleRemove = async (id: string) => {
    await removeItem(id);
  };

  return (
    <Layout>
      <div className="section-container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {normalized.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-2xl shadow-soft"
              >
                <Link
                  to={`/product/${item.productId}`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted shrink-0"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/product/${item.productId}`} className="font-semibold hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-2 font-semibold min-w-[40px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="pt-4 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button variant="ghost">
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="outline" onClick={() => clearCart()}>Clear Cart</Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>

              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-display font-bold border-t pt-3 mt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button className="w-full mt-6" size="lg">
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-4">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
