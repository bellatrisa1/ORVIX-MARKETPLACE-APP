import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import ProductPageClient from '@/components/ProductPageClient';
import { getProduct, getRelatedProducts } from '@/lib/products';

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
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const product = await getProduct(Number(id));
  if (!product) notFound();
  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id,
  );

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
