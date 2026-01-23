import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, RotateCcw, Trash2, ShoppingBag, Sparkles, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { useUploadDesign } from "@/hooks/useCustomize";
import { useTshirtTypes, useTshirtColors } from "@/hooks/useTshirtOptions";
import { useToast } from "@/hooks/use-toast";
import { ThreeShirtViewer } from "@/components/customizer/ThreeShirtViewer";
import api from "@/config/api";

const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const printLocations = [
  { id: "front", name: "Front" },
  { id: "back", name: "Back" },
];

const Customize = () => {
  const { designId } = useParams<{ designId?: string }>();
  const { data: tshirtTypes = [], isLoading: loadingTypes } = useTshirtTypes();
  const { data: tshirtColors = [], isLoading: loadingColors } = useTshirtColors();
  
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [printLocation, setPrintLocation] = useState("front");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageScale, setImageScale] = useState([1]);
  const [imageRotation, setImageRotation] = useState([0]);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingDesign, setIsLoadingDesign] = useState(!!designId);

  const { mutateAsync: uploadDesign, isPending: isUploading } = useUploadDesign();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load design if editing
  useEffect(() => {
    if (designId) {
      setIsLoadingDesign(true);
      api
        .get(`/customize/design/${designId}`)
        .then((res) => {
          const design = res.data;
          setSelectedSize(design.size || "");
          setPrintLocation(design.print_location || "front");
          setImageScale([design.image_scale || 1]);
          setImageRotation([design.image_rotation || 0]);
          setQuantity(design.quantity || 1);
          
          // Set uploaded image from design
          if (design.image_url) {
            setUploadedImage(design.image_url);
          }
          
          // Find and set type/color from database values
          if (design.tshirt_type && tshirtTypes.length > 0) {
            const type = tshirtTypes.find((t) => t.type_id === design.tshirt_type);
            if (type) setSelectedType(type);
          }
          if (design.tshirt_color && tshirtColors.length > 0) {
            const color = tshirtColors.find((c) => c.color_id === design.tshirt_color);
            if (color) setSelectedColor(color);
          }
          
          setIsLoadingDesign(false);
        })
        .catch((err) => {
          console.error("Failed to load design:", err);
          toast({
            title: "Error",
            description: "Failed to load design",
            variant: "destructive",
          });
          setIsLoadingDesign(false);
        });
    }
  }, [designId, tshirtTypes, tshirtColors, toast]);

  // Set defaults when data loads
  useEffect(() => {
    if (!selectedType && tshirtTypes.length > 0) {
      setSelectedType(tshirtTypes[0]);
    }
  }, [selectedType, tshirtTypes]);

  useEffect(() => {
    if (!selectedColor && tshirtColors.length > 0) {
      setSelectedColor(tshirtColors[0]);
    }
  }, [selectedColor, tshirtColors]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const clearImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setImageScale([1]);
    setImageRotation([0]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const printPrice = uploadedImage ? 10 : 0;
  const totalPrice = selectedType ? (selectedType.price + printPrice) * quantity : 0;

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
                <ThreeShirtViewer
                  colorHex={selectedColor?.hex_code}
                  logoUrl={uploadedImage}
                  printLocation={printLocation as "front" | "back"}
                  logoScale={imageScale[0]}
                  logoRotation={imageRotation[0]}
                />

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
                        selectedType?.id === type.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{type.name}</span>
                        {selectedType?.id === type.id && (
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
                  Color: <span className="font-normal">{selectedColor?.name || "Select a color"}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {tshirtColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor?.id === color.id
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color.hex_code }}
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
                    <span className="text-muted-foreground">{selectedType?.name || "Select a type"}</span>
                    <span>{selectedType ? `$${selectedType.price.toFixed(2)}` : "--"}</span>
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
                  disabled={!selectedSize || !selectedType || !selectedColor || isUploading}
                  onClick={async () => {
                    if (!selectedSize) {
                      toast({
                        title: "Error",
                        description: "Please select a size",
                        variant: "destructive",
                      });
                      return;
                    }

                    if (!selectedType || !selectedColor) {
                      toast({
                        title: "Error",
                        description: "Please choose a t-shirt type and color",
                        variant: "destructive",
                      });
                      return;
                    }

                    try {
                      // Create FormData for file upload
                      const formData = new FormData();
                      
                      // Add designId if editing
                      if (designId) {
                        formData.append("designId", designId);
                      }
                      
                      formData.append("tshirt_type", selectedType.type_id);
                      formData.append("tshirt_color", selectedColor.color_id);
                      formData.append("size", selectedSize);
                      formData.append("print_location", printLocation);
                      formData.append("quantity", quantity.toString());
                      formData.append("image_scale", imageScale[0].toString());
                      formData.append("image_rotation", imageRotation[0].toString());

                      // If there's a new uploaded file, add it to FormData
                      if (uploadedFile) {
                        formData.append("image", uploadedFile);
                      } else if (uploadedImage && designId) {
                        // If editing and no new file, pass existing image URL to backend
                        formData.append("existing_image_url", uploadedImage);
                      }

                      // Upload the custom design - this saves it to the database
                      const design = await uploadDesign(formData);

                      toast({
                        title: "Design saved!",
                        description: `Your custom ${selectedType.name} design has been saved. You can purchase it from your profile.`,
                      });

                      // Reset the form after a short delay
                      setTimeout(() => {
                        clearImage();
                        setSelectedSize("");
                        setQuantity(1);
                      }, 500);
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.response?.data?.error || "Failed to save design",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {isUploading ? "Saving..." : "Save Design"}
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
