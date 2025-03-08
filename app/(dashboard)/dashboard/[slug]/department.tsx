"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import Upload from "@/components/dashboard/upload";
import Title from "@/components/custom/title";

export default function DepartmentClientComponent({
  department,
}: {
  department: any;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      setData(await getDocData({ department_id: department.id }));
    };
    getData();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <p>Loading...</p>;
  }

  return (
    <section className="space-y-6">
      <Title content={department.name} />

      <DataTable
        columns={columns}
        data={data}
        uploadBtn={<Upload department={department} />}
      />
    </section>
  );
}

async function getDocData({ department_id }: { department_id: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/docs?department_id=eq.${department_id}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      method: "GET",
      next: { revalidate: 60 },
    }
  );

  const data = response.json();
  return data;
}
