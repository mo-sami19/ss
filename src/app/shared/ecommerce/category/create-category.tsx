'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input, Button, Text, Title } from 'rizzui';
import { toast, ToastContainer } from 'react-toastify';
import cn from 'classnames';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';

const QuillEditor = dynamic(() => import('@ui/quill-editor'), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface CreateCategoryProps {
  id?: string;
  category?: any;
  isModalView?: boolean;
}

export default function CreateCategory({ id, category, isModalView = true }: CreateCategoryProps) {
  const [isLoading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    Active: category?.Active || '',
    name_ar: category?.name_ar || '',
    description_ar: category?.description_ar || '',
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let response;

      const payload = { ...categoryData };
      if (id) {
        response = await axios.put(`${BASE_URL}/Category/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success('Category updated successfully');
      } else {
        response = await axios.post(`${BASE_URL}/Category`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success('Category created successfully');
      }

      setCategoryData({ name: '', description: '', Active: '', name_ar: '', description_ar: '' });
      router.push('/ecommerce/categories');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Failed to save: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Failed to save');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleFormSubmit} className="isomorphic-form flex flex-grow flex-col @container">
        <div className="flex-grow pb-10">
          <div
            className={cn(
              'grid grid-cols-1 ',
              isModalView
                ? 'grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11'
                : 'gap-5'
            )}
          >
            <div>
              <Title as="h6" className="font-semibold">
                {id ? 'Edit Category' : 'Create Category'}
              </Title>
              <div className="mt-1 text-sm text-gray-500">
                {id ? 'Update the category details.' : 'Fill in the details to create a new category.'}
              </div>
            </div>

            <Input
              label="Category Name"
              placeholder="Category name"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
            />
            <Input
              label="Category Name (AR)"
              placeholder="Category Name (AR)"
              name="name_ar"
              value={categoryData.name_ar}
              onChange={handleInputChange}
            />
            <Input
              label="Active"
              placeholder="Active"
              name="Active"
              value={categoryData.Active}
              onChange={handleInputChange}
            />
            <QuillEditor
              value={categoryData.description}
              onChange={(value) => setCategoryData({ ...categoryData, description: value })}
              label="Description"
              className="[&>.ql-container_.ql-editor]:min-h-[100px]"
              labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            />
            <QuillEditor
              value={categoryData.description_ar}
              onChange={(value) => setCategoryData({ ...categoryData, description_ar: value })}
              label="Description (AR)"
              className="[&>.ql-container_.ql-editor]:min-h-[100px]"
              labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            />
          </div>
        </div>

        <div
          className={cn(
            'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
            isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
          )}
        >
          <Button type="submit" isLoading={isLoading} className="w-full @xl:w-auto">
            {id ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </>
  );
}
