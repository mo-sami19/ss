'use client';

import { useState } from 'react';
import { PiXBold, PiEyeBold, PiEyeSlashBold, PiCopyBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select } from 'rizzui';
import { CreateUserInput, createUserSchema } from '@/validators/create-user.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { permissions, roles, statuses } from '@/app/shared/roles-permissions/utils';
import { registerUser } from '@/utils/api'; // Ensure this is imported

export default function CreateUser() {
  const { closeModal } = useModal(); // Using the custom hook
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const generateRandomPassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const passwordLength = 12;
    let generatedPassword = "";
    for (let i = 0, n = charset.length; i < passwordLength; ++i) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(generatedPassword);
    return generatedPassword;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Password copied to clipboard!");
    }, (err) => {
      alert("Failed to copy the password!");
    });
  };

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    const formattedData = {
      ...data,
      password: password,
      createdAt: new Date(),
    };
    setLoading(true);

    try {
      const response = await registerUser({
        name: formattedData.fullName,
        email: formattedData.email,
        phone_number: formattedData.phone_number, // Ensure this field is included in your form schema
        password: formattedData.password,
        role: formattedData.role,
      });
      console.log('User registered successfully:', response);
      setReset({
        fullName: '',
        email: '',
        phone_number: '',
        role: '',
        status: '',
        password: '',
      });
      closeModal();
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CreateUserInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={createUserSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, setValue, watch, formState: { errors } }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Add a new User
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>
            <Input
              label="Full Name"
              placeholder="Enter user's full name"
              {...register('fullName')}
              className="col-span-full"
              error={errors.fullName?.message}
            />

            <Input
              label="Email"
              placeholder="Enter user's Email Address"
              className="col-span-full"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Phone Number"
              placeholder="Enter user's Phone Number"
              className="col-span-full"
              {...register('phone_number')}
              error={errors.phone_number?.message}
            />

            <div className="relative col-span-full">
              <Input
                label="Password"
                placeholder="Enter user's Password"
                type={showPassword ? "text" : "password"}
                className="col-span-full"
                {...register('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password?.message}
              />
              <ActionIcon
                size="sm"
                variant="text"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <PiEyeSlashBold className="h-auto w-5" />
                ) : (
                  <PiEyeBold className="h-auto w-5" />
                )}
              </ActionIcon>
            </div>

            <div className="col-span-full flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const generatedPassword = generateRandomPassword();
                  setValue('password', generatedPassword);
                  setPassword(generatedPassword);
                }}
                className="w-full @xl:w-auto"
              >
                Generate Password
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(password)}
                className="w-full @xl:w-auto"
              >
                <PiCopyBold className="mr-2" />
                Copy Password
              </Button>
            </div>

            <Controller
              name="role"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={roles}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Role"
                  className="col-span-full"
                  error={errors?.role?.message}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    roles.find((option) => option.value === selected)?.label ??
                    selected
                  }
                  dropdownClassName="!z-[1]"
                  inPortal={false}
                />
              )}
            />

            

            <div className="col-span-full flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full @xl:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full @xl:w-auto"
              >
                Create User
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
