"use client";

import React, { useEffect, useState } from 'react';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';

type ProductDetailsPageProps = {
  params: {
    slug: string;
  };
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  // Add other relevant fields based on your API response
};

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

      if (!BASE_URL) {
        setError('Base URL is not defined.');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const productUrl = `${BASE_URL}/Product/${params.slug}`;

      try {
        const response = await fetch(productUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Product = await response.json();
        setProduct(data);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else if (error instanceof Error) {
          setError(error.message);
          console.error('Error fetching product details:', error.message);
        } else {
          setError('An unexpected error occurred.');
          console.error('Error fetching product details:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();

    // Cleanup function to abort the fetch on unmount
    return () => {
      controller.abort();
    };
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p> {/* Simple Loading Text */}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-4">No product found.</div>;
  }

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
        name: product.name,
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProductDetails product={product} />
    </>
  );
}
