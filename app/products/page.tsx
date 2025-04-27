import React from "react";
import { Product, ProductList } from "@/src/components/products/ProductList";

const ProductsPage = async () => {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <ProductList />
    </main>
  );
};

export default ProductsPage;
