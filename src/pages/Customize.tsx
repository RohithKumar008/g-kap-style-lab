import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, RotateCcw, ZoomIn, ZoomOut, Move, Trash2, ShoppingBag, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import tshirtMockup from "@/assets/tshirt-mockup.jpg";

const tshirtTypes = [
  { id: "regular", name: "Regular Fit", price: 29.99 },
  { id: "oversized", name: "Oversized", price: 34.99 },
  { id: "premium", name: "Premium Cotton", price: 39.99 },
  { id: "polo", name: "Polo", price: 44.99 },
  { id: "longsleeve", name: "Long Sleeve", price: 39.99 },
];

const tshirtColors = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "gray", name: "Gray", hex: "#6B7280" },
  { id: "navy", name: "Navy", hex: "#1e3a5f" },
  { id: "sage", name: "Sage", hex: "#9DC183" },
  { id: "coral", name: "Coral", hex: "#FF7F50" },
  { id: "lavender", name: "Lavender", hex: "#E6E6FA" },
  { id: "cream", name: "Cream", hex: "#FFFDD0" },
];

const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const printLocations = [
  { id: "front", name: "Front" },
  { id: "back", name: "Back" },
];

const Customize = () => {
  const [selectedType, setSelectedType] = useState(tshirtTypes[0]);
  const [selectedColor, setSelectedColor] = useState(tshirtColors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [printLocation, setPrintLocation] = useState("front");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState([1]);
  const [imageRotation, setImageRotation] = useState([0]);
  const [quantity, setQuantity] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const clearImage = () => {
    setUploadedImage(null);
    setImageScale([1]);
    setImageRotation([0]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const printPrice = uploadedImage ? 10 : 0;
  const totalPrice = (selectedType.price + printPrice) * quantity;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-mesh py-12 md:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-light text-lavender-foreground text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Design Your Own</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Customize Your <span className="text-gradient-primary">T-Shirt</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Perfect for creators, startups, college events, merch drops, and gifts.
            Upload your logo and see it come to life.
          </motion.p>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Preview Panel */}
            <div className="space-y-6">
              <div className="sticky top-24">
                {/* Main Preview */}
                <div 
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-large"
                  style={{ backgroundColor: selectedColor.hex === "#FFFFFF" ? "#f5f5f5" : selectedColor.hex }}
                >
                  {/* T-shirt image with color overlay effect */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-md">
                      <img
                        src={tshirtMockup}
                        alt="T-shirt mockup"
                        className="w-full h-auto"
                        style={{ 
                          filter: selectedColor.id === "white" ? "none" : 
                                  selectedColor.id === "black" ? "brightness(0.2)" :
                                  `sepia(1) saturate(0) brightness(${selectedColor.id === "navy" ? 0.3 : 0.8})`
                        }}
                      />
                      
                      {/* Uploaded Design */}
                      {uploadedImage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div 
                            className="w-1/2 h-1/2 flex items-center justify-center"
                            style={{
                              transform: `scale(${imageScale[0]}) rotate(${imageRotation[0]}deg)`,
                              marginTop: printLocation === "front" ? "-10%" : "0"
                            }}
                          >
                            <img
                              src={uploadedImage}
                              alt="Your design"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Print location indicator */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm font-medium">
                    {printLocation === "front" ? "Front View" : "Back View"}
                  </div>
                </div>

                {/* Print Location Toggle */}
                <div className="flex gap-2 mt-4">
                  {printLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setPrintLocation(loc.id)}
                      className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                        printLocation === loc.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-display font-bold text-lg mb-4">Upload Your Design</h3>
                
                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-semibold mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, SVG up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                        <img
                          src={uploadedImage}
                          alt="Uploaded design"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Design uploaded</p>
                        <p className="text-sm text-muted-foreground">+$10.00 for custom print</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearImage}>
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    </div>

                    {/* Image Controls */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Size</label>
                          <span className="text-sm text-muted-foreground">{Math.round(imageScale[0] * 100)}%</span>
                        </div>
                        <Slider
                          value={imageScale}
                          onValueChange={setImageScale}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Rotation</label>
                          <span className="text-sm text-muted-foreground">{imageRotation[0]}°</span>
                        </div>
                        <Slider
                          value={imageRotation}
                          onValueChange={setImageRotation}
                          min={-180}
                          max={180}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        setImageScale([1]);
                        setImageRotation([0]);
                      }}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Position
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* T-shirt Type */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-display font-bold text-lg mb-4">T-Shirt Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {tshirtTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedType.id === type.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{type.name}</span>
                        {selectedType.id === type.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">${type.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-display font-bold text-lg mb-4">
                  Color: <span className="font-normal">{selectedColor.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {tshirtColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor.id === color.id
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg">Size</h3>
                  <a href="/size-guide" className="text-sm text-primary hover:underline">
                    Size Guide
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 rounded-lg border font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display font-bold text-lg">Quantity</h3>
                    <p className="text-sm text-muted-foreground">Bulk orders get discounts!</p>
                  </div>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="space-y-2 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{selectedType.name}</span>
                    <span>${selectedType.price.toFixed(2)}</span>
                  </div>
                  {uploadedImage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Custom Print</span>
                      <span>+$10.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span>×{quantity}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-display font-bold text-xl">Total</span>
                  <span className="font-display font-bold text-2xl text-gradient-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={!selectedSize}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                {!selectedSize && (
                  <p className="text-sm text-destructive mt-2 text-center">
                    Please select a size
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Customize;
