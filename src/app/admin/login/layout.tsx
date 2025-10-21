// This layout prevents the parent admin layout from wrapping the login page
// avoiding the infinite redirect loop
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}