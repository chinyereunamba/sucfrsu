"use client";

import { Button } from "@/components/ui/button";
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
    enableHiding: false,
  },
  {
    accessorKey: "url",
    header: "Download link",
    id: "actions",
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(row.getValue('url'), '_blank')}
      >
        Download
      </Button>
    ),
  },
];
