import { Controller, useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';
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
  } = useFormContext();

  return (
    <FormGroup
      title="Summary"
      description="Edit your product description and necessary information from here"
      className={classNames(className)}
    >
      <Input
        label="Name (English)"
        placeholder="Product name in English"
        {...register('name')}
        error={errors.name?.message as string}
      />
      <Input
        label="Name (Arabic)"
        placeholder="Product name in Arabic"
        {...register('name_ar')}
        error={errors.name_ar?.message as string}
      />
      <Input
        label="SKU"
        placeholder="Product sku"
        {...register('sku')}
        error={errors.sku?.message as string}
      />

      <Controller
        name="cat_id"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={categoryOptions}
            value={value}
            onChange={onChange}
            label="Categories"
            error={errors?.cat_id?.message as string}
            getOptionValue={(option) => option.value}
            inPortal={false}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Description (English)"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
          />
        )}
      />

      <Controller
        control={control}
        name="description_ar"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Description (Arabic)"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
          />
        )}
      />
    </FormGroup>
  );
}
