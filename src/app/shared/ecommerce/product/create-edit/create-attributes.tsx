import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from 'rizzui';

const CreateAttributes = ({ onClose }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      attributeName: '',
      attributeValue: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Attribute Data:', data);
    reset();
    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Create Attribute</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="attributeName"
          control={control}
          render={({ field }) => (
            <Input
              label="Attribute Name"
              placeholder="Enter attribute name"
              error={errors.attributeName?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="attributeValue"
          control={control}
          render={({ field }) => (
            <Input
              label="Attribute Value"
              placeholder="Enter attribute value"
              error={errors.attributeValue?.message}
              {...field}
            />
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAttributes;
