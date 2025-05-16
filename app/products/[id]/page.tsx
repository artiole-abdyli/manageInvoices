import ProductShowPage from "@/src/components/products/Products";

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductShowPage id={params.id} />;
}
