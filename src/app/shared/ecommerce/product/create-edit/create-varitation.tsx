import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from 'rizzui';

const CreateVariations = ({ onClose }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      variationName: '',
      variationValue: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Variation Data:', data);
    reset();
    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Create Variation</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="variationName"
          control={control}
          render={({ field }) => (
            <Input
              label="Variation Name"
              placeholder="Enter variation name"
              error={errors.variationName?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="variationValue"
          control={control}
          render={({ field }) => (
            <Input
              label="Variation Value"
              placeholder="Enter variation value"
              error={errors.variationValue?.message}
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

export default CreateVariations;
