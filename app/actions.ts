"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export async function getDepartments() {
  const supabase = await createClient();
  const { data: departments, error: deptError } = await supabase
    .from("departments")
    .select("*");
  const departmentCounts = await Promise.all(
    departments!.map(async (department) => {
      const { count, error: countError } = await supabase
        .from("storage.objects")
        .select("*", { count: "exact", head: true })
        .ilike("name", `${department.name}/%`);

      return {
        ...(department ?? []),
        documentCount: count ?? 0, // If no files, return 0
      };
    })
  );
  if (deptError) throw deptError;
  return departmentCounts;
}

export async function getFiles(departmentSlug?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("bucket")
    .list(departmentSlug || "");

  if (error) throw error;

  return data.map((file) => ({
    name: file.name,
    url: supabase.storage
      .from("bucket")
      .getPublicUrl(`${departmentSlug}/${file.name}`).data.publicUrl,
    uploadedAt: file.created_at,
  }));
}

export async function createDepartment(name: string) {
  const supabase = await createClient();
  // Insert department into DB
  const { data, error } = await supabase.from("departments").insert([{ name }]);

  if (error) throw error;
  revalidatePath("/dashboard");
  return data;
}

export async function uploadFile(formData: FormData) {
  const supabase = await createClient(); 

  const file = formData.get("file") as File;
  const department = formData.get("department") as string;
  const department_id = formData.get("department_id") as string;
  const semester = formData.get("semester") as string;
  let label = formData.get("label") as string | null;

  // 🛑 Validate required fields
  if (!file) throw new Error("No file uploaded");
  if (!department) throw new Error("No department selected");
  if (!department_id) throw new Error("No department id not found");
  if (!semester) throw new Error("Semester not specified");

  // 📌 Default label to department if not provided
  if (!label || label.trim() === "") {
    label = department;
  }

  // 🔄 Generate a unique file name
  const fileExtension = file.name.split(".").pop();
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const sanitizedLabel = label.replace(/\s+/g, "-").toLowerCase();
  const newFileName = `${sanitizedLabel}-${timestamp}.${fileExtension}`;

  // 📁 Upload file to Supabase Storage (inside the department folder)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("bucket")
    .upload(`${department}/${newFileName}`, file);
  
  console.log(uploadData)

  if (uploadError)
    throw new Error(`File upload failed: ${uploadError.message}`);

  // 🔗 Get the public URL for the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from("bucket")
    .getPublicUrl(`${department}/${newFileName}`);
  
  console.log(publicUrlData)

  if (!publicUrlData.publicUrl) throw new Error("Failed to retrieve file URL");

  // ✅ Insert document metadata into the database
  const { error: insertError } = await supabase.from("docs").insert([
    {
      name: label,
      url: publicUrlData.publicUrl, // Store the file URL
      semester: semester,
      department_id: department_id, // Store department name or ID (if using foreign key)
    },
  ]);

  console.log(insertError);
  if (insertError)
    throw new Error(`Database insert failed: ${insertError.message}`);

  // 🔄 Revalidate the department page
  revalidatePath(`/dashboard/${slug}`);

  return { success: true, path: publicUrlData.publicUrl };
}