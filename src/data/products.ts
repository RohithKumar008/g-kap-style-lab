import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export interface Product {
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
}

export const products: Product[] = [
  {
    id: "1",
    name: "Geometric Motion Tee",
    price: 39.99,
    originalPrice: 49.99,
    image: product1,
    category: "regular",
    collection: "startup",
    colors: ["white", "black", "gray"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fit: "Regular Fit",
    isNew: true
  },
  {
    id: "2",
    name: "Sakura Dreams Oversized",
    price: 54.99,
    image: product2,
    category: "oversized",
    collection: "anime",
    colors: ["black", "navy"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fit: "Oversized",
    isBestseller: true
  },
  {
    id: "3",
    name: "Sage Essential",
    price: 44.99,
    image: product3,
    category: "premium",
    collection: "minimal",
    colors: ["sage", "white", "cream"],
    sizes: ["S", "M", "L", "XL"],
    fit: "Regular Fit"
  },
  {
    id: "4",
    name: "Abstract Flow",
    price: 49.99,
    image: product4,
    category: "regular",
    collection: "abstract",
    colors: ["lavender", "pink", "sky"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fit: "Regular Fit",
    isNew: true
  },
  {
    id: "5",
    name: "Tokyo Nights",
    price: 59.99,
    image: product2,
    category: "oversized",
    collection: "anime",
    colors: ["black", "charcoal"],
    sizes: ["S", "M", "L", "XL"],
    fit: "Oversized",
    isBestseller: true
  },
  {
    id: "6",
    name: "Hustle Mode",
    price: 42.99,
    originalPrice: 52.99,
    image: product1,
    category: "regular",
    collection: "startup",
    colors: ["white", "black"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fit: "Regular Fit"
  },
  {
    id: "7",
    name: "Minimal Mark",
    price: 47.99,
    image: product3,
    category: "premium",
    collection: "minimal",
    colors: ["white", "black", "olive"],
    sizes: ["S", "M", "L", "XL"],
    fit: "Premium Cotton"
  },
  {
    id: "8",
    name: "Dream Haze",
    price: 44.99,
    image: product4,
    category: "regular",
    collection: "abstract",
    colors: ["lavender", "coral"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fit: "Regular Fit"
  }
];

export const categories = [
  { id: "all", name: "All Products" },
  { id: "regular", name: "Regular Fit" },
  { id: "oversized", name: "Oversized / Baggy" },
  { id: "premium", name: "Premium Cotton" },
  { id: "polo", name: "Polo" },
  { id: "fullsleeve", name: "Full Sleeve" }
];

export const collections = [
  { id: "all", name: "All Collections" },
  { id: "anime", name: "Anime Inspired" },
  { id: "streetwear", name: "Streetwear" },
  { id: "minimal", name: "Minimal Logos" },
  { id: "startup", name: "Startup / Hustle" },
  { id: "abstract", name: "Abstract Art" }
];

export const colorOptions = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "gray", name: "Gray", hex: "#6B7280" },
  { id: "navy", name: "Navy", hex: "#1e3a5f" },
  { id: "sage", name: "Sage", hex: "#9DC183" },
  { id: "cream", name: "Cream", hex: "#FFFDD0" },
  { id: "lavender", name: "Lavender", hex: "#E6E6FA" },
  { id: "pink", name: "Pink", hex: "#FFB6C1" },
  { id: "sky", name: "Sky Blue", hex: "#87CEEB" },
  { id: "coral", name: "Coral", hex: "#FF7F50" },
  { id: "olive", name: "Olive", hex: "#808000" },
  { id: "charcoal", name: "Charcoal", hex: "#36454F" }
];

export const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const sortOptions = [
  { id: "popular", name: "Most Popular" },
  { id: "newest", name: "Newest First" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" }
];
