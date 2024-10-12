'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@components/loader/select-loader';
import QuillLoader from '@components/loader/quill-loader';
import { Button, Input, Text, Title } from 'rizzui';
import cn from '@utils/class-names';
import { Form } from '@ui/form';
import { ProductVariationFormInput, productVariationFormSchema } from '@/validators/create-variation.schema';
import UploadZone from '@ui/file-upload/upload-zone';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// Attribute options
const attributeOptions = [
  {
    value: 'size',
    label: 'Size',
  },
  {
    value: 'color',
    label: 'Color',
  },
  {
    value: 'material',
    label: 'Material',
  },
];

function HorizontalFormBlockWrapper({
  title,
  description,
  children,
  className,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>) {
  return (
    <div className={cn(className)}>
      <div className="col-span-2 mb-6 pe-4">
        <Title as="h6" className="font-semibold">
          {title}
        </Title>
        <Text className="mt-1 text-sm text-gray-500">{description}</Text>
      </div>

      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5 col-span-4">
        {children}
      </div>
    </div>
  );
}

export default function CreateProductVariation({
  id,
  productVariation,
}: {
  id?: string;
  productVariation?: ProductVariationFormInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ProductVariationFormInput> = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createProductVariation data ->', data);
      setReset({
        name: '',
        description: '',
        images: '',
      });
    }, 600);
  };

  return (
    <Form<ProductVariationFormInput>
      validationSchema={productVariationFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: productVariation,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11">
              <HorizontalFormBlockWrapper
                title="Add New Product Variation:"
                description="Edit your product variation information from here"
              >
                <Input
                  label="Variation Name"
                  placeholder="variation name"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Controller
                  name="attribute"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={attributeOptions}
                      value={value}
                      onChange={onChange}
                      label="Attribute"
                      className="w-full @2xl:w-auto @2xl:flex-grow"
                      getOptionValue={(option) => option.value}
                    />
                  )}
                />
              </HorizontalFormBlockWrapper>
            </div>
          </div>

          <div className="sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col py-1">
            <Button variant="outline" className="w-full @xl:w-auto">
              Save as Draft
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {id ? 'Update' : 'Create'} Product Variation
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
