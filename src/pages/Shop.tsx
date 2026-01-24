import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { categories, collections, colorOptions, sizeOptions, sortOptions } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: apiProducts = [], isLoading, error } = useProducts();

  // Normalize API products to the existing card shape
  const products = useMemo(() => {
    return apiProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      image: p.images?.[0]?.image_url || '/placeholder-product.svg',
      images: p.images || [],
      category: p.category,
      collection: p.collection,
      colors: p.colors || [],
      sizes: p.sizes || [],
      fit: p.fit,
      isNew: p.is_new,
      isBestseller: p.is_bestseller,
    }));
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Collection filter
    if (selectedCollection !== "all") {
      result = result.filter((p) => p.collection === selectedCollection);
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result = result.filter((p) => p.isBestseller).concat(result.filter((p) => !p.isBestseller));
    }

    return result;
  }, [products, selectedCategory, selectedCollection, selectedColors, selectedSizes, sortBy]);

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((c) => c !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCollection("all");
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedCollection !== "all" ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-display font-semibold mb-3">T-Shirt Type</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div>
        <h4 className="font-display font-semibold mb-3">Collection</h4>
        <div className="space-y-2">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCollection === col.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-display font-semibold mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              onClick={() => toggleColor(color.id)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColors.includes(color.id)
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-display font-semibold mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-mesh py-16 md:py-24">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
          >
            Shop <span className="text-gradient-primary">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Premium custom-printed T-shirts designed for creators, dreamers, and doers
          </motion.p>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-lg">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <p className="text-sm text-muted-foreground">
                    {isLoading ? "Loading products..." : `${filteredProducts.length} products`}
                  </p>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory !== "all" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className="gap-1"
                    >
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  {selectedCollection !== "all" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedCollection("all")}
                      className="gap-1"
                    >
                      {collections.find((c) => c.id === selectedCollection)?.name}
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  {selectedColors.map((color) => (
                    <Button
                      key={color}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleColor(color)}
                      className="gap-1"
                    >
                      {colorOptions.find((c) => c.id === color)?.name}
                      <X className="w-3 h-3" />
                    </Button>
                  ))}
                  {selectedSizes.map((size) => (
                    <Button
                      key={size}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleSize(size)}
                      className="gap-1"
                    >
                      Size {size}
                      <X className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className="text-center py-16 text-muted-foreground">Loading products...</div>
              ) : error ? (
                <div className="text-center py-16 text-destructive">
                  Failed to load products. Please check the backend.
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products match your filters
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
