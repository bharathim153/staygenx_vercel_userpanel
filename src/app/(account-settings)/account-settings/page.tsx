import AccountSettingsSidebar from '../sideBar';
import PersonalInfo from '@/app/components/ui/account-settings/personal-info';

export default function Accountsettings() {
  return (
    <>
      <div className="block md:hidden">
        <AccountSettingsSidebar />
      </div>
      <div className="hidden md:block">
        <PersonalInfo />
      </div>
    </>
  );
}
