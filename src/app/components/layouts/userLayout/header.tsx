import Profile from '../../header/profile';
import Logo from '../../logo';

export default function Header() {
  return (
    <div className="fixed top-0 flex px-6 py-[24px] justify-between  border-b  w-full bg-[#fff] z-50">
      <Logo />
      <Profile />
    </div>
  );
}
