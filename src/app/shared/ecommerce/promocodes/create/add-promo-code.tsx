'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateEditPromoCode() {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to save promo code
    console.log({ code, discount, expiryDate });
    router.push('/ecommerce/promo-codes');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Promo Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Discount</label>
        <input
          type="text"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
