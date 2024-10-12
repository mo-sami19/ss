'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Text, Title, Select } from 'rizzui';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import UploadZone from '@ui/file-upload/upload-zone';

// Dynamically import QuillEditor for SSR safety
const QuillEditor = dynamic(() => import('@ui/quill-editor'), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Category {
  id: number;
  name: string;
  subcategory: SubCategory[];
}

interface SubCategory {
  id: number;
  Cat_id: string;
  name: string;
  discount: string;
  expiration: string;
}

interface Tag {
  id: number;
  name: string;
}

interface CreateEditProductProps {
  id?: string;
  product?: any;
}

interface Variant {
  size: string;
  sku: string;
  stock: string;
}

const availableSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']; // Available sizes for selection

export default function CreateEditProduct({ id, product }: CreateEditProductProps) {
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(product?.tag_id?.toString() || null);
  const [productVariants, setProductVariants] = useState<Variant[]>(product?.variants || []);
  const [selectedSize, setSelectedSize] = useState<string>(''); // Size selected by the user

  const [formData, setFormData] = useState({
    name_en: product?.name || '',
    name_ar: product?.product_translations?.find((trans: any) => trans.locale === 'ar')?.name || '',
    slug: product?.slug || '',
    sku: product?.sku || '',
    price: product?.price || '',
    SalePrice: product?.SalePrice || '',
    CostPrice: product?.CostPrice || '',
    PriceAfterDiscount: product?.PriceAfterDiscount || '',
    description_en: product?.description || '',
    description_ar:
      product?.product_translations?.find((trans: any) => trans.locale === 'ar')?.description || '',
    AtStock: product?.AtStock || '',
    cat_id: product?.cat_id || '',
    sub_cat_id: product?.sub_cat_id || '',
    productImages:
      product?.product_image?.map((image: any) => `https://partspluseg.com/${image.image}`) || [],
    sizeimage: product?.image ? `https://partspluseg.com/${product.image}` : null,
  });

  const router = useRouter();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Tag`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Failed to fetch tags');
      }
    };
    fetchTags();
  }, []);

  // Update subCategories based on selected category
  useEffect(() => {
    if (formData.cat_id) {
      const selectedCategory = categories.find((cat) => String(cat.id) === String(formData.cat_id));
      if (selectedCategory) {
        setSubCategories(selectedCategory.subcategory);
      } else {
        setSubCategories([]);
      }
      // Reset subcategory selection
      setFormData((prevData) => ({
        ...prevData,
        sub_cat_id: '',
      }));
    } else {
      setSubCategories([]);
      setFormData((prevData) => ({
        ...prevData,
        sub_cat_id: '',
      }));
    }
  }, [formData.cat_id, categories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    name: string,
    selectedOption: { value: string | number; label: string }
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption.value,
    }));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const updatedVariants = productVariants.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    );
    setProductVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    if (selectedSize && !productVariants.some((v) => v.size === selectedSize)) {
      setProductVariants([...productVariants, { size: selectedSize, sku: '', stock: '' }]);
      setSelectedSize('');
    } else if (!selectedSize) {
      toast.error('Please select a size before adding a variant.');
    } else {
      toast.error('This size has already been added as a variant.');
    }
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = productVariants.filter((_, i) => i !== index);
    setProductVariants(updatedVariants);
  };

  const handleTagChange = (selectedOption: { value: string | number; label: string }) => {
    setSelectedTag(selectedOption.value.toString());
  };

  const validateFormData = () => {
    const newErrors: any = {};

    if (!formData.name_en) newErrors.name_en = ['Name in English is required.'];
    if (!formData.name_ar) newErrors.name_ar = ['Name in Arabic is required.'];
    if (!formData.slug) newErrors.slug = ['Slug is required.'];
    if (!formData.sku) newErrors.sku = ['SKU is required.'];
    if (!formData.price) newErrors.price = ['Price is required.'];
    if (!formData.cat_id) newErrors.cat_id = ['Category is required.'];
    if (!formData.sub_cat_id) newErrors.sub_cat_id = ['Subcategory is required.'];
    if (!formData.sizeimage) newErrors.sizeimage = ['Size image is required.'];
    if (formData.productImages.length === 0)
      newErrors.productImages = ['At least one product image is required.'];
    productVariants.forEach((variant, index) => {
      if (!variant.sku) {
        if (!newErrors.productVariants) newErrors.productVariants = {};
        newErrors.productVariants[index] = {
          ...newErrors.productVariants[index],
          sku: ['SKU is required for each variant.'],
        };
      }
      if (!variant.stock) {
        if (!newErrors.productVariants) newErrors.productVariants = {};
        newErrors.productVariants[index] = {
          ...newErrors.productVariants[index],
          stock: ['Stock is required for each variant.'],
        };
      }
    });

    return newErrors;
  };

  async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    let isSuccess = false; // Flag to track success

    try {
      const payload = new FormData();

      // Convert sizeimage to File if it's a URL
      let sizeimageFile = formData.sizeimage;
      if (typeof formData.sizeimage === 'string' && formData.sizeimage.startsWith('http')) {
        sizeimageFile = await urlToFile(formData.sizeimage, 'sizeimage.jpg', 'image/jpeg');
      }

      // Convert productImages URLs to Files
      const productImagesFiles = await Promise.all(
        formData.productImages.map(async (image) => {
          if (typeof image === 'string' && image.startsWith('http')) {
            const filename = image.substring(image.lastIndexOf('/') + 1);
            return await urlToFile(image, filename, 'image/jpeg');
          } else if (image instanceof File) {
            return image;
          } else {
            return null;
          }
        })
      );

      // Append form data
      payload.append('name_en', formData.name_en);
      payload.append('name_ar', formData.name_ar);
      payload.append('slug', formData.slug);
      payload.append('sku', formData.sku);
      payload.append('price', formData.price);
      payload.append('SalePrice', formData.SalePrice);
      payload.append('CostPrice', formData.CostPrice);
      payload.append('PriceAfterDiscount', formData.PriceAfterDiscount);
      payload.append('description_en', formData.description_en);
      payload.append('description_ar', formData.description_ar);
      payload.append('AtStock', formData.AtStock);
      payload.append('cat_id', String(formData.cat_id));
      payload.append('sub_cat_id', String(formData.sub_cat_id));
      payload.append('tag_id', selectedTag || '');

      productVariants.forEach((variant, index) => {
        payload.append(`ProductVariants[${index}][sku]`, variant.sku);
        payload.append(`ProductVariants[${index}][size]`, variant.size);
        payload.append(`ProductVariants[${index}][stock]`, variant.stock);
      });

      if (sizeimageFile instanceof File) {
        payload.append('sizeimage', sizeimageFile);
      }

      productImagesFiles.forEach((file, index) => {
        if (file instanceof File) {
          payload.append(`images[${index}]`, file);
        }
      });

      // Make API request
      const response = id
        ? await axios.post(`${BASE_URL}/Product/${id}?_method=PUT`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        : await axios.post(`${BASE_URL}/Product`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });

      // Check for backend validation errors even if the request was successful
      if (response.data.errors && Object.keys(response.data.errors).length > 0) {
        setErrors(response.data.errors);
        toast.error('Please fix the errors in the form.');
      } else {
        isSuccess = true; // Set success flag
        toast.success(`Product ${id ? 'updated' : 'created'} successfully`, {
          onClose: () => router.refresh(), // Reload the page after the toast closes
          autoClose: 3000, // Duration the toast is visible (in ms)
        });
      }
    } catch (error: any) {
      console.error('Error:', error.response ? error.response.data : error); // Log the error response
      if (error.response && error.response.data && error.response.data.errors) {
        // Assuming the backend sends validation errors in this format
        setErrors(error.response.data.errors);
        toast.error('Please fix the errors in the form.');
      } else {
        toast.error('Failed to save product');
      }
    } finally {
      setLoading(false); // Ensure loading is false regardless of success or error
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleFormSubmit}>
        <HorizontalFormBlockWrapper
          title="Product Information"
          description="Edit your product information here"
        >
          <Input
            label="Name (English)"
            placeholder="Product name"
            name="name_en"
            value={formData.name_en}
            onChange={handleInputChange}
            error={errors.name_en?.[0]}
          />
          <Input
            label="Name (Arabic)"
            placeholder="Product name in Arabic"
            name="name_ar"
            value={formData.name_ar}
            onChange={handleInputChange}
            error={errors.name_ar?.[0]}
          />
          <Input
            label="Slug"
            placeholder="Product slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            error={errors.slug?.[0]}
          />
          <Input
            label="SKU"
            placeholder="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            error={errors.sku?.[0]}
          />
          <Select
            label="Category"
            name="cat_id"
            value={formData.cat_id}
            onChange={(selectedOption) => handleSelectChange('cat_id', selectedOption)}
            options={categories.map((category) => ({
              value: String(category.id),
              label: category.name,
            }))}
            error={errors.cat_id?.[0]}
          />
          <Select
            label="Subcategory"
            name="sub_cat_id"
            value={formData.sub_cat_id}
            onChange={(selectedOption) => handleSelectChange('sub_cat_id', selectedOption)}
            options={subCategories.map((subCategory) => ({
              value: String(subCategory.id),
              label: subCategory.name,
            }))}
            error={errors.sub_cat_id?.[0]}
            disabled={!formData.cat_id || subCategories.length === 0} // Disable until a category is selected or if no subcategories
          />
          <Select
            label="Tag"
            value={selectedTag}
            onChange={handleTagChange}
            options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
            placeholder="Select a tag"
          />
        </HorizontalFormBlockWrapper>

        {/* Pricing and Product Variants Sections */}
        <HorizontalFormBlockWrapper title="Pricing" description="Set your product pricing here">
          <Input
            label="Price"
            placeholder="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            type="number"
            error={errors.price?.[0]}
          />
          <Input
            label="Sale Price"
            placeholder="Sale Price"
            name="SalePrice"
            value={formData.SalePrice}
            onChange={handleInputChange}
            type="number"
            error={errors.SalePrice?.[0]}
          />
          <Input
            label="Cost Price"
            placeholder="Cost Price"
            name="CostPrice"
            value={formData.CostPrice}
            onChange={handleInputChange}
            type="number"
            error={errors.CostPrice?.[0]}
          />
          <Input
            label="Price After Discount"
            placeholder="Price After Discount"
            name="PriceAfterDiscount"
            value={formData.PriceAfterDiscount}
            onChange={handleInputChange}
            type="number"
            error={errors.PriceAfterDiscount?.[0]}
          />
          <Input
            label="At Stock"
            placeholder="At Stock"
            name="AtStock"
            value={formData.AtStock}
            onChange={handleInputChange}
            type="number"
            error={errors.AtStock?.[0]}
          />
        </HorizontalFormBlockWrapper>

        {/* Variants and Images Sections */}
        <HorizontalFormBlockWrapper
          title="Product Variants"
          description="Add variants (size, SKU, stock)"
        >
          <div className="col-span-full grid grid-cols-2 gap-3">
            <Select
              label="Select Size"
              value={selectedSize}
              onChange={(selectedOption) => setSelectedSize(selectedOption.value)}
              options={availableSizes.map((size) => ({ value: size, label: size }))}
              placeholder="Select size"
            />
            <Button type="button" onClick={handleAddVariant} disabled={isLoading}>
              Add Variant
            </Button>
          </div>

          {productVariants.length > 0 && (
            <div className="col-span-full grid grid-cols-1 gap-4">
              {productVariants.map((variant, index) => (
                <div key={index} className="variant-row flex items-center gap-3">
                  <Text className="w-20">{variant.size}</Text>
                  <Input
                    label="SKU"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    error={errors.productVariants?.[index]?.sku?.[0]}
                  />
                  <Input
                    label="Stock"
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                    error={errors.productVariants?.[index]?.stock?.[0]}
                  />
                  <Button type="button" onClick={() => handleRemoveVariant(index)} disabled={isLoading}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </HorizontalFormBlockWrapper>

        <HorizontalFormBlockWrapper
          title="Product Description"
          description="Describe your product"
        >
          <QuillEditor
            value={formData.description_en}
            onChange={(value) => setFormData({ ...formData, description_en: value })}
            label="Description (English)"
          />
          <QuillEditor
            value={formData.description_ar}
            onChange={(value) => setFormData({ ...formData, description_ar: value })}
            label="Description (Arabic)"
          />
        </HorizontalFormBlockWrapper>

        <HorizontalFormBlockWrapper
          title="Size Image"
          description="Upload size image for your product"
        >
          {formData.sizeimage && (
            <div className="relative mb-4">
              <img
                src={
                  typeof formData.sizeimage === 'string'
                    ? formData.sizeimage
                    : URL.createObjectURL(formData.sizeimage)
                }
                alt="Size Image"
                className="max-w-full h-auto"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, sizeimage: null });
                }}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                aria-label="Remove size image"
              >
                &times;
              </button>
            </div>
          )}
          <UploadZone
            className="col-span-full"
            name="sizeimage"
            setValue={(name, value) => setFormData({ ...formData, sizeimage: value[0] })}
            error={errors.sizeimage?.[0]}
            accept="image/*"
            multiple={false}
          />
        </HorizontalFormBlockWrapper>

        <HorizontalFormBlockWrapper
          title="Upload Images"
          description="Upload images for your product"
        >
          {formData.productImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {formData.productImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Product Image ${index + 1}`}
                    className="max-w-full h-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = [...formData.productImages];
                      updatedImages.splice(index, 1);
                      setFormData({ ...formData, productImages: updatedImages });
                    }}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    aria-label={`Remove product image ${index + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <UploadZone
            className="col-span-full"
            name="productImages"
            setValue={(name, value) =>
              setFormData({ ...formData, productImages: [...formData.productImages, ...value] })
            }
            error={errors.productImages?.[0]}
            accept="image/*"
            multiple={true}
          />
        </HorizontalFormBlockWrapper>

        <div className="sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur p-4">
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {id ? 'Update' : 'Create'} Product
          </Button>
        </div>
      </form>
    </>
  );
}

function HorizontalFormBlockWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="col-span-full mb-6">
        <Title as="h6" className="font-semibold">
          {title}
        </Title>
        <Text className="mt-1 text-sm text-gray-500">{description}</Text>
      </div>
      <div className="col-span-full grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
