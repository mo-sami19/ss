import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const registerUser = async (userData: {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}) => {
  const response = await fetch(`${BASE_URL}/api/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  return response.json();
};

export const fetchProductList = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/Product/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product list');
  }

  return response.json();
};
 // src/utils/api.ts





// Function to add a new product
export const addProduct = async (productData) => {
  const response = await axios.post(BASE_URL, productData);
  return response.data;
};

// Function to edit an existing product
export const editProduct = async (slug, productData) => {
  const response = await axios.put(`${BASE_URL}/Product${slug}`, productData);
  return response.data;
};
