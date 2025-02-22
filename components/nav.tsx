import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function MainNav() {
  return (
    <header className="p-4">
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
          <Button variant={"default"}>Sign up</Button>
          <Button variant={"outline"}>Sign in</Button>
        </div>
      </nav>
    </header>
  );
}
