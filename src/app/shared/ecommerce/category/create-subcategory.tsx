import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input, Button, Select } from 'rizzui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Category {
  id: string;
  name: string;
}

interface SubcategoryFormProps {
  id?: string;
  subcategory?: any;
}

export default function EditSubcategory({ id, subcategory }: SubcategoryFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: subcategory?.name || '',
    Cat_id: subcategory?.Cat_id || '',
    discount: subcategory?.discount || '',
    expiration: subcategory?.expiration ? subcategory.expiration.split('T')[0] : '',
    name_ar: subcategory?.sub_category_translation?.find((t: any) => t.locale === 'ar')?.name || '',
    locale: 'ar',
  });

  const router = useRouter();

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

  useEffect(() => {
    if (subcategory) {
      const arabicTranslation = subcategory.sub_category_translation?.find((t: any) => t.locale === 'ar');
      setFormData({
        name: subcategory.name || '',
        Cat_id: subcategory.Cat_id || '',
        discount: subcategory.discount || '',
        expiration: subcategory.expiration ? subcategory.expiration.split('T')[0] : '',
        name_ar: arabicTranslation?.name || '',
        locale: arabicTranslation?.locale || 'ar',
      });
    }
  }, [subcategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      console.error("The event target is not an input element or lacks a 'name' attribute:", e.target);
    }
  };

  // Specifically handle Select change event
  const handleSelectChange = (selectedOption: any) => {
    setFormData((prevData) => ({
      ...prevData,
      Cat_id: selectedOption.value, // Only store the ID value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authorization token is missing');
        return;
      }

      console.log('Submitting payload:', formData);

      const payload = {
        ...formData,
        discount: formData.discount || null,
        expiration: formData.expiration || null,
      };

      if (id) {
        await axios.put(`${BASE_URL}/SubCategory/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success('Subcategory updated successfully');
      } else {
        toast.error('Subcategory ID is missing');
      }

      router.push('/ecommerce/categories');
    } catch (error) {
      console.error('Error saving subcategory:', error);
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
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <Input
          label="Subcategory Name"
          placeholder="Enter subcategory name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Select
          label="Parent Category"
          name="Cat_id"
          options={categories.map(category => ({ value: category.id, label: category.name }))}
          value={formData.Cat_id}
          onChange={(value) => handleSelectChange(value)} // Updated to handle select change
          required
        />
        <Input
          label="Discount"
          placeholder="Enter discount"
          name="discount"
          value={formData.discount}
          onChange={handleInputChange}
        />
        <Input
          label="Expiration Date"
          type="date"
          name="expiration"
          value={formData.expiration}
          onChange={handleInputChange}
        />
        <Input
          label="Subcategory Name (AR)"
          placeholder="Enter subcategory name in Arabic"
          name="name_ar"
          value={formData.name_ar}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Locale"
          placeholder="Enter locale"
          name="locale"
          value={formData.locale}
          onChange={handleInputChange}
          required
          disabled // Make this input read-only
        />
        <Button type="submit" isLoading={isLoading}>
          Update Subcategory
        </Button>
      </form>
    </>
  );
}
