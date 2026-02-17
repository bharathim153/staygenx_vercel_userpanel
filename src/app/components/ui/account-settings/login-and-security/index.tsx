'use client';
import TabsComponent from '@/shadcn/ui/tabs';
import { useState } from 'react';
import UpdatePasswordForm from './passwordform';
import Button from '@/shadcn/ui/Button';

export default function LoginSecurity() {
  const [Password, setpassword] = useState(false);
  const tabData = [
    {
      label: 'Login',
      value: 'login',
      content: (
        <div className="flex flex-col gap-10">
          <div className="space-y-6">
            <h2 className="text-[22px] font-semibold">Login</h2>

            <div className=" border-y border-gray-200 py-4">
              <div className=" flex items-center justify-between">
                <div className="w-full">
                  <div className="  flex justify-between">
                    <p className=" text-[16px] font-semibold">Password</p>
                    <Button
                      onClick={() => setpassword(!Password)}
                      className=" text-sm font-medium text-black underline hover:text-gray-800"
                    >
                      {Password ? 'Cancel' : 'Update'}
                    </Button>
                  </div>
                  {!Password ? (
                    <p className="text-sm text-gray-500">Last updated</p>
                  ) : (
                    <UpdatePasswordForm
                      onSuccess={() => setpassword(!Password)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[22px] font-semibold">Social accounts</h2>

            <div className="border-y border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className=" text-[16px] font-semibold">Google</p>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
                <Button className="text-sm font-medium text-black underline hover:text-gray-800">
                  Disconnect
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[22px] font-semibold">Account</h2>

            <div className="border-y border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className=" text-[16px] font-semibold">
                    Deactivate your account
                  </p>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
                <Button className="text-sm font-medium text-black underline hover:text-gray-800">
                  Diactivate
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Login & security</h1>

      <TabsComponent
        tabs={tabData}
        defaultValue="login"
        className="w-full"
        justify="justify-start"
      />
    </div>
  );
}
