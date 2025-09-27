// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to login when visiting "/"
  redirect("/dashboard");
  return null; // Nothing will render since it redirects
}
