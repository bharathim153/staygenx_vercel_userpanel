import AccountSettingsLayout from '../components/layouts/accountsettingLayout';
import AccountSettingsSidebar from './sideBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountSettingsLayout>
      <div className="flex h-full">
        <div className="w-full hidden md:block md:w-[35%] h-full overflow-auto border-r">
          <AccountSettingsSidebar />
        </div>
        <div className="w-full md:w-[65%] h-full overflow-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </AccountSettingsLayout>
  );
}
