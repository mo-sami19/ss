'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryTable from '@/app/shared/ecommerce/category/category-list/table';
import CategoryPageHeader from './category-page-header';
import { routes } from '@/config/routes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const pageHeader = {
  title: 'Categories',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.categories,
      name: 'Categories',
    },
    {
      name: 'List',
    },
  ],
};

const CategoriesPage: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/Category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error response data:', error.response.data);
          setError(`Failed to fetch categories: ${error.response.data.message}`);
        } else {
          console.error('Error:', error.message);
          setError('Failed to fetch categories');
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteItem = (id: string) => {
    setData(data.filter((category) => category.id !== id));
  };

  const handleEditItem = (id: string, updatedData: object) => {
    setData(data.map((category) => (category.id === id ? { ...category, ...updatedData } : category)));
  };

  const handleHeaderCellClick = (value: string) => {
    // Handle sorting logic here
  };

  return (
    <>
      <ToastContainer />
      <CategoryPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <CategoryTable
        data={data}
        isLoading={isLoading}
        error={error}
        onDeleteItem={handleDeleteItem}
        onEditItem={handleEditItem}
        onHeaderCellClick={handleHeaderCellClick}
      />
    </>
  );
};

export default CategoriesPage;
