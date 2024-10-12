'use client';

import { useEffect, useState } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import ProductsTable from '@/app/shared/ecommerce/product/product-list/table';
import ExportButton from '@/app/shared/export-button';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';

const pageHeader = {
  title: 'Products',
  breadcrumb: [
    { href: routes.eCommerce.dashboard, name: 'E-Commerce' },
    { href: routes.eCommerce.products, name: 'Products' },
    { name: 'List' },
  ],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/Product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const token = localStorage.getItem('token');

    try {
      await fetch(`${BASE_URL}/Product/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEdit = (product: any) => setEditingProduct(product);
  const handleSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={products} fileName="product_data" />
          <Button onClick={() => setEditingProduct({})}>
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Product
          </Button>
        </div>
      </PageHeader>

      {editingProduct ? (
        <CreateEditProduct
          product={editingProduct}
          id={editingProduct.id ? editingProduct.id.toString() : undefined}
          onSuccess={handleSuccess}
        />
      ) : (
        <ProductsTable
          data={products}
          isLoading={isLoading}
          error={error}
          onDeleteItem={handleDelete}
          onEditItem={handleEdit}
        />
      )}
    </>
  );
}
