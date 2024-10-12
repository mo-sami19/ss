import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Checkbox, Select, Text, Title } from 'rizzui';
import { toast, ToastContainer } from 'react-toastify';
import cn from 'classnames';
import 'react-toastify/dist/ReactToastify.css';
import QuillEditor from '@ui/quill-editor';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CreateEditForm({ id, category, subcategory, isModalView = true, onClose }) {
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    Active: '',
    discount: '',
    expiration: '',
    Cat_id: '',
    name_ar: '',
    description_ar: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        Active: category.Active || '',
        name_ar: category.translation?.find(t => t.locale === 'ar')?.name || '',
        description_ar: category.translation?.find(t => t.locale === 'ar')?.description || '',
      });
    }

    if (subcategory) {
      setFormData({
        name: subcategory.name || '',
        discount: subcategory.discount || '',
        expiration: subcategory.expiration || '',
        Cat_id: subcategory.Cat_id || '',
        name_ar: subcategory.translation?.find(t => t.locale === 'ar')?.name || '',
      });
    }

    axios.get(`${BASE_URL}/Category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => setCategories(response.data))
      .catch(error => toast.error('Failed to load categories'));
  }, [category, subcategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = category ? `${BASE_URL}/Category/${id}` : `${BASE_URL}/SubCategory/${id}`;
      const method = id ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success(`${category ? 'Category' : 'Subcategory'} ${id ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      toast.error(`Failed to save: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-grow flex-col">
      <ToastContainer />
      <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200">
        <Input
          label={`${category ? 'Category' : 'Subcategory'} Name`}
          placeholder={`${category ? 'Category' : 'Subcategory'} name`}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Name (AR)"
          placeholder="Name (AR)"
          name="name_ar"
          value={formData.name_ar}
          onChange={handleInputChange}
        />
        {category && (
          <>
            <Input
              label="Active"
              placeholder="Active"
              name="Active"
              value={formData.Active}
              onChange={handleInputChange}
            />
            <QuillEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              label="Description"
            />
            <QuillEditor
              value={formData.description_ar}
              onChange={(value) => setFormData({ ...formData, description_ar: value })}
              label="Description (AR)"
            />
          </>
        )}
        {subcategory && (
          <>
            <Input
              label="Discount"
              placeholder="Discount"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
            />
            <Input
              label="Expiration Date"
              placeholder="Expiration Date"
              name="expiration"
              type="date"
              value={formData.expiration}
              onChange={handleInputChange}
            />
            <Select
              label="Parent Category"
              options={categories.map((category) => ({ value: category.id, label: category.name }))}
              value={formData.Cat_id}
              onChange={(value) => setFormData({ ...formData, Cat_id: value })}
            />
          </>
        )}
      </div>
      <Button type="submit" isLoading={isLoading} className="mt-6 w-full">
        {id ? 'Update' : 'Create'} {category ? 'Category' : 'Subcategory'}
      </Button>
    </form>
  );
}
