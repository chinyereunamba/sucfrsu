import UploadForm from "@/components/dashboard/upload-form";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function Dashboard() {
  return (
    <section className="">
      <div id="header" className="pb-4">
        <h1 className="text-4xl">Welcome, Chinyere</h1>
      </div>

      <UploadForm />
    </section>
  );
}
