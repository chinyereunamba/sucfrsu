"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Documents = {
  id: string;
  name: string;
  department_id: number;
  url: string;
  created_at: string;
  semester?: "1st" | "2nd" | "Not specified";
};

export const columns: ColumnDef<Documents>[] = [
  {
    accessorKey: "id",
    header: "S/n",
  },
  {
    accessorKey: "name",
    header: "Department",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "created_at",
    header: "Date uploaded",
  },
];
