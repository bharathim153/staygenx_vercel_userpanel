import CreateListingLayout from '../components/layouts/createlistingLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CreateListingLayout>{children}</CreateListingLayout>;
}
