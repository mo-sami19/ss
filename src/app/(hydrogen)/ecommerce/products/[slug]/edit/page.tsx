// src/app/(hydrogen)/ecommerce/products/[slug]/edit/EditProductClient.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'rizzui';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';



const pageHeader = {
  title: 'Edit Product',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.products,
      name: 'Products',
    },
    {
      name: 'Edit',
    },
  ],
};

export default function EditProductClient({ slug }: EditProductClientProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/Product/${slug}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routes.eCommerce.createProduct} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Product
          </Button>
        </Link>
      </PageHeader>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <CreateEditProduct id={slug} product={product} />
      )}
    </>
  );
}
