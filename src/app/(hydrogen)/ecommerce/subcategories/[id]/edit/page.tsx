'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CreateSubcategory from '@/app/shared/ecommerce/category/create-subcategory'; // Component to handle subcategory creation/editing
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EditSubcategoryPage = () => {
  const { id } = useParams();
  const [subcategory, setSubcategory] = useState<any | null>(null);
  const [categories, setCategories] = useState([]); // State to hold parent categories
  const [loading, setLoading] = useState(true);

  // Fetch subcategory data
  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authorization token found');
          return;
        }

        const response = await axios.get(`${BASE_URL}/SubCategory/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch subcategory: ${response.statusText}`);
        }

        const subcategoryData = response.data;
        const arabicTranslation = subcategoryData.subCategoryTranslation?.find(
          (t: any) => t.locale === 'ar'
        ) || { name: '' };

        setSubcategory({
          ...subcategoryData,
          name_ar: arabicTranslation.name,
        });
      } catch (error) {
        console.error('Failed to fetch subcategory:', error);
        if (axios.isAxiosError(error) && error.response) {
          toast.error(`Failed to fetch subcategory: ${error.response.data?.message || error.message}`);
        } else {
          toast.error('Failed to fetch subcategory');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubcategory();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Fetch parent categories for assignment
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authorization token is missing');
          return;
        }

        const response = await axios.get(`${BASE_URL}/Category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          toast.error('Unexpected data format from categories API');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <CreateSubcategory
      id={id}
      subcategory={subcategory}
      categories={categories} // Pass categories to the subcategory component
      isModalView={false}
    />
  );
};

export default EditSubcategoryPage;
