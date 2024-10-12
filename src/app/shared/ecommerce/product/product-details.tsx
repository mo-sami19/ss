'use client';

import React, { useEffect, useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';

export const metadata = {
  ...metaObject('Product Details'),
};

export default function ProductDetailsPage({ params }: any) {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

      const token = localStorage.getItem('token');
      const productUrl = `${BASE_URL}/Product/${params.slug}`;

      try {
        const response = await fetch(productUrl, {
          method: 'GET', // Ensure GET is allowed by the endpoint
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError('Failed to fetch product details');
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  const pageHeader = {
    title: 'Shop',
    breadcrumb: [
      {
        href: routes.eCommerce.dashboard,
        name: 'E-Commerce',
      },
      {
        href: routes.eCommerce.shop,
        name: 'Shop',
      },
      {
        name: product ? product.name : 'Loading...',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <ProductDetails product={product} />
      )}
    </>
  );
}
