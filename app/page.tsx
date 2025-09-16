// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to dashboard when visiting "/"
  redirect("/dashboard");
  return null; // Nothing will render since it redirects
}
