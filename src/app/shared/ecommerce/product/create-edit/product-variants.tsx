'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Input, Button, ActionIcon } from 'rizzui';
import cn from '@utils/class-names';
import FormGroup from '@/app/shared/form-group';
import {
  variantOption,
  productVariants as defaultProductVariants,
} from '@/app/shared/ecommerce/product/create-edit/form-utils';
import TrashIcon from '@components/icons/trash';
import SelectLoader from '@components/loader/select-loader';
import { PiPlusBold } from 'react-icons/pi';
import Modal from './Modal'; // Importing Modal from the same directory
import CreateAttributes from './create-attributes';
import CreateVariations from './create-varitation';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function ProductVariants({ className }: { className?: string }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productVariants',
  });

  // State to manage modal visibility
  const [isAttributeModalOpen, setAttributeModalOpen] = useState(false);
  const [isVariationModalOpen, setVariationModalOpen] = useState(false);

  const openAttributeModal = () => {
    setAttributeModalOpen(true);
  };

  const closeAttributeModal = () => {
    setAttributeModalOpen(false);
  };

  const openVariationModal = () => {
    setVariationModalOpen(true);
  };

  const closeVariationModal = () => {
    setVariationModalOpen(false);
  };

  const addDefaultVariations = () => {
    append([...defaultProductVariants]);
  };

  console.log('fields', fields);

  return (
    <>
      <FormGroup
        title="Variant Options"
        description="Add your product variants here"
        className={cn(className)}
      >
        {fields.map((item, index) => (
          <div key={item.id} className="col-span-full flex gap-4 xl:gap-7">
            <Controller
              name={`productVariants.${index}.name`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  dropdownClassName="!z-0"
                  options={variantOption}
                  value={value}
                  onChange={onChange}
                  label="Variant Name"
                  className="w-full @2xl:w-auto @2xl:flex-grow"
                  getOptionValue={(option) => option.value}
                />
              )}
            />
            <Input
              type="number"
              label="Variant Value"
              placeholder="150.00"
              className="flex-grow"
              prefix={'$'}
              {...register(`productVariants.${index}.value`)}
            />
            {fields.length > 1 && (
              <ActionIcon
                onClick={() => remove(index)}
                variant="flat"
                className="mt-7 shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </ActionIcon>
            )}
          </div>
        ))}
        <Button
          onClick={addDefaultVariations}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variation
        </Button>
        <Button
          onClick={openVariationModal}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Create Variations
        </Button>
        <Button
          onClick={openAttributeModal}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Create Attributes
        </Button>
      </FormGroup>
      {isVariationModalOpen && (
        <Modal isOpen={isVariationModalOpen} onClose={closeVariationModal}>
          <CreateVariations onClose={closeVariationModal} />
        </Modal>
      )}
      {isAttributeModalOpen && (
        <Modal isOpen={isAttributeModalOpen} onClose={closeAttributeModal}>
          <CreateAttributes onClose={closeAttributeModal} />
        </Modal>
      )}
    </>
  );
}
