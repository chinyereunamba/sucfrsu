"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadFile } from "@/app/actions";
import { toast } from "sonner";

const formSchema = z.object({
  label: z.string().min(2).max(50),
  department: z.string().min(2).max(50),
  file: z.instanceof(File).optional(),
});

export function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      department: "",
      file: undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return alert("No file selected");
    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("department", values.department);
    formData.append("label", values.label);

    try {
      const response = await uploadFile(formData);
      const d = new Date();
      toast("File uploaded successfully!", {
        description: `${d.toDateString()}"`,
      });
      alert("File uploaded successfully!");

      console.log("Uploaded Path:", response.path);
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="BIO 101 First Semester"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormDescription>
                  This is the content title of the file been uploaded
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Label</FormLabel>
                <FormControl>
                  <Input placeholder="Biochemistry" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      onChange(selectedFile || null);
                    }}
                    {...rest}
                  />
                </FormControl>
                {value && <p className="text-sm text-gray-500">{value.name}</p>}{" "}
                {/* Show selected file name */}
                <FormDescription>
                  File size should not be more than 20 MB
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">
          {loading ? "Uploading..." : "Upload File"}
        </Button>
      </form>
    </Form>
  );
}

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload past questions and course materials here.
          </DialogDescription>
        </DialogHeader>

        <UploadForm />
      </DialogContent>
    </Dialog>
  );
}
