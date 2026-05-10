import Link from 'next/link';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import CategoriesGrid from '@/components/CategoriesGrid';
import { getProducts } from '@/lib/products';

function formatCategoryTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const filteredProducts = products.filter(
    (product) => product.category === slug
  );
  const title = formatCategoryTitle(slug);

  return (
    <div className="page">
      <TopBar />
      <Header />

      <main className="main">
        <div className="container">
          <div className="category-page">
            <p className="category-page__breadcrumbs">
              <Link href="/">Главная</Link> / <span>{title}</span>
            </p>

            <div className="category-page__top">
              <div>
                <h1 className="category-page__title">{title}</h1>
                <p className="category-page__subtitle">
                  Найдено товаров: {filteredProducts.length}
                </p>
              </div>
            </div>

            <CategoriesGrid
              products={filteredProducts}
              isLoading={false}
              isError={false}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
