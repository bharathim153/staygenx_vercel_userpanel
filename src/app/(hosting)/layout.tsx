import HostingLayout from '../components/layouts/hostLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <HostingLayout>{children}</HostingLayout>;
}
