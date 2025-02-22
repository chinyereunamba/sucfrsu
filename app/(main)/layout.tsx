import MainNav from "@/components/nav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SUCF RSU",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" max-w-7xl mx-auto">
      <MainNav />
      {children}
    </div>
  );
}
