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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {departments.map((department) => (
        <Card key={department.id} className="w-96 min-w-64">
          <CardHeader>
            <CardTitle>{department.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Documents: {department.documentCount}</p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
}
