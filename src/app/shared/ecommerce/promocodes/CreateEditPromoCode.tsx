'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Checkbox, Input, Title } from 'rizzui'; // Import rizzui components
import cn from '@utils/class-names'; // Utility for classNames

interface PromoCodeData {
  id?: string;
  code: string;
  discount: string;
  expiryDate: string;
  freeShipping?: boolean;
}

const CreateEditPromoCode = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the promo code ID from the URL
  const [promoCode, setPromoCode] = useState<PromoCodeData>({
    code: '',
    discount: '',
    expiryDate: '',
    freeShipping: false,
  });
  const [isEditing, setIsEditing] = useState<boolean>(!!id); // Check if we are editing
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for form submission

  useEffect(() => {
    if (id) {
      // Fetch existing promo code data if editing
      const fetchData = async () => {
        const fetchedData: PromoCodeData = {
          code: 'SUMMER21',
          discount: '20%',
          expiryDate: '2021-08-31',
          freeShipping: true, // Mock data for free shipping
        };
        setPromoCode(fetchedData);
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // Update promo code logic
        console.log('Updating promo code:', promoCode);
        // Replace with actual API call
      } else {
        // Create promo code logic
        console.log('Creating promo code:', promoCode);
        // Replace with actual API call
      }
    } catch (error) {
      console.error('Error handling form submission:', error);
    } finally {
      setIsLoading(false);
      router.push('/ecommerce/promo-codes');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="isomorphic-form flex flex-grow flex-col @container p-4">
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">Promo Code</Title>
        <Input
          label="Promo Code"
          placeholder="Enter promo code"
          value={promoCode.code}
          onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value })}
          className="w-full"
          required
        />
      </div>
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">Discount</Title>
        <Input
          label="Discount"
          placeholder="Enter discount percentage or amount"
          value={promoCode.discount}
          onChange={(e) => setPromoCode({ ...promoCode, discount: e.target.value })}
          className="w-full"
          required
        />
      </div>
      <div className="mb-6">
        <Title as="h6" className="font-semibold mb-2">Expiry Date</Title>
        <Input
          label="Expiry Date"
          type="date"
          value={promoCode.expiryDate}
          onChange={(e) => setPromoCode({ ...promoCode, expiryDate: e.target.value })}
          className="w-full"
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <Checkbox
          checked={promoCode.freeShipping}
          onChange={(e) => setPromoCode({ ...promoCode, freeShipping: e.target.checked })}
          className="mr-2"
        />
        <span>Free Shipping</span>
      </div>
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Update Promo Code' : 'Create Promo Code'}
        </Button>
      </div>
    </form>
  );
};

export default CreateEditPromoCode;
