import React, { useEffect, lazy, Suspense } from "react";
import { Layout } from "../components/common/Layout/Layout";
import { Herosection } from "../components/Homepage/Herosection/Herosection";
import { SortProduct } from "../components/Homepage/ShortProducts/SortProduct";
import { ProductsRange200607 } from "../components/Homepage/ProductsRange/ProductsRange200-607";
import { Productsection } from "../components/Homepage/ProductsSection/Productsection";
import { Footer } from "../components/common/Footer/Footer";

// Lazy-load all below-the-fold sections to reduce TBT
const Becomeseller = lazy(() => import("./Becomeseller"));
const New = lazy(() => import("./New"));

export const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout>
      <Herosection />
      <SortProduct />
      <ProductsRange200607 />
     
      <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
        <Becomeseller/>
        <New />
      </Suspense>
       
    </Layout>
  );
};