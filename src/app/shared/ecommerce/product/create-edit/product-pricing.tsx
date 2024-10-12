import { useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';
import FormGroup from '@/app/shared/form-group';

export default function ProductPricing({ className }: { className?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Pricing"
      description="Edit your product pricing information"
      className={className}
    >
      <Input
        label="Price"
        placeholder="10.00"
        {...register('price')}
        error={errors.price?.message as string}
        prefix={'$'}
        type="number"
      />
      <Input
        label="Sale Price"
        placeholder="12.00"
        {...register('salePrice')}
        error={errors.salePrice?.message as string}
        prefix={'$'}
        type="number"
      />
      <Input
        label="Cost Price"
        placeholder="15.00"
        {...register('costPrice')}
        error={errors.costPrice?.message as string}
        prefix={'$'}
        type="number"
      />
      <Input
        label="Price After Discount"
        placeholder="10.00"
        {...register('priceAfterDiscount')}
        error={errors.priceAfterDiscount?.message as string}
        prefix={'$'}
        type="number"
      />
    </FormGroup>
  );
}
