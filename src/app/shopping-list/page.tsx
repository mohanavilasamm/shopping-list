"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import ClientLayout from "@/components/ui/client-layout";
import { useRouter } from "next/navigation";

// Types from generated API
import type { components as LocationComponents } from "@/lib/location-api";
import type { components as ProductComponents } from "@/lib/product-api";

type Store = LocationComponents["schemas"]["locations.location"];
type Product = ProductComponents["schemas"]["products.productModel"];

type ShoppingListItem = Product & { quantity: number };

export default function ShoppingListPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const router = useRouter();

  // On mount, read selected store from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedStore");
    if (stored) {
      try {
        setSelectedStore(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Fetch products as user types (debounced)
  useEffect(() => {
    if (!searchTerm || !selectedStore) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/proxy/products?term=${encodeURIComponent(searchTerm)}&locationId=${selectedStore.locationId}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.data || []);
        });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedStore]);

  // Add product to shopping list
  const addProduct = (product: Product) => {
    setShoppingList(prev => [
      ...prev,
      { ...product, quantity: 1 },
    ]);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ClientLayout>
        <div className="flex-1 relative">
          {/* Black background strip, extends halfway down */}
          <div className="absolute top-0 left-0 w-full h-40 bg-black z-0" />
          <div className="relative z-10 max-w-2xl mx-auto pt-32 pb-10 gap-8">
            {/* Store Card */}
            <Card className="w-full -mt-8 shadow-lg mb-8">
              <CardHeader>
                <CardTitle>
                  {selectedStore ? `Store: ${selectedStore.name}` : "Select a Store"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => router.push("/select-store")}>{selectedStore ? "Change Store" : "Select Store"}</Button>
              </CardContent>
            </Card>

            {/* Product Search/Input */}
            {selectedStore && (
              <Card className="w-full mt-4">
                <CardHeader>
                  <CardTitle>Add Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (searchTerm && searchResults.length === 0) {
                        // Add as custom product
                        addProduct({ description: searchTerm } as Product);
                      }
                    }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="product-search" className="sr-only">
                      Search or Add Product
                    </Label>
                    <Input
                      id="product-search"
                      placeholder="Search or add a product..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    {/* Show search results */}
                    {searchResults.length > 0 && (
                      <div className="border rounded bg-background mt-2 max-h-48 overflow-y-auto">
                        {searchResults.map(product => {
                            // Find the first image URL (front/medium preferred)
                            let imgUrl = undefined;
                            if (product.images && product.images.length > 0) {
                              const front = product.images.find(img => img.perspective === "front") || product.images[0];
                              if (front.sizes && front.sizes.length > 0) {
                                const medium = front.sizes.find(s => s.size === "medium") || front.sizes[0];
                                imgUrl = medium.url;
                              }
                            }
                            return (
                              <div
                                key={product.productId}
                                className="p-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                                onClick={() => addProduct(product)}
                              >
                                {imgUrl && (
                                  <div className="h-12 w-12 relative">
                                    <Image
                                      src={imgUrl || "/placeholder-product.png"}
                                      alt={product.description || "Product image"}
                                      fill
                                      className="object-contain rounded bg-white border"
                                      unoptimized={!imgUrl}
                                    />
                                  </div>
                                )}
                                <span>
                                  {product.description} {product.brand && <span className="text-xs text-muted-foreground">({product.brand})</span>}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                    <Button type="submit">Add</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Shopping List */}
            <div className="flex flex-col gap-4 mt-6">
              {shoppingList.length === 0 ? (
                <p className="text-muted-foreground text-center">No items in your shopping list.</p>
              ) : (
                shoppingList.map((item, idx) => (
                  <Card key={item.productId || idx}>
                    <CardHeader>
                      <CardTitle>{item.description}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-4 items-center">
                          <span>Aisle: {item.aisleLocations?.[0]?.number || "-"}</span>
                          <span>Tags: {item.categories?.join(", ") || "-"}</span>
                          <span>Price: ${item.items?.[0]?.price?.regular?.toFixed(2) || "-"}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline">Complete</Button>
                          <Button
                            variant="destructive"
                            onClick={() => setShoppingList(shoppingList.filter((_, i) => i !== idx))}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </ClientLayout>
      <footer className="w-full bg-black text-primary-foreground py-6 mt-10 text-center">
        <span className="opacity-70">&copy; 2025 Shopping List App</span>
      </footer>
    </div>
  );
} 