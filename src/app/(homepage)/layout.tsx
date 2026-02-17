import HomepageLayout from '../components/layouts/homepageLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <HomepageLayout>{children}</HomepageLayout>;
}
