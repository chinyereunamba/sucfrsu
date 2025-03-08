export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12 items-start min-h-screen justify-center w-full">
      {children}
    </div>
  );
}
