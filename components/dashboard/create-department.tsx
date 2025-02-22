"use client";
import { createDepartment } from "@/app/actions";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function CreateDpt() {
  const [name, setName] = useState("");
  const handleSubmit = async () => {
    if (!name.trim()) return alert("Department name cannot be empty!");

    try {
      await createDepartment(name);
      alert("Department created successfully!");
      setName(""); // Clear input after success
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            Create a new department by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=""
              placeholder="Biochemistry"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
