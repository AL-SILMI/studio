import { Header } from '@/components/header';

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </>
  );
}
