import React, { useState } from 'react';
import { Button, Tooltip, ActionIcon, Badge, Progressbar, Text } from 'rizzui';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
import DeletePopover from '@/app/shared/delete-popover';
import axios from 'axios';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit/index'; // Import the form component

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: string;
  Atstock: number;
  status: string;
}

interface SimpleTableProps {
  data: Product[];
  isLoading: boolean;
  error: string | null;
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string, updatedData: object) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const SimpleTable: React.FC<SimpleTableProps> = ({ data, isLoading, error, onDeleteItem }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const editProduct = async (id: string, updatedData: object) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No authentication token found');
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/Product/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Update response:', response.data);
      alert('Product updated successfully');
      setEditingProduct(null); // Reset editing mode
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(`Failed to update product: ${error.response.data.message}`);
      } else {
        console.error('Error:', error.message);
        alert('Failed to update product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Set the selected product for editing
  };

  const getStatusBadge = (status: string | undefined) => {
    const safeStatus = status ? status.toLowerCase() : 'unknown';

    switch (safeStatus) {
      case 'pending':
        return (
          <div className="flex items-center">
            <Badge color="warning" renderAsDot />
            <Text className="ms-2 font-medium text-orange-dark">{safeStatus}</Text>
          </div>
        );
      case 'publish':
        return (
          <div className="flex items-center">
            <Badge color="success" renderAsDot />
            <Text className="ms-2 font-medium text-green-dark">{safeStatus}</Text>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Badge renderAsDot className="bg-gray-400" />
            <Text className="ms-2 font-medium text-gray-600">{safeStatus}</Text>
          </div>
        );
    }
  };

  const getStockStatus = (Atstock: number) => {
    if (Atstock === 0) {
      return (
        <>
          <Progressbar
            value={Atstock}
            color="danger"
            label="Out of stock"
            className="h-1.5 w-24 bg-red/20"
          />
          <Text className="pt-1.5 text-[13px] text-gray-500">Out of stock</Text>
        </>
      );
    } else if (Atstock <= 0) {
      return (
        <>
          <Progressbar
            value={Atstock}
            color="warning"
            label="Low stock"
            className="h-1.5 w-24 bg-orange/20"
          />
          <Text className="pt-1.5 text-[13px] text-gray-500">{Atstock} low stock</Text>
        </>
      );
    } else {
      return (
        <>
          <Progressbar
            value={Atstock}
            color="success"
            label="Stock available"
            className="h-1.5 w-24 bg-green/20"
          />
          <Text className="pt-1.5 text-[13px] text-gray-500">{Atstock} in stock</Text>
        </>
      );
    }
  };

  return (
    <div>
      {editingProduct && (
        <CreateEditProduct
          id={editingProduct.id}
          product={editingProduct}
          onSubmit={(updatedData: object) => editProduct(editingProduct.id, updatedData)}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap">EGP{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStockStatus(product.Atstock)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(product.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Tooltip content="Edit Product" placement="top">
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        aria-label="Edit Product"
                        onClick={() => handleEdit(product)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip content="View Product" placement="top">
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        aria-label="View Product"
                        onClick={() => console.log(`Viewing product ${product.id}`)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </ActionIcon>
                    </Tooltip>
                    <DeletePopover
                      title="Delete the product"
                      description={`Are you sure you want to delete this product #${product.id}?`}
                      onDelete={() => onDeleteItem(product.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimpleTable;
