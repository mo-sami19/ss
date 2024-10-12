// app/actions.ts
'use server'

import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createCategory(data: any, token: string) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(`${BASE_URL}/Category`, data, { headers });
    console.log('POST Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, data: any, token: string) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.put(`${BASE_URL}/Category/${id}`, data, { headers });
    console.log('PUT Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}
