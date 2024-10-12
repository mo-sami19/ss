import { useFormContext } from 'react-hook-form';
import { Input ,Controller } from 'rizzui';
import classNames from 'classnames';
import FormGroup from '@/app/shared/form-group';
import dynamic from 'next/dynamic';
import SelectLoader from '@components/loader/select-loader';
import QuillLoader from '@components/loader/quill-loader';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});

const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

interface ProductSummaryProps {
  className?: string;
  categoryOptions: { value: string; label: string }[];
  typeOptions: { value: string; label: string }[];
}

export default function ProductSummary({
  className,
  categoryOptions = [],
  typeOptions = [],
}: ProductSummaryProps) {
  const {
    register,
    control,
    formState: { errors },
    watch
  } = useFormContext();

  // Watch the English fields to populate the Arabic hidden fields
  const englishName = watch('title.en');
  const englishDescription = watch('description.en');

  return (
    <FormGroup
      title="Summary"
      description="Edit your product description and necessary information from here"
      className={classNames(className)}
    >
      {/* English Fields */}
      <Input
        label="Name (English)"
        placeholder="Product name in English"
        {...register('title.en')}
        error={errors.title?.en?.message as string}
      />
      <Input
        label="Description (English)"
        placeholder="Product description in English"
        {...register('description.en')}
        error={errors.description?.en?.message as string}
      />

      {/* Arabic Fields */}
      <Input
        label="Name (Arabic)"
        placeholder="Product name in Arabic"
        {...register('title.ar')}
        error={errors.title?.ar?.message as string}
      />
      <Input
        label="Description (Arabic)"
        placeholder="Product description in Arabic"
        {...register('description.ar')}
        error={errors.description?.ar?.message as string}
      />

      <Input
        label="SKU"
        placeholder="Product SKU"
        {...register('sku')}
        error={errors.sku?.message as string}
      />

      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            dropdownClassName="!z-0"
            options={typeOptions}
            value={value}
            onChange={onChange}
            label="Product Type"
            error={errors?.type?.message as string}
            getOptionValue={(option) => option.value}
          />
        )}
      />

      <Controller
        name="categories"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={categoryOptions}
            value={value}
            onChange={onChange}
            label="Categories"
            error={errors?.categories?.message as string}
            getOptionValue={(option) => option.value}
            inPortal={false}
          />
        )}
      />
    </FormGroup>
  );
}
