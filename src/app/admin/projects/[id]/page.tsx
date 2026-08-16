import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("slug", id).single();

  if (!project) notFound();

  return <ProjectForm project={project} />;
}
