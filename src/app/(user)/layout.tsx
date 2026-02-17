import UserLayout from '../components/layouts/userLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserLayout>
      <div className="mt-0 md:mt-[90px] ">{children}</div>
    </UserLayout>
  );
}
