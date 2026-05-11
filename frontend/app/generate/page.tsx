// Redirect old /generate page to /workspace
import { redirect } from "next/navigation";

export default function GeneratePage() {
  redirect("/workspace");
}
