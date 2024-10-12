'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';
import { Button, Input, Title } from 'rizzui';

// Define the structure of a Product
interface Product {
  id: number;
  sku: string;
  name: string;
}

// Define the structure of the Sales Data
interface SalesData {
  id?: string;
  X: number; // Buy (X) as number
  Y: number; // Get (Y) as number
  expiration: string;
  Products: number[]; // Array of product IDs
}

const CreateEditSales = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the sales entry ID from the URL
  const [salesData, setSalesData] = useState<SalesData>({
    X: 0,
    Y: 0,
    expiration: '',
    Products: [],
  });
  const [isEditing] = useState<boolean>(!!id); // Determine if editing based on presence of id
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for form submission
  const [productsList, setProductsList] = useState<Product[]>([]); // List of products
  const [selectedProducts, setSelectedProducts] = useState<{ value: number; label: string }[]>([]); // Selected products for react-select

  // Base URL from environment variables
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error('Token not found in local storage');
        alert('Authentication token missing. Please log in again.');
        router.push('/login'); // Redirect to login if token is missing
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/Product`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const productList: Product[] = response.data.map((product: any) => ({
          id: product.id,
          sku: product.sku,
          name: product.name,
        }));
        setProductsList(productList);
      } catch (error: any) {
        console.error(
          'Error fetching products:',
          error.response ? error.response.data : error.message
        );
        alert(
          `Error fetching products: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchProducts();
  }, [BASE_URL, router]);

  // Fetch existing sales data if editing
  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error('Token not found in local storage');
        alert('Authentication token missing. Please log in again.');
        router.push('/login'); // Redirect to login if token is missing
        return;
      }

      if (isEditing && id) {
        try {
          const response = await axios.get(`${BASE_URL}/BuyXGetY/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const fetchedData = response.data;

          setSalesData({
            X: Number(fetchedData.X),
            Y: Number(fetchedData.Y),
            expiration: fetchedData.expiration,
            Products: fetchedData.Products
              ? fetchedData.Products.map((p: any) => p.id)
              : [],
          });

          // Set selected products for react-select without including sku
          const selectedOptions = fetchedData.Products
            ? fetchedData.Products.map((p: any) => ({
                value: p.id,
                label: `${p.sku} - ${p.name}`,
              }))
            : [];
          setSelectedProducts(selectedOptions);
        } catch (error: any) {
          console.error(
            'Error fetching sales data:',
            error.response ? error.response.data : error.message
          );
          alert(
            `Error fetching sales data: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      }
    };

    fetchSalesData();
  }, [isEditing, id, BASE_URL, router]);

  // Handle changes in product selection
  const handleProductChange = (selectedOptions: any) => {
    const selectedProducts = selectedOptions || [];
    setSelectedProducts(selectedProducts);

    const productIds = selectedProducts.map((option: any) => option.value);
    setSalesData({ ...salesData, Products: productIds });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate that at least one product is selected
    if (!salesData.Products || salesData.Products.length === 0) {
      alert('Please select at least one product.');
      setIsLoading(false);
      return;
    }

    // Construct the payload with only product IDs mapped to 'sku' key
    const salesPayload = {
      X: salesData.X,
      Y: salesData.Y,
      expiration: salesData.expiration,
      Products: salesData.Products.map((id) => ({ sku: id })), // Map 'id' to 'sku' key
    };

    console.log('Submitting sales payload:', salesPayload); // Debugging: Inspect the payload

    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      console.error('Token not found in local storage');
      alert('Authentication token missing. Please log in again.');
      setIsLoading(false);
      router.push('/login'); // Redirect to login if token is missing
      return;
    }

    try {
      if (isEditing) {
        // Update sales entry logic (PUT request)
        await axios.put(`${BASE_URL}/BuyXGetY/${id}`, salesPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Sales entry updated:', salesPayload); // Debugging
        alert('Sales entry updated successfully!');
      } else {
        // Create sales entry logic (POST request)
        await axios.post(`${BASE_URL}/BuyXGetY`, salesPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Sales entry created:', salesPayload); // Debugging
        alert('Sales entry created successfully!');
      }

      // Redirect after successful submission
      router.push('/ecommerce/sales');
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error submitting sales data:', error.response.data);
        alert(
          `Error: ${
            error.response.data.message ||
            'An error occurred while submitting the form.'
          }`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        alert('Error: No response from the server.');
      } else {
        // Something else caused the error
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="isomorphic-form flex flex-grow flex-col @container p-4"
    >
      {/* Buy (X) Field */}
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">
          Buy (X)
        </Title>
        <Input
          label="Buy (X)"
          placeholder="Enter the number of items to buy"
          type="number"
          value={salesData.X}
          onChange={(e) =>
            setSalesData({ ...salesData, X: Number(e.target.value) })
          }
          className="w-full"
          required
        />
      </div>

      {/* Get (Y) Field */}
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">
          Get (Y)
        </Title>
        <Input
          label="Get (Y)"
          placeholder="Enter the number of items to get"
          type="number"
          value={salesData.Y}
          onChange={(e) =>
            setSalesData({ ...salesData, Y: Number(e.target.value) })
          }
          className="w-full"
          required
        />
      </div>

      {/* Expiration Date Field */}
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">
          Expiration Date
        </Title>
        <Input
          label="Expiration Date"
          type="date"
          value={salesData.expiration}
          onChange={(e) =>
            setSalesData({ ...salesData, expiration: e.target.value })
          }
          className="w-full"
          required
        />
      </div>

      {/* Select Products Field */}
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">
          Select Products
        </Title>
        <Select
          isMulti
          options={productsList.map((product) => ({
            value: product.id,
            label: `${product.sku} - ${product.name}`,
          }))}
          value={selectedProducts}
          onChange={handleProductChange}
          placeholder="Search and select products"
          className="w-full"
          isClearable
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Update Sale' : 'Create Sale'}
        </Button>
      </div>
    </form>
  );
};

export default CreateEditSales;
