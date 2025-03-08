import React from "react";
import DepartmentClientComponent from "./department";
type DepartmentReq = {
  slug?: string;
  semester?: "1st" | "2nd" | "Not specified";
};

async function getDepartmentData({
  slug,
  semester = "Not specified",
}: DepartmentReq) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/departments?slug=eq.${slug}&select=*,docs(semester,name,url)&docs.semester=eq.${semester}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      method: "GET",
      next: { revalidate: 60 },
    }
  );

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const department = await getDepartmentData({ slug });

  if (!department) {
    return <p>Error: Department not found.</p>;
  }

  return <DepartmentClientComponent department={department} />;
}

export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/departments`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      method: "GET",
      next: { revalidate: 60 },
    }
  );
  const departments = await response.json();
  return departments?.map((department: { slug: string }) => ({
    slug: department.slug,
  }));
}
