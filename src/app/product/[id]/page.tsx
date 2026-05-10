import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import ProductPageClient from '@/components/ProductPageClient';
import { getProducts } from '@/lib/products';

function formatCategoryTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getProducts();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="page">
        <TopBar />
        <Header />
        <main className="main">
          <div className="container">
            <div className="products-state">Товар не найден.</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="product-page">
            <p className="product-page__breadcrumbs">
              <Link href="/">Главная</Link> /{' '}
              <Link href={`/category/${product.category}`}>
                {formatCategoryTitle(product.category)}
              </Link>{' '}
              / <span>{product.title}</span>
            </p>

            <ProductPageClient
              product={product}
              relatedProducts={relatedProducts}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
