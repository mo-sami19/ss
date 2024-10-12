// /src/app/ecommerce/categories/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CreateCategory from '@/app/shared/ecommerce/category/create-category';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EditCategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<CategoryFormInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Category/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const categoryData = response.data;
        const arabicTranslation = categoryData.translation.find(
          (t: any) => t.locale === 'ar'
        ) || { name: '', description: '' };

        setCategory({
          ...categoryData,
          arabicName: arabicTranslation.name,
          arabicDescription: arabicTranslation.description,
        });
      } catch (error) {
        console.error('Failed to fetch category:', error);
        toast.error('Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return <CreateCategory id={id} category={category} isModalView={false} />;
};

export default EditCategoryPage;
