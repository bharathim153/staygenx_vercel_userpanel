import GuestpageLayout from '../components/layouts/guestoageLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestpageLayout>
      <div className="Layout2">{children}</div>
    </GuestpageLayout>
  );
}
