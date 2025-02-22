import Link from "next/link";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 min-h-[60vh]">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Our Christian Fellowship
      </h1>
      <p className="text-xl text-center max-w-2xl">
        Join us in our journey of faith, love, and community. Share and explore
        resources that strengthen our spiritual growth.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/dashboard">Upload Files</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/files">View Files</Link>
        </Button>
      </div>
    </div>
  );
}
