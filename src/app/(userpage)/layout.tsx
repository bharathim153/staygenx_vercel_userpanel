import UserpageLayout from '../components/layouts/userpageLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserpageLayout>{children}</UserpageLayout>;
}
