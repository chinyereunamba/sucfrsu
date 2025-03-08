import { getDepartments } from "@/app/actions";
import { CreateDpt } from "@/components/dashboard/create-department";
import UploadForm from "@/components/dashboard/upload-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import React, { useState } from "react";

export default function Dashboard() {
  return (
    <section className="">
      <div id="header" className="">
        <h1 className="text-3xl">Welcome</h1>
      </div>
      <UploadForm />
      <CreateDpt />

      <div>
        <h2>Departments</h2>
        <div className="my-4">
          <Input type="search" placeholder="Search departments..." />
        </div>
        <div>
          <DepartmentList />
        </div>
      </div>
    </section>
  );
}

export async function DepartmentList() {
  const departments = await getDepartments();
  return (
    <div className="block space-y-2">
      {departments.map((department) => (
        <Card key={department.id} className="w-full flex justify-between">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <Link href={`/dashboard/${department.slug}/`}>
                {department.name}
              </Link>
            </CardTitle>
            <p>Number of Documents: {department.documentCount}</p>
          </CardHeader>

          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
}
