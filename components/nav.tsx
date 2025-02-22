'use client'
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MainNav() {
  const router = useRouter()
  return (
    <header className="p-4 ">
      <nav className="flex justify-between items-center">
        <div className="logo">Logo</div>
        <ul className="flex items-center gap-4">
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/"}>Vision</Link>
          </li>
          <li>
            <Link href={"/"}>Role</Link>
          </li>
        </ul>
        <div className="flex gap-4 items-center">
          <Button variant={"default"} onClick={()=>router.push('/sign-up')}>Sign up</Button>
          <Button variant={"outline"} onClick={()=>router.push('/sign-in')}>Sign in</Button>
        </div>
      </nav>
    </header>
  );
}
