import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useDeleteDesign } from "@/hooks/useCustomize";
import { useCreateOrder } from "@/hooks/useOrders";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface CustomDesign {
  id: string;
  image_url: string;
  tshirt_type: string;
  tshirt_color: string;
  size: string;
  quantity: number;
  print_location: string;
  image_scale: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [designToBuy, setDesignToBuy] = useState<CustomDesign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync: deleteDesign } = useDeleteDesign();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { data: cartItems = [] } = useCart();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem('designToBuy');
    if (stored) {
      setDesignToBuy(JSON.parse(stored));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Normalize cart items to get price from products relationship
  const normalizedCartItems = cartItems.map((item) => {
    const p = item.products;
    return {
      id: item.id,
      product_id: item.product_id,
      name: p?.name ?? "Item",
      price: p?.price ?? 0,
      selected_size: item.selected_size,
      selected_color: item.selected_color,
      quantity: item.quantity,
      image: p?.image_url ?? "",
    };
  });

  // Price for custom design
  const designPrice = 49.99;
  const subtotal = designToBuy 
    ? designPrice * (designToBuy.quantity || 1) 
    : normalizedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = shippingMethod === "express" ? 14.99 : 0;
  const tax = (subtotal + shipping) * 0.08;
  const total = subtotal + shipping + tax;

  const handleConfirmation = async () => {
    setIsProcessing(true);
    try {
      // Prepare order data
      const orderData = {
        items: designToBuy 
          ? [{
              product_id: null, // No product_id for custom designs
              quantity: designToBuy.quantity,
              size: designToBuy.size,
              color: designToBuy.tshirt_color,
              price: designPrice,
              design_id: designToBuy.id // Include design_id for tracking
            }]
          : normalizedCartItems.map(item => ({ 
              product_id: item.product_id, 
              quantity: item.quantity,
              size: item.selected_size,
              color: item.selected_color,
              price: item.price
            })),
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        shipping_method: shippingMethod,
        payment_method: "credit_card",
        subtotal,
        shipping_cost: shipping,
        tax,
        total,
      };

      console.log("Creating order with data:", orderData);

      // Create order in database
      await createOrder(orderData);

      // Delete the design if it was a custom design purchase
      if (designToBuy?.id) {
        try {
          await deleteDesign(designToBuy.id);
        } catch (error) {
          console.error("Error deleting design:", error);
        }
      }

      // Clear the localStorage
      localStorage.removeItem('designToBuy');

      toast({
        title: "Order Placed!",
        description: "Your order has been successfully created and saved.",
      });

      // Navigate to confirmation
      setStep("confirmation");
    } catch (error: any) {
      console.error("Error placing order:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to place order. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "confirmation") {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-mint-light flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-mint" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We've sent a confirmation email to your inbox.
            </p>
            <p className="font-semibold mb-8">Order #GK-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={designToBuy ? "/profile" : "/shop"}>
                <Button variant="hero">
                  {designToBuy ? "Back to Profile" : "Continue Shopping"}
                </Button>
              </Link>
              <Button variant="outline">Track Order</Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to={designToBuy ? "/profile" : "/cart"} className="text-muted-foreground hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            {designToBuy ? "Back to Profile" : "Back to Cart"}
          </Link>
        </nav>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              1
            </div>
            <span className="hidden sm:inline font-medium">Shipping</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              2
            </div>
            <span className="hidden sm:inline font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display font-bold text-xl mb-6">
                    <Truck className="w-5 h-5 inline mr-2" />
                    Shipping Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="123 Main Street" value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" value={formData.city} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" value={formData.state} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" value={formData.zip} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="United States" value={formData.country} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display font-bold text-xl mb-6">Shipping Method</h2>
                  
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <div>
                          <p className="font-medium">Standard Shipping</p>
                          <p className="text-sm text-muted-foreground">5-7 business days</p>
                        </div>
                      </div>
                      <span className="font-semibold text-mint">FREE</span>
                    </label>
                    
                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <div>
                          <p className="font-medium">Express Shipping</p>
                          <p className="text-sm text-muted-foreground">2-3 business days</p>
                        </div>
                      </div>
                      <span className="font-semibold">$14.99</span>
                    </label>
                  </RadioGroup>
                </div>

                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={() => setStep("payment")}
                >
                  Continue to Payment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display font-bold text-xl mb-6">
                    <CreditCard className="w-5 h-5 inline mr-2" />
                    Payment Information
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" value={formData.cardName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-lg">🔒</span>
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep("shipping")}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="xl"
                    className="flex-1"
                    onClick={handleConfirmation}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>

              {designToBuy ? (
                <>
                  {/* Custom Design Summary */}
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      {designToBuy.image_url && (
                        <img
                          src={designToBuy.image_url}
                          alt="Custom design"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <Badge className="mb-2 bg-mint text-foreground">Custom Design</Badge>
                        <p className="font-medium text-sm capitalize">
                          {designToBuy.tshirt_type} - {designToBuy.tshirt_color}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size: {designToBuy.size} • Qty: {designToBuy.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-2">${designPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 mb-6">
                  {normalizedCartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.selected_size} • Color: {item.selected_color}
                        </p>
                        <p className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                          {item.quantity > 1 && ` (${item.quantity}x)`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
