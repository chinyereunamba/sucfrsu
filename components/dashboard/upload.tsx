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
import { SubmitButton } from "../submit-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  label: z.string().min(2).max(50),
  department: z.string().min(2).max(50),
  file: z.instanceof(File).optional(),
  semester: z.string().min(2).max(20),
  department_id: z.string(),
  slug: z.string(),
});

export function UploadForm({ department }: { department: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      department: department.name,
      semester: "Not specified",
      file: undefined,
      department_id: department.id,
      slug: department.slug,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return alert("No file selected");

    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("department", values.department);
    formData.append("label", values.label);
    formData.append("semester", values.semester);
    formData.append("department_id", values.department_id);
    formData.append("slug", values.slug);

    console.log(
      "Submitting form with:",
      Object.fromEntries(formData.entries())
    );

    try {
      const response = await uploadFile(formData);
      toast.success("File uploaded successfully!", {
        description: `Uploaded on ${new Date().toDateString()}`,
      });
      setLoading(true);
      console.log("Uploaded Path:", response.path);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
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
                <FormLabel>File Name</FormLabel>
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
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1st">1st semester</SelectItem>
                      <SelectItem value="2nd">2nd semester</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                      if (selectedFile) {
                        form.setValue("file", selectedFile, {
                          shouldValidate: true,
                        });
                      }
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
        <Button type="submit">{loading ? "Uploading" : "Upload File"}</Button>
      </form>
    </Form>
  );
}

export default function DialogDemo({ department }: { department: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Upload File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload past questions and course materials here.
          </DialogDescription>
        </DialogHeader>

        <UploadForm department={department} />
      </DialogContent>
    </Dialog>
  );
}
