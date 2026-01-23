import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    collection: string;
    colors: string[];
    sizes: string[];
    fit: string;
    isNew?: boolean;
    isBestseller?: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const { toast } = useToast();

  const handleAdd = async () => {
    const selected_size = product.sizes[0];
    const selected_color = product.colors[0];
    if (!selected_size || !selected_color) return;
    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
        selected_size,
        selected_color,
      });
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to wishlist!",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-4 product-image-zoom">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-coral text-primary-foreground border-0">New</Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-mint text-foreground border-0">Bestseller</Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-destructive text-destructive-foreground border-0">Sale</Badge>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full shadow-soft bg-background/90 backdrop-blur-sm hover:bg-coral hover:text-white transition-colors"
              onClick={handleWishlist}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              variant="hero"
              className="w-full"
              disabled={isPending || product.sizes.length === 0 || product.colors.length === 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
              }}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {isPending ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Link>
      
      <div className="space-y-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.fit}</p>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Color options preview */}
        <div className="flex gap-1 pt-2">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-border"
              style={{
                backgroundColor:
                  color === "white" ? "#fff" :
                  color === "black" ? "#1a1a1a" :
                  color === "gray" ? "#6B7280" :
                  color === "navy" ? "#1e3a5f" :
                  color === "sage" ? "#9DC183" :
                  color === "lavender" ? "#E6E6FA" :
                  color === "coral" ? "#FF7F50" :
                  color === "cream" ? "#FFFDD0" :
                  color === "pink" ? "#FFB6C1" :
                  color === "sky" ? "#87CEEB" :
                  color === "olive" ? "#808000" :
                  color === "charcoal" ? "#36454F" :
                  "#ccc"
              }}
              title={color}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
