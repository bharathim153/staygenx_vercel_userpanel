import BookingLayout from '../components/layouts/bookingLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BookingLayout>{children}</BookingLayout>;
}
